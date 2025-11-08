import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  toggleSidebar,
  toggleTheme,
  addNotification,
} from '../../store/slices/uiSlice';
import { useLogoutMutation } from '../../apis/services/authApi';
import {
  FiSearch,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';
import NotificationBell from '../../components/NotificationBell';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.user);
  const [logout] = useLogoutMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleThemeToggle = () => {
    //change in perfers-color scheme media query
    document.documentElement.classList.toggle('dark', theme !== 'dark');

    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // State will be cleared automatically by extraReducers
      setShowUserMenu(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(
        addNotification({
          type: 'info',
          message: `Searching for: ${searchQuery}`,
          duration: 3000,
        })
      );
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`border-b transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-100'
      } shadow-sm`}
    >
      <div className="px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <FiSearch
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-11 pr-4 py-2.5 w-80 border rounded-xl text-sm placeholder-slate-500 focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-600 focus:border-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                  }`}
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={
                theme === 'light'
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
            >
              {theme === 'light' ? (
                <FiMoon className="w-5 h-5" />
              ) : (
                <FiSun className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <NotificationBell theme={theme} />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-3 p-2.5 rounded-xl transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
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
                    {user?.email || 'Administrator'}
                  </p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div
                  className={`absolute right-0 mt-3 w-52 rounded-2xl shadow-xl border z-50 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="py-2">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FiUser className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <FiSettings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <hr
                      className={`my-2 ${
                        theme === 'dark'
                          ? 'border-slate-700'
                          : 'border-slate-100'
                      }`}
                    />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
