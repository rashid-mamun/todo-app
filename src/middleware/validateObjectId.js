const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');

/**
 * Validates MongoDB ObjectID in route parameters.
 * @param {string} paramName - Name of the parameter to validate
 * @returns {Function} Express middleware
 */
const validateObjectId = (paramName) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.ERROR.INVALID_ID);
  }
  next();
};

module.exports = validateObjectId;