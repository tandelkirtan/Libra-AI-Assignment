import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = {
  Food: '#8b5cf6',
  Transport: '#3b82f6',
  Shopping: '#10b981',
  Bills: '#f59e0b',
  Health: '#f43f5e',
  Entertainment: '#ec4899',
  Other: '#6b7280'
};

const DEFAULT_PIE_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#6b7280'];

// Custom Tooltip for premium aesthetics
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card p-3 border border-gray-100 dark:border-dark-border rounded-xl shadow-2xl backdrop-blur-md">
        {label && <p className="text-[10px] font-semibold text-gray-500 dark:text-dark-muted mb-1">{label}</p>}
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Pie Tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-dark-card p-3 border border-gray-100 dark:border-dark-border rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-semibold text-gray-500 dark:text-dark-muted mb-1">{data.category || data.name}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function MonthlySpendingChart({ data }) {
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? '#262933' : '#f3f4f6';
  const textColor = isDark ? '#9ca3af' : '#6b7280';

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-gray-400 dark:text-dark-muted text-xs">
        No spending data available.
      </div>
    );
  }

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: textColor, fontSize: 10 }} 
            axisLine={false}
            tickLine={false} 
            dy={10}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 10 }} 
            axisLine={false}
            tickLine={false} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
            dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: isDark ? '#fff' : '#8b5cf6' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategorySpendingChart({ data, total }) {
  const isDark = document.documentElement.classList.contains('dark');
  const chartData = data
    .filter((item) => item.amount > 0)
    .map((item) => ({
      name: item.category,
      value: item.amount
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-gray-400 dark:text-dark-muted text-xs">
        No spending data available.
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] flex flex-col sm:flex-row items-center justify-center">
      <div className="w-full sm:w-1/2 h-[320px] sm:h-[320px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || DEFAULT_PIE_COLORS[index % DEFAULT_PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Centered Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
            ₹{total?.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-dark-muted">Total</p>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="w-full sm:w-1/2 flex flex-col gap-2 sm:gap-3 px-2 sm:px-4 mt-3 sm:mt-0">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between text-[10px] sm:text-[11px]">
            <div className="flex items-center space-x-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[entry.name] || DEFAULT_PIE_COLORS[index % DEFAULT_PIE_COLORS.length] }}
              />
              <span className="text-gray-700 dark:text-white font-medium">{entry.name}</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-gray-900 dark:text-white font-bold">
                ₹{entry.value.toLocaleString('en-IN')}
              </span>
              <span className="text-gray-500 dark:text-dark-muted w-6 sm:w-8 text-right">
                ({Math.round((entry.value / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
