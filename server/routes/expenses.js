const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { createExpenseValidation, updateExpenseValidation } = require('../validations/expenseValidation');
const {
  getExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');

// All expense routes are protected
router.use(authMiddleware);

// @route   GET api/expenses
// @desc    Get all user expenses with filters and pagination
// @access  Private
router.get('/', getExpenses);

// @route   GET api/expenses/stats
// @desc    Get expense stats
// @access  Private
router.get('/stats', getExpenseStats);

// @route   GET api/expenses/:id
// @desc    Get a single expense by ID
// @access  Private
router.get('/:id', getExpenseById);

// @route   POST api/expenses
// @desc    Add a new expense
// @access  Private
router.post('/', createExpenseValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  createExpense(req, res, next);
});

// @route   PUT api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', updateExpenseValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateExpense(req, res, next);
});

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', deleteExpense);

module.exports = router;
