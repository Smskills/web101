
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASS: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'smskills_db',
    PORT: parseInt(process.env.DB_PORT || '3306'),
  },
  JWT_SECRET: process.env.JWT_SECRET || 'super_strong_secret_key_change_later',
  UPLOAD_LIMIT: process.env.UPLOAD_LIMIT || '10mb',
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.SMTP_PORT || '587'),
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASS || '',
    // Convert string "false" or "true" from .env correctly
    SECURE: process.env.SMTP_SECURE === 'true' 
  }
};
