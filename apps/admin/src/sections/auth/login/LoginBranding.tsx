import React from 'react';
import { FiTrendingUp, FiUsers, FiPackage } from 'react-icons/fi';

// LoginBranding component for left side branding panel (desktop only)
const LoginBranding: React.FC = () => {
  return (
    <div className="hidden lg:flex w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12 flex-col justify-between">
      {/* Company Logo and Brand */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">AdminPanel</h1>
            <span className="text-xs text-blue-200 font-medium uppercase tracking-wider">
              E-commerce Admin
            </span>
          </div>
        </div>

        {/* Main Value Proposition */}
        <h2 className="text-4xl font-bold mb-4 leading-tight">
          Manage Your E-commerce Empire
        </h2>
        <p className="text-blue-100 text-lg leading-relaxed">
          Take control of your online business with our powerful admin
          dashboard. Monitor sales, manage inventory, and grow your customer
          base.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-6">
        {/* Analytics Feature */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <FiTrendingUp className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Analytics & Insights</h3>
            <p className="text-blue-200">
              Track performance with real-time data
            </p>
          </div>
        </div>

        {/* Inventory Management Feature */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Inventory Management</h3>
            <p className="text-blue-200">Control stock levels effortlessly</p>
          </div>
        </div>

        {/* Customer Relations Feature */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Customer Relations</h3>
            <p className="text-blue-200">
              Build lasting customer relationships
            </p>
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="text-blue-200 text-sm">
        <p>© 2024 AdminPanel. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginBranding;
