import { body } from 'express-validator';

export const improvePostValidator = [
  body('content')
    .notEmpty()
    .withMessage('Content is required.')
    .isString()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be 1–5000 characters.'),
];

