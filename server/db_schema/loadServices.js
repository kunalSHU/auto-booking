#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load .env file with explicit error checking
const envPath = path.join(__dirname, '../.env');
const result = require('dotenv').config({ path: envPath });

if (result.error && result.error.code !== 'ENOENT') {
  console.error(`Error loading .env file from ${envPath}:`, result.error);
}

// Validate environment variables
if (!process.env.DB_PASSWORD) {
  console.error('ERROR: DB_PASSWORD is not set in environment variables');
  console.error(`Tried loading from: ${envPath}`);
  console.error('Available DB_* variables:', {
    DB_USER: process.env.DB_USER ? '***set***' : 'not set',
    DB_PASSWORD: process.env.DB_PASSWORD ? '***set***' : 'not set',
    DB_HOST: process.env.DB_HOST ? '***set***' : 'not set',
    DB_PORT: process.env.DB_PORT ? '***set***' : 'not set',
    DB_NAME: process.env.DB_NAME ? '***set***' : 'not set',
  });
  process.exit(1);
}

const CSV_FILE = process.argv[2] || path.join(__dirname, 'services.csv');
const INSERT_FILE = path.join(__dirname, 'service_inserts.sql');

// PostgreSQL client configuration
const client = new Client({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
});

/**
 * Parse CSV file handling row-spanning services where questions/answers span multiple rows
 * Row structure:
 * - First row of service: Category, Service, Q1, Answers1, EstTime, Description, Active
 * - Continuation rows: empty, empty, Q2, Answers2, empty, empty, empty
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parseCSVRecords(content);

  if (records.length === 0) return [];

  // Skip header row
  const dataRows = records.slice(1);
  const services = [];
  let currentService = null;

  for (const row of dataRows) {
    const [category, service, question, answers, estimatedTime, description, serviceActive] = row;

    // Check if this is a new service (has category and service name)
    if (category && category.trim() && service && service.trim()) {
      // Save previous service if exists
      if (currentService) {
        services.push(currentService);
      }

      // Start new service
      currentService = {
        category: category.trim(),
        service: service.trim(),
        estimatedTime: estimatedTime.trim(),
        description: description.trim(),
        serviceActive: serviceActive.toLowerCase().trim() === 'y' ||
                      serviceActive.toLowerCase().trim() === 'true' ||
                      serviceActive.toLowerCase().trim() === 'yes',
        questionsAndAnswers: [],
      };

      // Add first question if present
      if (question && question.trim()) {
        currentService.questionsAndAnswers.push({
          question: question.trim(),
          answers: answers.trim(),
        });
      }
    } else if (currentService && question && question.trim()) {
      // This is a continuation row with more questions
      currentService.questionsAndAnswers.push({
        question: question.trim(),
        answers: answers.trim(),
      });
    }
  }

  // Don't forget the last service
  if (currentService) {
    services.push(currentService);
  }

  return services;
}

/**
 * Parse CSV content into array of row arrays, handling quoted fields properly
 */
function parseCSVRecords(content) {
  const records = [];
  let record = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        field += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      record.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of record
      if (field || record.length > 0) {
        record.push(field);
      }
      if (record.length > 0) {
        records.push(record);
        record = [];
      }
      field = '';
      // Skip \r\n combination
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      field += char;
    }
  }

  // Add final field and record
  if (field || record.length > 0) {
    record.push(field);
  }
  if (record.length > 0) {
    records.push(record);
  }

  return records;
}

/**
 * Parse a question to extract the question text and question number
 * Extracts number prefix like "1.", "1.1", etc.
 */
function parseQuestion(questionString) {
  // Remove numbering prefix (e.g., "1.", "1.1", "2. ", etc.)
  const cleaned = questionString.replace(/^\d+(\.\d+)?\s*\.\s*/, '').trim();
  return cleaned;
}

/**
 * Parse answers for a question from the raw answer string
 * Answer format:
 * 1.1  Y
 * 1.2  N
 * 1.3  Not sure
 */
function parseAnswers(answerString) {
  if (!answerString) return [];

  const answers = [];
  const lines = answerString
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (const line of lines) {
    // Remove answer numbering (e.g., "1.1  ", "2.1  ")
    const answerText = line.replace(/^\d+(\.\d+)?\s+/, '').trim();

    if (answerText) {
      answers.push({
        text: answerText,
        // Determine if it's a predefined option (contains words) or Y/N style
        isOption: !answerText.match(/^[YN]$/) && !answerText.match(/^(Yes|No|Y|N|True|False)$/i),
      });
    }
  }

  return answers;
}

