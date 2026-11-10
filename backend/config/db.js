import mongoose from 'mongoose';

/**
 * Connect to MongoDB database instance.
 * In production we prefer MongoDB, but we never crash the whole service
 * if the URI is missing or connection fails — we fall back to in-memory storage.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB] MONGODB_URI is not set. Using in-memory storage only.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn('[MongoDB] Falling back to in-memory storage.');
    return null;
  }
};
