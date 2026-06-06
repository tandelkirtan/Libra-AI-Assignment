import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import { MonthlySpendingChart, CategorySpendingChart } from '../components/Charts';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { Calendar, CreditCard, Plus, ArrowRight, Receipt, Wallet, Utensils, Car, ShoppingBag, HeartPulse, Film, HelpCircle } from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Health: HeartPulse,
  Entertainment: Film,
  Other: HelpCircle
};

import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Food: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20',
  Transport: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
  Shopping: 'text-brand-green bg-brand-green/10 border-brand-green/20',
  Bills: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20',
  Health: 'text-brand-rose bg-brand-rose/10 border-brand-rose/20',
  Entertainment: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  Other: 'text-dark-muted bg-dark-muted/10 border-dark-muted/20'
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalAllTime: 0,
    thisMonthTotal: 0,
    totalTransactions: 0,
    activeCategories: 0,
    monthlyBreakdown: [],
    categoryBreakdown: []
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, expensesRes] = await Promise.all([
        api.get('/expenses/stats'),
        api.get('/expenses?limit=5')
      ]);
      
      // Calculate active categories count
      const activeCats = statsRes.data.categoryBreakdown.filter(c => c.amount > 0).length;
      
      setStats({
        ...statsRes.data,
        activeCategories: activeCats
      });
      setRecentExpenses(expensesRes.data.expenses || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-purple/20 cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-brand-rose/10 text-brand-rose text-sm rounded-2xl border border-brand-rose/20">
          {error}
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stat: Total All Time */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-dark-border flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-brand-purple/10 rounded-xl text-brand-purple">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-dark-muted">Total Expenses</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {formatCurrency(stats.totalAllTime)}
            </h3>
          </div>
        </div>

        {/* Stat: This Month */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-dark-border flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-dark-muted">This Month's Spending</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {formatCurrency(stats.thisMonthTotal)}
            </h3>
          </div>
        </div>

        {/* Stat: Total Transactions */}
        <div className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-dark-border flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-dark-muted">Total Transactions</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {stats.totalTransactions}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spending Trend Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Spendings</h3>
          </div>
          <MonthlySpendingChart data={stats.monthlyBreakdown} />
        </div>

        {/* Category Breakdown Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Category Breakdown</h3>
          </div>
          <CategorySpendingChart data={stats.categoryBreakdown} total={stats.thisMonthTotal} />
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
            <Link
              to="/history"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-purple hover:text-brand-purple/80 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-dark-muted text-sm">
              No recent transactions. Add one to see it here!
            </div>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((expense) => {
                const Icon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;
                return (
                  <div 
                    key={expense._id} 
                    className="flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2.5 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border group-hover:border-brand-purple/30 transition-colors ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{expense.title}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-dark-muted">
                          {formatDate(expense.expenseDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                        CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other
                      }`}>
                        {expense.category}
                      </span>
                      <span className="text-sm font-bold text-brand-rose">
                        - {formatCurrency(expense.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm
          onSubmitSuccess={handleAddSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
