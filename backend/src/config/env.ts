import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/dbu_security',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  UPLOAD_DIR: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
