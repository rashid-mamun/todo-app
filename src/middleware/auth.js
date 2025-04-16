const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/apiError');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');

/**
 * Authenticates requests using JWT.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messages.ERROR.NO_TOKEN);
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { username: decoded.username, userId: decoded.userId };
    next();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messages.ERROR.INVALID_TOKEN);
  }
};

module.exports = auth;