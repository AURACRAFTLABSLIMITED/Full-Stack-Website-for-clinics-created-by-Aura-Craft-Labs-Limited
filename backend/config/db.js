import mongoose from 'mongoose';

/**
 * Connect to MongoDB database instance
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[MongoDB] MONGODB_URI environment variable is not set.');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    // Allow application to proceed in fallback mode (in-memory) during local offline testing
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};
