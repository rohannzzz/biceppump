const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/authRoutes.js")
const workoutRoutes = require("./routes/workoutRoutes.js")
const exerciseRoutes = require("./routes/exerciseRoutes.js")
const analyticsRoutes = require("./routes/analyticsRoutes.js")
const leaderboardRoutes = require("./routes/leaderboardRoutes.js")

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'BicepPump Backend API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;