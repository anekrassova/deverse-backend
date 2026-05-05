import { query } from 'express-validator';

export const userSearchValidator = [
  query('query')
    .notEmpty()
    .withMessage('Query is required.')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Query must be 1–50 characters.'),
];

