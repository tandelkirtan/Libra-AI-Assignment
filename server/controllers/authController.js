const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Expense = require('../models/Expense');

// @desc    Register a user
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ errors: [{ msg: 'Email is already registered' }] });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    // Save user (password gets hashed in pre-save hook)
    await user.save();

    // Return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email only
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get logged in user data
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get dashboard data (user info + stats + recent expenses)
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ expenseDate: -1 })
      .limit(5);

    // Calculate stats
    const totalAllTime = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.expenseDate);
      return expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth;
    });
    const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      stats: {
        totalAllTime: parseFloat(totalAllTime.toFixed(2)),
        thisMonthTotal: parseFloat(thisMonthTotal.toFixed(2)),
        totalTransactions: expenses.length
      },
      recentExpenses: expenses
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  register,
  login,
  getMe,
  getDashboard
};
