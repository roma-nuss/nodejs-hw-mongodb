// src/validators/authValidators.js
import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Проверка на валидный email
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must include both letters and numbers',
      'any.required': 'Password is required',
    }),
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'any.required': 'Name is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

// Схема для сброса пароля
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.base': '"Token" should be a type of "text"',
    'any.required': '"Token" is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': '"Password" should be a type of "text"',
    'string.min': '"Password" should have a minimum length of 6 characters',
    'any.required': '"Password" is required',
  }),
});
