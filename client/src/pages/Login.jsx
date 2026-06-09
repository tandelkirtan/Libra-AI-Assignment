import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ server: result.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-brand-purple/10 rounded-2xl text-brand-purple">
              <Wallet className="h-8 w-8 stroke-[2.5]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Let's Login
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-dark-muted">
            Sign in to track your expenses efficiently
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.server && (
            <div className="p-3 bg-brand-rose/10 text-brand-rose text-sm rounded-xl border border-brand-rose/20 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errors.server}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 dark:text-dark-muted uppercase mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-dark-muted">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-dark-bg border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-all ${
                    errors.email ? 'border-brand-rose' : 'border-gray-200 dark:border-dark-border focus:border-brand-purple'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-[10px] text-brand-rose font-medium">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 dark:text-dark-muted uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-dark-muted">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-dark-bg border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-all ${
                    errors.password ? 'border-brand-rose' : 'border-gray-200 dark:border-dark-border focus:border-brand-purple'
                  }`}
                />
              </div>
              {errors.password && <p className="mt-1 text-[10px] text-brand-rose font-medium">{errors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-brand-purple hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:bg-violet-600/50 transition-all shadow-brand-purple/20 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-dark-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-purple hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
