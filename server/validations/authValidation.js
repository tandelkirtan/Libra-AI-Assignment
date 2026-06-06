const { check } = require('express-validator');

// Validation rules for user registration
const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

// Validation rules for user login
const loginValidation = [
  check('email', 'Email is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

module.exports = {
  registerValidation,
  loginValidation
};
