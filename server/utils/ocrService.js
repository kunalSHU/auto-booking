/**
 * OCR Service - Initializes Python OCR process on server startup
 * This handles model downloading and caching on first run
 */

const { spawn } = require('child_process');
const path = require('path');

let ocrProcess = null;
let isInitialized = false;
let initPromise = null;

/**
 * Initialize OCR service by starting Python subprocess
 * Models will be downloaded on first run (takes 1-10 minutes)
 */
function initializeOCR() {
  if (isInitialized) {
    return Promise.resolve();
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = new Promise((resolve, reject) => {
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    const ocrScript = path.join(__dirname, 'ocrInit.py');

    console.log('[OCR] Initializing EasyOCR... This may take 1-10 minutes on first run.');

    ocrProcess = spawn(pythonCommand, [ocrScript], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      timeout: 600000, // 10 minute timeout for model download
    });

    let stdout = '';
    let stderr = '';

    ocrProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log('[OCR stdout]', data.toString().trim());
    });

    ocrProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log('[OCR stderr]', data.toString().trim());
    });

    ocrProcess.on('close', (code) => {
      if (code === 0) {
        console.log('[OCR] Initialization complete! Models are ready.');
        isInitialized = true;
        resolve();
      } else {
        reject(new Error(`OCR initialization failed with code ${code}: ${stderr}`));
      }
    });

    ocrProcess.on('error', (err) => {
      reject(new Error(`Failed to start OCR process: ${err.message}`));
    });
  });

  return initPromise;
}

/**
 * Check if OCR is ready
 */
function isOCRReady() {
  return isInitialized;
}

module.exports = {
  initializeOCR,
  isOCRReady,
};
