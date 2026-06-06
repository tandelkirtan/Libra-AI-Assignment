const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const { register, login, getMe, getDashboard } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  register(req, res, next);
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  login(req, res, next);
});

// @route   GET api/auth/me
// @desc    Get logged in user data
// @access  Private
router.get('/me', authMiddleware, getMe);

// @route   GET api/auth/dashboard
// @desc    Get dashboard data (user info + stats + recent expenses)
// @access  Private
router.get('/dashboard', authMiddleware, getDashboard);

module.exports = router;
