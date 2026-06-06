const { check } = require('express-validator');

// Validation rules for creating an expense
const createExpenseValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0 }),
  check('category', 'Category is required').isIn([
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Other'
  ])
];

// Validation rules for updating an expense
const updateExpenseValidation = [
  check('title', 'Title is required').optional().not().isEmpty(),
  check('amount', 'Amount must be a positive number').optional().isFloat({ min: 0 }),
  check('category', 'Category must be valid').optional().isIn([
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Other'
  ])
];

module.exports = {
  createExpenseValidation,
  updateExpenseValidation
};
