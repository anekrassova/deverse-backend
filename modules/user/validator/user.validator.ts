import { body, query } from 'express-validator';

export const userSearchValidator = [
  query('query')
    .notEmpty()
    .withMessage('Query is required.')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Query must be 1–50 characters.'),
];

export const updateProfileValidator = [
  body().custom((value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Request body must be an object.');
    }

    const fields = ['name', 'surname', 'username', 'profession'];
    const hasAtLeastOneField = fields.some((field) => value[field] !== undefined);

    if (!hasAtLeastOneField) {
      throw new Error('At least one profile field is required.');
    }

    return true;
  }),

  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Name must be a non-empty string.')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be 1–255 characters.'),

  body('surname')
    .optional()
    .isString()
    .withMessage('Surname must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Surname must be a non-empty string.')
    .isLength({ min: 1, max: 255 })
    .withMessage('Surname must be 1–255 characters.'),

  body('username')
    .optional()
    .isString()
    .withMessage('Username must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Username must be a non-empty string.')
    .isLength({ min: 1, max: 255 })
    .withMessage('Username must be 1–255 characters.'),

  body('profession')
    .optional()
    .isString()
    .withMessage('Profession must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Profession must be a non-empty string.')
    .isLength({ min: 1, max: 255 })
    .withMessage('Profession must be 1–255 characters.'),
];
