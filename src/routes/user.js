const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/user');
const config = require('../config');
const upload = require('../utils/upload');
const { signupSchema, loginSchema } = require('../validators/user');
const ApiError = require('../utils/apiError');
const { sendSuccessResponse } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');

/**
 * Validates user request body.
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

/**
 * Rate limiter for login route.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    status: 'error',
    message: messages.ERROR.TOO_MANY_LOGIN_ATTEMPTS,
  },
});

/**
 * User routes.
 */
router.post('/signup', validateUser(signupSchema), async (req, res) => {
  const { name, username, password } = req.body;
  const existingUser = await User.findOne({ username }).lean();
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.ERROR.USER_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    username,
    password: hashedPassword,
  });
  await user.save();

  sendSuccessResponse(res, httpStatus.CREATED, null, messages.SUCCESS.SIGNUP);
});

router.post('/login', loginLimiter, validateUser(loginSchema), async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messages.ERROR.AUTH_FAILED);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messages.ERROR.AUTH_FAILED);
  }

  const token = jwt.sign(
    { username: user.username, userId: user._id },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  sendSuccessResponse(res, httpStatus.OK, { access_token: token }, messages.SUCCESS.LOGIN);
});

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.ERROR.NO_FILE);
  }

  const avatarPath = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user.userId, { avatar: avatarPath });

  sendSuccessResponse(res, httpStatus.OK, { avatar: avatarPath }, messages.SUCCESS.AVATAR_UPLOADED);
});

module.exports = router;