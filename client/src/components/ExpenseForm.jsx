import React, { useState, useEffect } from 'react';
import api from '../services/axios';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];

export default function ExpenseForm({ expense, onSubmitSuccess, onCancel }) {
  const isEdit = !!expense;
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    expenseDate: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || 'Food',
        expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : ''
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when field changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a number greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let response;
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        expenseDate: formData.expenseDate
      };

      if (isEdit) {
        response = await api.put(`/expenses/${expense._id}`, payload);
      } else {
        response = await api.post('/expenses', payload);
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error processing request';
      setErrors((prev) => ({ ...prev, server: serverMsg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.server && (
        <div className="p-3 bg-brand-rose/10 text-brand-rose text-sm rounded-lg border border-brand-rose/20">
          {errors.server}
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-xs font-bold text-gray-500 dark:text-dark-muted uppercase mb-1.5">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Starbucks Coffee"
          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none transition-all ${
            errors.title ? 'border-brand-rose' : 'border-gray-200 dark:border-dark-border focus:border-brand-purple'
          }`}
        />
        {errors.title && <p className="mt-1 text-[10px] text-brand-rose font-medium">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-xs font-bold text-gray-500 dark:text-dark-muted uppercase mb-1.5">
            Amount (₹) *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none transition-all ${
              errors.amount ? 'border-brand-rose' : 'border-gray-200 dark:border-dark-border focus:border-brand-purple'
            }`}
          />
          {errors.amount && <p className="mt-1 text-[10px] text-brand-rose font-medium">{errors.amount}</p>}
        </div>

        {/* Date Field */}
        <div>
          <label htmlFor="expenseDate" className="block text-xs font-bold text-gray-500 dark:text-dark-muted uppercase mb-1.5">
            Date *
          </label>
          <input
            type="date"
            id="expenseDate"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none transition-all ${
              errors.expenseDate ? 'border-brand-rose' : 'border-gray-200 dark:border-dark-border focus:border-brand-purple'
            }`}
          />
          {errors.expenseDate && <p className="mt-1 text-[10px] text-brand-rose font-medium">{errors.expenseDate}</p>}
        </div>
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-xs font-bold text-gray-500 dark:text-dark-muted uppercase mb-1.5">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none transition-all appearance-none ${
            errors.category ? 'border-brand-rose' : 'border-gray-200 dark:border-dark-border focus:border-brand-purple'
          }`}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-[10px] text-brand-rose font-medium">{errors.category}</p>}
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-dark-border text-gray-500 dark:text-dark-muted text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-purple/20 flex items-center justify-center cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isEdit ? 'Save Changes' : 'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
}
