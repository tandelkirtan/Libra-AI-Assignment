import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import ExpenseTable from '../components/ExpenseTable';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { Search, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function History() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      // Build query string
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;

      const res = await api.get('/expenses', { params });
      setExpenses(res.data.expenses);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced filter triggers
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchExpenses(1);
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert('Failed to delete transaction.');
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPagination({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 });
  };

  const hasActiveFilters = search || category;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchExpenses(newPage);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Transaction History</h1>
          <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">
            Search, filter, edit, and manage your recorded expenses.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
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

      {/* Filters Panel */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple transition-colors"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple transition-colors appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
            <span className="text-xs text-gray-500 dark:text-dark-muted">
              Found <span className="text-gray-900 dark:text-white font-bold">{pagination.totalItems}</span> results
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center space-x-1 text-xs font-medium text-brand-rose hover:underline transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Clear all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {loading && expenses.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <ExpenseTable 
            expenses={expenses} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
          />
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
              <span className="text-xs text-gray-500 dark:text-dark-muted">
                Showing <span className="text-gray-900 dark:text-white font-bold">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to <span className="text-gray-900 dark:text-white font-bold">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of <span className="text-gray-900 dark:text-white font-bold">{pagination.totalItems}</span> results
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <span className="text-xs font-medium text-gray-900 dark:text-white px-3">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmitSuccess={handleFormSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingExpense(null);
          }}
        />
      </Modal>
    </div>
  );
}
