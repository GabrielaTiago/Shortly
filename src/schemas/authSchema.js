import joi from 'joi';

const signInSchema = joi.object({
  email: joi.string().email().max(50).required().messages({
    'string.email': 'Invalid email format',
    'string.max': 'Email must be at most 50 characters long',
    'any.required': 'Email is required',
  }),
  password: joi.string().min(4).max(16).required().messages({
    'string.min': 'Password must be at least 4 characters long',
    'string.max': 'Password must be at most 16 characters long',
    'any.required': 'Password is required',
  }),
});

const signUpSchema = joi.object({
  name: joi.string().max(50).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.max': 'Name must be at most 50 characters long',
    'any.required': 'Name is required',
  }),
  email: joi.string().email().max(50).required().messages({
    'string.email': 'Invalid email format',
    'string.max': 'Email must be at most 50 characters long',
    'any.required': 'Email is required',
  }),
  password: joi.string().min(4).max(16).required().messages({
    'string.min': 'Password must be at least 4 characters long',
    'string.max': 'Password must be at most 16 characters long',
    'any.required': 'Password is required',
  }),
  confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm password is required',
  }),
});

const authSchema = {
  signInSchema,
  signUpSchema,
};

export default authSchema;
