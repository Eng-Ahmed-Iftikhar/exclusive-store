import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Header from './Header';
import Sidebar from './sidebar/Sidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto transition-colors duration-200">
          <div className="container mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
