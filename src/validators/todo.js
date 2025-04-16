const Joi = require('joi');

/**
 * Joi schema for validating todo data.
 */
const todoSchema = Joi.object({
  title: Joi.string().required().trim().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().allow('').messages({
    'string.base': 'Description must be a string',
  }),
  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'any.only': 'Status must be active or inactive',
  }),
});

module.exports = todoSchema;