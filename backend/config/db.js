import mongoose from 'mongoose';

/**
 * Connect to MongoDB database instance.
 * In production we prefer MongoDB, but we never crash the whole service
 * if the URI is missing or connection fails — we fall back to in-memory storage.
 */
let connectionPromise = null;

export const connectDB = async () => {
  // Already connected (warm serverless instance) - reuse it
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  // Connection already in progress - wait for the same one
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB] MONGODB_URI is not set. Using in-memory storage only.');
    return null;
  }

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // fail fast
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB Connection Error] ${error.message}`);
      console.warn('[MongoDB] Falling back to in-memory storage.');
      connectionPromise = null; // allow retry on next request
      return null;
    }
  })();

  return connectionPromise;
};
