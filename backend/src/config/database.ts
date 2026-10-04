import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  // First try connecting to the configured MongoDB URI
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch {
    console.warn('⚠️  Could not connect to configured MongoDB URI. Trying in-memory fallback...');
  }

  // Fallback: try mongodb-memory-server (no external MongoDB required)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: { launchTimeout: 60000 },
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ Using in-memory MongoDB (development mode)');
    console.log('   URI:', uri);
    console.log('   Note: Data will be lost when server restarts.');
    console.log('   Install MongoDB for persistent data: https://www.mongodb.com/try/download/community');
    return;
  } catch (mmsErr) {
    console.warn('⚠️  mongodb-memory-server not available:', (mmsErr as Error).message);
  }

  // Final fallback: retry real MongoDB a few times
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(config.MONGODB_URI);
      isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Attempt ${attempt}/${MAX_RETRIES} Failed:`, (error as Error).message);
      if (attempt < MAX_RETRIES) {
        console.log(`   Retrying in ${RETRY_DELAY / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  console.error('⚠️  Could not connect to MongoDB.');
  console.error('   Please start MongoDB: net start MongoDB (as Administrator)');
  console.error('   Or install: winget install MongoDB.Server');
  // Don't exit — allow server to start
};
