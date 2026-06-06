import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Theme check
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border transition-colors duration-200 sticky top-0 z-40 w-full">
      <div className="w-full px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── LEFT: Logo + Nav Links ── */}
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-2 font-bold text-xl shrink-0">
              <span className="text-brand-purple">Expense Tracker App</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden sm:flex sm:space-x-1">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard')
                  ? 'text-brand-purple bg-brand-purple/10'
                  : 'text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-border'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/history')
                  ? 'text-brand-purple bg-brand-purple/10'
                  : 'text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-border'
                }`}
              >
                History
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Dark Mode + Name + Logout ── */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-border transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 dark:bg-dark-border" />

            {/* Name */}
            <div className="text-sm text-gray-600 dark:text-dark-muted">
              Hi, <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-brand-rose hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* ── MOBILE: Dark Mode Toggle + Hamburger ── */}
          <div className="flex items-center sm:hidden space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 pt-2 pb-4 space-y-1">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive('/dashboard')
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive('/history')
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
          >
            History
          </Link>
          <div className="pt-4 pb-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between px-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
