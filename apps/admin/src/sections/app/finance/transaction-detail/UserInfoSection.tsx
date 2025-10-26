import React from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

interface UserInfoSectionProps {
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ customerInfo }) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiUser className="w-5 h-5" />
          Customer Information
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
          <div className="flex items-center gap-2 mt-1">
            <FiUser className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {customerInfo.name}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
          <div className="flex items-center gap-2 mt-1">
            <FiMail className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {customerInfo.email}
            </p>
          </div>
        </div>

        {customerInfo.phone && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
            <div className="flex items-center gap-2 mt-1">
              <FiPhone className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {customerInfo.phone}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoSection;
