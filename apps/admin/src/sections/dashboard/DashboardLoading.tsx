import React from 'react';

interface DashboardLoadingProps {
  theme: 'light' | 'dark';
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ theme }) => {
  return (
    <div className="space-y-8">
      {/* Header Loading */}
      <div
        className={`rounded-2xl border p-8 ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="animate-pulse">
          <div
            className={`h-8 bg-slate-300 rounded w-1/3 mb-4 ${
              theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
            }`}
          ></div>
          <div
            className={`h-6 bg-slate-300 rounded w-1/2 ${
              theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
            }`}
          ></div>
        </div>
      </div>

      {/* Stats Loading */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-6 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="animate-pulse">
              <div
                className={`h-12 w-12 bg-slate-300 rounded-xl mb-4 ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                }`}
              ></div>
              <div
                className={`h-4 bg-slate-300 rounded w-3/4 mb-2 ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                }`}
              ></div>
              <div
                className={`h-8 bg-slate-300 rounded w-1/2 ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Loading */}
      <div
        className={`rounded-2xl border p-6 ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="animate-pulse">
          <div
            className={`h-6 bg-slate-300 rounded w-1/4 mb-4 ${
              theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
            }`}
          ></div>
          <div
            className={`h-64 bg-slate-300 rounded ${
              theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
            }`}
          ></div>
        </div>
      </div>

      {/* Widgets Loading */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-6 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="animate-pulse">
              <div
                className={`h-6 bg-slate-300 rounded w-1/3 mb-4 ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                }`}
              ></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className={`h-16 bg-slate-300 rounded ${
                      theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLoading;
