import React from 'react';

interface DashboardHeaderProps {
  theme: 'light' | 'dark';
  error?: any;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ theme, error }) => {
  if (error) {
    return (
      <div
        className={`rounded-2xl border p-8 ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
      >
        <h1
          className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Dashboard
        </h1>
        <div
          className={`mt-4 p-4 rounded-lg ${
            theme === 'dark'
              ? 'bg-red-900/20 border border-red-800'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`text-red-700 ${
              theme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}
          >
            Error loading dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-8 ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}
    >
      <h1
        className={`text-3xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}
      >
        Dashboard
      </h1>
      <p
        className={`mt-2 text-lg ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        Welcome to your admin dashboard. Here's an overview of your store's
        performance.
      </p>
    </div>
  );
};

export default DashboardHeader;
