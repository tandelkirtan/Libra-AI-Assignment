import React from 'react';
import { Edit2, Trash2, Calendar, Tag, DollarSign, Utensils, Car, ShoppingBag, Receipt, HeartPulse, Film, HelpCircle } from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Health: HeartPulse,
  Entertainment: Film,
  Other: HelpCircle
};

const CATEGORY_COLORS = {
  Food: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20',
  Transport: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
  Shopping: 'text-brand-green bg-brand-green/10 border-brand-green/20',
  Bills: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20',
  Health: 'text-brand-rose bg-brand-rose/10 border-brand-rose/20',
  Entertainment: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  Other: 'text-dark-muted bg-dark-muted/10 border-dark-muted/20'
};

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const handleDeleteClick = (expense) => {
    if (window.confirm(`Are you sure you want to delete the expense "${expense.title}"?`)) {
      onDelete(expense._id);
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-200 dark:border-dark-border">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-muted mb-3 stroke-[1.5]" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No expenses found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden shadow-sm transition-all">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">Title</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted text-right">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {expenses.map((expense) => {
              const Icon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;
              return (
                <tr 
                  key={expense._id}
                  className="hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-colors group"
                >
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-muted">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 opacity-50" />
                      <span>{formatDate(expense.expenseDate)}</span>
                    </div>
                  </td>
                  {/* Title */}
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="block truncate">{expense.title}</span>
                    </div>
                  </td>
                  {/* Category badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other
                    }`}>
                      {expense.category}
                    </span>
                  </td>
                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-right">
                    {formatAmount(expense.amount)}
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 rounded-lg text-gray-400 dark:text-dark-muted hover:text-brand-purple hover:bg-brand-purple/10 transition-colors cursor-pointer"
                        title="Edit Expense"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense)}
                        className="p-1.5 rounded-lg text-gray-400 dark:text-dark-muted hover:text-brand-rose hover:bg-brand-rose/10 transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-dark-border">
        {expenses.map((expense) => {
          const Icon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;
          return (
            <div key={expense._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(expense.expenseDate)}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                  CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other
                }`}>
                  {expense.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate pr-4">
                  <div className={`p-1.5 rounded-lg border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{expense.title}</h4>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                  {formatAmount(expense.amount)}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-1">
                <button
                  onClick={() => onEdit(expense)}
                  className="inline-flex items-center space-x-1 text-xs font-medium text-brand-purple"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(expense)}
                  className="inline-flex items-center space-x-1 text-xs font-medium text-brand-rose"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
