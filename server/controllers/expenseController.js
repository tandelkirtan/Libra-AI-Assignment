const Expense = require('../models/Expense');

// @desc    Get all expenses for a user with pagination and filters
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Add search filter (by title)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const totalItems = await Expense.countDocuments(query);

    // Get expenses with pagination
    const expenses = await Expense.find(query)
      .sort({ expenseDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      expenses,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a new expense
// @access  Private
const createExpense = async (req, res) => {
  const { title, amount, category, expenseDate } = req.body;

  try {
    const newExpense = new Expense({
      userId: req.user.id,
      title,
      amount: parseFloat(amount),
      category,
      expenseDate: expenseDate ? new Date(expenseDate) : new Date()
    });

    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get a single expense by ID
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update an expense
// @access  Private
const updateExpense = async (req, res) => {
  const { title, amount, category, expenseDate } = req.body;

  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Update fields
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (category !== undefined) expense.category = category;
    if (expenseDate !== undefined) expense.expenseDate = new Date(expenseDate);

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete an expense
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get expense stats
// @access  Private
const getExpenseStats = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    // 1. Total All-time Expenses
    const totalAllTime = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 2. This Month's Total Expenses
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.expenseDate);
      return expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth;
    });
    const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 3. Last 6 Months Monthly Breakdown
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyBreakdown = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const monthLabel = `${monthNames[monthIndex]} ${year.toString().slice(-2)}`;

      const totalForMonth = expenses
        .filter((exp) => {
          const expDate = new Date(exp.expenseDate);
          return expDate.getFullYear() === year && expDate.getMonth() === monthIndex;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      monthlyBreakdown.push({
        month: monthLabel,
        amount: parseFloat(totalForMonth.toFixed(2))
      });
    }

    // 4. Spending by Category
    const categoriesList = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
    const categoryBreakdown = categoriesList.map((cat) => {
      const totalForCategory = expenses
        .filter((exp) => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return {
        category: cat,
        amount: parseFloat(totalForCategory.toFixed(2))
      };
    });

    // 5. Total Transactions Count
    const totalTransactions = expenses.length;

    res.json({
      totalAllTime: parseFloat(totalAllTime.toFixed(2)),
      thisMonthTotal: parseFloat(thisMonthTotal.toFixed(2)),
      totalTransactions,
      monthlyBreakdown,
      categoryBreakdown
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats
};
