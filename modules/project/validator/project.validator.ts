import { body } from 'express-validator';

export const createProjectValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required.')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be a non-empty string.'),

  body('description')
    .notEmpty()
    .withMessage('Description is required.')
    .isString()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description must be a non-empty string.'),

  body('url')
    .notEmpty()
    .withMessage('Url is required.')
    .isString()
    .isURL()
    .withMessage('Invalid url format.'),
];

export const updateProjectValidator = [
  body('title')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be a non-empty string.'),

  body('description')
    .optional()
    .isString()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description must be a non-empty string.'),

  body('url').optional().isString().isURL().withMessage('Invalid url format.'),
];

