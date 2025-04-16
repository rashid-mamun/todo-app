const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const todoSchema = require('../validators/todo');
const ApiError = require('../utils/apiError');
const { sendSuccessResponse } = require('../utils/response');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');

/**
 * Validates todo request body.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateTodo = async (req, res, next) => {
  try {
    await todoSchema.validateAsync(req.body);
    next();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

/**
 * Todo routes.
 */
router
  .route('/')
  .get(auth, async (req, res) => {
    const todos = await Todo.find({ user: req.user.userId })
      .select('-_id -date -user -__v')
      .limit(10)
      .lean();
    sendSuccessResponse(res, httpStatus.OK, todos, messages.SUCCESS.TODO_RETRIEVED);
  })
  .post(auth, validateTodo, async (req, res) => {
    const todo = new Todo({
      ...req.body,
      user: req.user.userId,
    });
    await todo.save();
    sendSuccessResponse(res, httpStatus.CREATED, null, messages.SUCCESS.TODO_CREATED);
  });

router.post('/all', auth, async (req, res) => {
  const todos = req.body.map((todo) => ({
    ...todo,
    user: req.user.userId,
  }));
  await Todo.insertMany(todos);
  sendSuccessResponse(res, httpStatus.CREATED, null, messages.SUCCESS.TODOS_CREATED);
});

router
  .route('/:id')
  .get(auth, validateObjectId('id'), async (req, res) => {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.userId }).lean();
    if (!todo) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.ERROR.TODO_NOT_FOUND);
    }
    sendSuccessResponse(res, httpStatus.OK, todo, messages.SUCCESS.TODO_RETRIEVED);
  })
  .put(auth, validateObjectId('id'), validateTodo, async (req, res) => {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    if (!todo) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.ERROR.TODO_NOT_FOUND);
    }
    sendSuccessResponse(res, httpStatus.OK, null, messages.SUCCESS.TODO_UPDATED);
  })
  .delete(auth, validateObjectId('id'), async (req, res) => {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!todo) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.ERROR.TODO_NOT_FOUND);
    }
    sendSuccessResponse(res, httpStatus.OK, null, messages.SUCCESS.TODO_DELETED);
  });

module.exports = router;