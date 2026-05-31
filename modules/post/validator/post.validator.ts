import { body } from 'express-validator';

export const improvePostValidator = [
  body('content')
    .notEmpty()
    .withMessage('Content is required.')
    .isString()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be 1–5000 characters.'),
];

export const rewritePostToneValidator = [
  body('content')
    .notEmpty()
    .withMessage('Content is required.')
    .isString()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be 1–5000 characters.'),

  body('tone')
    .notEmpty()
    .withMessage('Tone is required.')
    .isString()
    .isIn(['formal', 'friendly', 'short'])
    .withMessage('Tone must be one of: formal, friendly, short.'),
];
