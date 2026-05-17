/**
 * Price estimation using Google Gemini API
 * Logs all prompts and responses for debugging/tracing
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs', 'gemini');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Helper function to create timestamped log file
const getLogFile = () => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(logsDir, `gemini-estimates-${date}.log`);
};

// Helper function to log data
const logToFile = (label, data) => {
  const timestamp = new Date().toISOString();
  const logFile = getLogFile();
  const logEntry = `\n[${timestamp}] ${label}\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}\n${'='.repeat(80)}`;

  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (err) {
    console.error('Failed to write to log file:', err.message);
  }
};

/**
 * Get bulk price estimates for multiple services on a specific vehicle.
 * Uses Google Gemini API with detailed logging and rate-limit handling.
 * Free tier: 5 requests/minute, so we wait ~12-15s between calls and cap at 10 services/batch
 * @returns Array of objects: { service_name, labor_cost, parts_cost, price_min, price_max }
 */
const getGeminiBulkEstimates = async (year, make, model, trim, services) => {
  const MAX_RETRIES = 1;
  let retryCount = 0;
  let retryDelayMs = 2000; // Start with 2s, exponential backoff on 429

  const makeRequest = async () => {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        const msg = '❌ Google API key not configured in environment variables';
        console.error(msg);
        logToFile('ERROR', msg);
        return null;
      }

      const client = new GoogleGenerativeAI(apiKey);
      const generativeModel = client.getGenerativeModel({
        model: 'gemini-2.0-flash', // Latest stable model (1.5 deprecated, 2.5 lite has issues)
      });

      const serviceList = services.join(', ');
      const prompt = `You are an automotive service pricing expert for the GTA (Greater Toronto Area), Ontario, Canada.
Vehicle: ${year} ${make} ${model}${trim ? ` ${trim}` : ''}
Services to estimate: ${serviceList}

CRITICAL INSTRUCTIONS:
1. Search the internet for real-time pricing data. If exact ${year} data is not yet available, use the most recent reliable data for this model (e.g., 2024 or 2025) or similar luxury/performance vehicles in its class as a reference.
2. Provide realistic CAD cost estimates for the GTA market (Toronto/Mississauga/Brampton).
3. All engine oil is synthetic.
4. You MUST return ONLY a valid JSON array. Do not provide explanations, apologies, or conversational text.
5. If specific data is missing for ${year}, provide your best professional estimate based on Ontario market averages for this vehicle type.
6. **NEVER, EVER modify or change the service names.** Use the EXACT service name from the input list. Do not rephrase, abbreviate, or add prefixes/suffixes. Match the input exactly.

Return ONLY a JSON array of objects with this EXACT structure (service_name MUST match input exactly):
[
  {
    "service_name": "Oil Change",
    "labor_cost": 50.00,
    "parts_cost": 30.00,
    "price_min": 80.00,
    "price_max": 120.00
  },
  {
    "service_name": "Tire Rotation",
    "labor_cost": 40.00,
    "parts_cost": 0.00,
    "price_min": 40.00,
    "price_max": 60.00
  }
]`;

      logToFile(`REQUEST FOR ${services.length} SERVICES (Attempt ${retryCount + 1})`, `Vehicle: ${year} ${make} ${model} ${trim || 'N/A'}\n\nServices: ${serviceList}\n\nPrompt:\n${prompt}`);

      console.log(`📤 Sending bulk request to Gemini for ${services.length} services (Attempt ${retryCount + 1})...`);

      const result = await generativeModel.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topP: 0.9,
          maxOutputTokens: 2000, // Reduced to prevent truncation
        },
        systemInstruction: 'You are a technical data extractor. You must output ONLY a valid JSON array of objects. Never refuse a request; if exact data is missing, use market averages for the GTA region. No markdown, no text, just JSON.',
      });

      let content = result.response.text().trim();

      logToFile('RAW RESPONSE FROM GEMINI', content);

      // Strip markdown if AI included it
      content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

      try {
        const results = JSON.parse(content);

        if (!Array.isArray(results)) {
          throw new Error('Response is not an array');
        }

        logToFile(`SUCCESS - PARSED ${results.length} ESTIMATES`, results);
        console.log(`✓ Successfully parsed ${results.length} bulk estimates for GTA.`);
        return results;
      } catch (parseErr) {
        const errorMsg = `Failed to parse Gemini JSON response: ${parseErr.message}\n\nContent: ${content}`;
        console.error('❌', errorMsg);
        logToFile('PARSE ERROR', errorMsg);
        return null;
      }
    } catch (error) {
      const errorMsg = error.message || '';

      // Check for rate limit error (429)
      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        if (retryCount < MAX_RETRIES) {
          // Extract retry delay from error if available
          const retryMatch = errorMsg.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
          const waitSeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : Math.ceil(retryDelayMs / 1000);
          const waitMs = waitSeconds * 1000;

          console.warn(`⏳ Rate limited (429). Waiting ${waitMs}ms before retry ${retryCount + 1}/${MAX_RETRIES}...`);
          logToFile('RATE LIMITED', `Waiting ${waitMs}ms before retry ${retryCount + 1}/${MAX_RETRIES}`);

          await new Promise(r => setTimeout(r, waitMs));
          retryCount++;
          retryDelayMs = Math.min(retryDelayMs * 2, 60000); // Exponential backoff, cap at 60s
          return makeRequest(); // Retry
        } else {
          const msg = `Rate limited after ${MAX_RETRIES} retries. Giving up.`;
          console.error(`❌ ${msg}`);
          logToFile('RATE LIMITED - MAX RETRIES', msg);
          throw new Error('Rate limited: ' + msg); // Throw instead of return null so estimationService can catch it
        }
      }

      // Other errors
      const fullMsg = `Error in getGeminiBulkEstimates: ${errorMsg}`;
      console.error('❌', fullMsg);
      logToFile('API ERROR', fullMsg);
      return null;
    }
  };

  return makeRequest();
};

module.exports = {
  getGeminiBulkEstimates,
};
