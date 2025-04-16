/**
 * Common error and success messages.
 */
module.exports = {
    SUCCESS: {
      SIGNUP: 'Signup successful',
      LOGIN: 'Login successful',
      TODO_CREATED: 'Todo created successfully',
      TODOS_CREATED: 'Todos created successfully',
      TODO_RETRIEVED: 'Todos retrieved successfully',
      TODO_UPDATED: 'Todo updated successfully',
      TODO_DELETED: 'Todo deleted successfully',
      AVATAR_UPLOADED: 'Avatar uploaded successfully',
    },
    ERROR: {
      INVALID_TOKEN: 'Authentication failed: Invalid token',
      NO_TOKEN: 'Authentication failed: No token provided',
      USER_EXISTS: 'Username already exists',
      AUTH_FAILED: 'Authentication failed',
      TODO_NOT_FOUND: 'Todo not found',
      INVALID_ID: 'Invalid ObjectID',
      NO_FILE: 'No file uploaded',
      INVALID_FILE: 'Only .jpg, .png, or .jpeg format allowed',
      TOO_MANY_REQUESTS: 'Too many requests, please try again later',
      TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts, please try again after 15 minutes',
      SERVER_ERROR: 'Internal server error',
    },
  };