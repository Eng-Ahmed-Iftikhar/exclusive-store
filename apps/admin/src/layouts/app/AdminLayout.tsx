import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AdminLayout: React.FC = () => {
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);
  const location = useLocation();

  // Check if we're on a nested route (like /admin) or individual page (like /products)
  const isNestedRoute = location.pathname === '/admin';

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
          <div className="container mx-auto px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
