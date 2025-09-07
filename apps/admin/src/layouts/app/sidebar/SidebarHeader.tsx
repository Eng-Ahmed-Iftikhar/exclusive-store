import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { toggleSidebar } from '../../../store/slices/uiSlice';
import { FiX } from 'react-icons/fi';

const SidebarHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);

  return (
    <div
      className={`flex items-center justify-between p-8 border-b ${
        theme === 'dark' ? 'border-slate-700' : 'border-slate-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white text-lg font-semibold">A</span>
        </div>
        <div>
          <h1
            className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Admin Panel
          </h1>
          <p
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Dashboard
          </p>
        </div>
      </div>
      <button
        onClick={() => dispatch(toggleSidebar())}
        className={`lg:hidden p-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'text-slate-400 hover:text-white hover:bg-slate-700'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
        }`}
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SidebarHeader;
