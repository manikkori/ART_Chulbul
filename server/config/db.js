import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // 1. Try URI if defined and external (Atlas or remote)
  if (uri && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[Database] Remote MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Remote MongoDB connection failed: ${err.message}`);
    }
  }

  // 2. Try localhost standard port 27017
  try {
    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/artchulbul', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    // 3. Fallback to embedded MongoDB with persistent disk storage in server/data/db
    console.log(`[Database] Local mongod not running on 27017. Starting persistent embedded MongoDB...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const dbPath = path.resolve(__dirname, '../data/db');
      
      memoryServer = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      const persistentUri = memoryServer.getUri();
      const conn = await mongoose.connect(persistentUri);
      console.log(`[Database] Embedded Persistent MongoDB running at: ${persistentUri}`);
      return conn;
    } catch (embeddedErr) {
      // If port 27017 was somehow taken or permission issue, fallback to dynamic port
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const fallbackUri = memoryServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`[Database] Embedded Memory MongoDB running at: ${fallbackUri}`);
        return conn;
      } catch (finalErr) {
        console.error(`[Database] Failed to connect to any MongoDB: ${finalErr.message}`);
        throw finalErr;
      }
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

export default connectDB;