/**
 * Parse estimated time from range format
 */
function parseEstimatedTime(timeString) {
  const match = timeString.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (match) {
    return `[${match[1]},${match[2]}]`;
  }
  return '[0,0]';
}

/**
 * Escape single quotes for SQL
 */
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

/**
 * Generate SQL INSERT statements (for debugging/backup only)
 */
function generateSQL(services) {
  let sql = '-- Generated SQL insert statements from loadServices.js\n';
  sql += '-- This file is for reference only and is not used for insertion\n\n';

  for (const service of services) {
    if (!service.service || !service.category) continue;

    const category = escapeSql(service.category);
    const serviceName = escapeSql(service.service);
    const description = escapeSql(service.description);
    const estimatedTime = parseEstimatedTime(service.estimatedTime);
    const serviceActive = service.serviceActive ? 'true' : 'false';

    sql += `-- Service: ${serviceName}\n`;
    sql += `INSERT INTO "Services" (category, name, description, service_active, created_at) ` +
           `VALUES ('${category}', '${serviceName}', '${description}', ${serviceActive}, NOW());\n`;

    // Add questions and answers as comments
    for (const qaPair of service.questionsAndAnswers) {
      const questionText = parseQuestion(qaPair.question);
      sql += `-- Question: ${questionText}\n`;

      const answers = parseAnswers(qaPair.answers);
      for (const answer of answers) {
        sql += `-- Answer: ${answer.text} (Option: ${answer.isOption})\n`;
      }
    }
    sql += '\n';
  }

  return sql;
}

/**
 * Insert data into database
 */
async function insertData(services) {
  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log(`Processing ${services.length} services...`);

    for (const service of services) {
      // Skip empty services
      if (!service.service || !service.category) continue;

      const category = escapeSql(service.category);
      const serviceName = escapeSql(service.service);
      const description = escapeSql(service.description);
      const estimatedTime = parseEstimatedTime(service.estimatedTime);
      const serviceActive = service.serviceActive ? true : false;

      console.log(`Inserting service: ${service.service}`);

      // Insert into Services table
      const serviceResult = await client.query(
        `INSERT INTO "Services" (category, name, description, service_active, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING service_id`,
        [category, serviceName, description, serviceActive]
      );

      const serviceId = serviceResult.rows[0].service_id;

      // Parse and insert questions with their answers
      for (let qIdx = 0; qIdx < service.questionsAndAnswers.length; qIdx++) {
        const qaPair = service.questionsAndAnswers[qIdx];
        const questionText = parseQuestion(qaPair.question);

        const questionResult = await client.query(
          `INSERT INTO "PopupQuestions" (service_id, question_text, question_order, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING question_id`,
          [serviceId, questionText, qIdx]
        );

        const questionId = questionResult.rows[0].question_id;

        // Parse and insert answers for this question
        const answers = parseAnswers(qaPair.answers);
        for (let aIdx = 0; aIdx < answers.length; aIdx++) {
          const answer = answers[aIdx];

          await client.query(
            `INSERT INTO "PopupAnswers" (question_id, answer_text, is_option, answer_order, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [questionId, answer.text, answer.isOption, aIdx]
          );
        }
      }
    }

    console.log('Data insertion complete!');
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`Reading CSV file: ${CSV_FILE}`);

    if (!fs.existsSync(CSV_FILE)) {
      console.error(`Error: CSV file not found at ${CSV_FILE}`);
      console.log('\nUsage: node loadServices.js [path-to-csv-file]');
      console.log('Default: node loadServices.js services.csv');
      process.exit(1);
    }

    const services = parseCSV(CSV_FILE);
    console.log(`✓ Found ${services.length} services with questions and answers\n`);

    // Generate and save SQL (for debugging/backup)
    const sql = generateSQL(services);
    fs.writeFileSync(INSERT_FILE, sql);
    console.log(`SQL reference saved to: ${INSERT_FILE}`);

    // Insert into database
    await insertData(services);

    console.log('\n✓ Schema and data load complete.');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
