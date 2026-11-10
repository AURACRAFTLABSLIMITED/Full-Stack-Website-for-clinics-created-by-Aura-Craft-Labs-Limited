import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
// - Local development
// - Any Vercel preview / production domain (*.vercel.app)
// - Custom domain via CLIENT_URL env var
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow all Vercel domains + configured origins
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      (process.env.NODE_ENV === 'production' && origin.includes(process.env.VERCEL_URL || ''))
    ) {
      return callback(null, true);
    }

    // In development be more permissive
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    clinic: 'Aura Medical & Aesthetic Clinic DHA Lahore',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/appointments', appointmentRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Export the Express app for Vercel (serverless / services)
// Local development still starts the server with app.listen
export default app;

// Only start listening when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Aura Clinic Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}
