import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const SidebarFooter: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div
      className={`p-6 border-t ${
        theme === 'dark' ? 'border-slate-700' : 'border-slate-100'
      }`}
    >
      <div
        className={`rounded-xl p-4 border ${
          theme === 'dark'
            ? 'bg-slate-700/50 border-slate-600'
            : 'bg-slate-50 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {user?.name || 'Admin User'}
            </p>
            <p
              className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {user?.email || 'admin@example.com'}
            </p>
          </div>
        </div>
        <div
          className={`text-xs text-center font-medium ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          © 2024 Admin Panel
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
