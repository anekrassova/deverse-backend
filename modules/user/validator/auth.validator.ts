import { body } from 'express-validator';

export const registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format.'),

    body('username')
        .isString()
        .isLength({ min: 3, max: 32 })
        .withMessage('Username must be 3–32 characters.'),

    body('password')
        .isString()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters.'),
];

export const loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format.'),

    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required.'),
];