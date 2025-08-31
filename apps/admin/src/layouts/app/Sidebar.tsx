import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { NAVIGATION_ITEMS } from '../../routers/routes';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiX,
  FiMenu,
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);

  const iconMap = {
    dashboard: FiHome,
    products: FiPackage,
    orders: FiShoppingCart,
    customers: FiUsers,
    analytics: FiBarChart2,
    settings: FiSettings,
  };

  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 text-gray-700 hover:text-gray-900 hover:bg-white transition-all duration-200"
        >
          <FiMenu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 transform transition-transform duration-300 ease-in-out z-50 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'bg-slate-800 border-r border-slate-700'
            : 'bg-white border-r border-slate-100'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
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

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8">
            <div className="space-y-1">
              {NAVIGATION_ITEMS.map((item) => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap];
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleCloseSidebar}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-slate-700 text-white border border-slate-600 shadow-sm'
                            : 'bg-slate-50 text-slate-900 border border-slate-200 shadow-sm'
                          : theme === 'dark'
                          ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                      }`
                    }
                  >
                    <IconComponent
                      className={`w-5 h-5 mr-3.5 transition-colors ${
                        sidebarOpen
                          ? theme === 'dark'
                            ? 'text-slate-400 group-hover:text-slate-200'
                            : 'text-slate-500 group-hover:text-slate-700'
                          : theme === 'dark'
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
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
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Admin User
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    admin@example.com
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
        </div>
      </div>
    </>
  );
};

export default Sidebar;
