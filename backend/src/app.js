const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');
const { logger } = require('./middleware/loggerMiddleware');

// Load environment variables

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Logger Middleware
app.use(logger);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/breaches', require('./routes/breachRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'DigiShield API is running securely.' });
});

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
