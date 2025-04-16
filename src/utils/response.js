/**
 * Sends a standardized success response.
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object|null} data - Response data
 * @param {string} message - Success message
 */
const sendSuccessResponse = (res, statusCode, data, message) => {
    res.status(statusCode).json({
      status: 'success',
      data,
      message,
    });
  };
  
  module.exports = { sendSuccessResponse };