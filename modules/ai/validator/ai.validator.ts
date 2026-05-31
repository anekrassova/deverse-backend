import { body } from 'express-validator';

export const askAiValidator = [
  body('question')
    .notEmpty()
    .withMessage('Question is required.')
    .isString()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Question must be 1–5000 characters.'),
];
