const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const todoRoutes = require('./routes/todo');
const userRoutes = require('./routes/user');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');
const httpStatus = require('./constants/httpStatus');
const messages = require('./constants/messages');

/**
 * Initializes Express application.
 * @returns {Object} Express app instance
 */
const app = express();

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 'error',
    message: messages.ERROR.TOO_MANY_REQUESTS,
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(generalLimiter);
app.use(requestLogger);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;