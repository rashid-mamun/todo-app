const logger = require('./logger');
const ApiError = require('../utils/apiError');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');

/**
 * Global error handling middleware.
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || messages.ERROR.SERVER_ERROR;

  logger.error({
    statusCode,
    message,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    requestId: req.requestId,
    stack: err.stack,
  });

  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

module.exports = errorHandler;