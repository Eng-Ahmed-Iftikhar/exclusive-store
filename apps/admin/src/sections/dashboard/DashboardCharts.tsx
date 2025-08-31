import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardChartsProps {
  data: any;
  theme: 'light' | 'dark';
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data, theme }) => {
  // Sample chart data - replace with actual data from API
  const chartData = data.revenueData || [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 2000 },
    { month: 'Apr', revenue: 2780 },
    { month: 'May', revenue: 1890 },
    { month: 'Jun', revenue: 2390 },
  ];

  return (
    <div
      className={`rounded-2xl border p-6 ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}
      >
        Revenue Overview
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === 'dark' ? '#475569' : '#e2e8f0'}
            />
            <XAxis
              dataKey="month"
              stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
            />
            <YAxis
              stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                border: theme === 'dark' ? '#475569' : '#e2e8f0',
                borderRadius: '8px',
                color: theme === 'dark' ? '#ffffff' : '#1e293b',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
