// lib/logger.js
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');

// ایجاد پوشه logs اگر وجود ندارد
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

export function logPayment(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        ...data
    };

    const logFile = path.join(LOG_DIR, `payment-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    // همچنین در کنسول نمایش بده
    console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`, data);
}

export const logger = {
    info: (message, data) => logPayment('info', message, data),
    error: (message, data) => logPayment('error', message, data),
    warn: (message, data) => logPayment('warn', message, data),
    debug: (message, data) => logPayment('debug', message, data)
};