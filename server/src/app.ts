import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'homechef_development_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'HomeChef Board API',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRouter);

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🍳 HomeChef Board backend server running on http://localhost:${PORT}`);
  console.log(`📡 Accepting requests from ${CLIENT_URL}`);
});

export default app;
