import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a non-empty string.'),

  body('surname')
    .notEmpty()
    .withMessage('Surname is required.')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Surname must be a non-empty string.'),

  body('profession')
    .notEmpty()
    .withMessage('Profession is required.')
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Profession must be a non-empty string.'),

  body('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Invalid email format.'),

  body('username')
    .notEmpty()
    .withMessage('Username is required.')
    .isString()
    .isLength({ min: 3, max: 32 })
    .withMessage('Username must be 3–32 characters.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),
];

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Invalid email format.'),

  body('password').notEmpty().withMessage('Password is required.').isString(),
];
