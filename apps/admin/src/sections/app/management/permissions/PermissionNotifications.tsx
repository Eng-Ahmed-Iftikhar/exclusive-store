import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCreateNotificationMutation } from '@/apis/services/notificationApi';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';

interface PermissionNotificationsProps {
  onPermissionCreated?: (permission: any) => void;
  onPermissionUpdated?: (permission: any) => void;
  onPermissionDeleted?: (permissionId: string) => void;
}

const PermissionNotifications: React.FC<PermissionNotificationsProps> = ({
  onPermissionCreated,
  onPermissionUpdated,
  onPermissionDeleted,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [createNotification] = useCreateNotificationMutation();

  const showNotification = async (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    try {
      await createNotification({
        type,
        title,
        message,
      }).unwrap();
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  // Example notification functions
  const notifyPermissionCreated = (permission: any) => {
    showNotification(
      'success',
      'Permission Created',
      `Permission "${permission.displayName}" has been created successfully.`
    );
    onPermissionCreated?.(permission);
  };

  const notifyPermissionUpdated = (permission: any) => {
    showNotification(
      'success',
      'Permission Updated',
      `Permission "${permission.displayName}" has been updated successfully.`
    );
    onPermissionUpdated?.(permission);
  };

  const notifyPermissionDeleted = (permissionId: string) => {
    showNotification(
      'warning',
      'Permission Deleted',
      'Permission has been deleted successfully.'
    );
    onPermissionDeleted?.(permissionId);
  };

  const notifyError = (message: string) => {
    showNotification('error', 'Error', message);
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <FiBell
          className={`w-5 h-5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}
        />
        <h3
          className={`font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Notification System
        </h3>
      </div>

      <div className="space-y-2">
        <p
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          This component demonstrates the notification API integration.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              showNotification(
                'success',
                'Test Success',
                'This is a success notification'
              )
            }
            className={`flex items-center gap-2 px-3 py-1 text-xs rounded ${
              theme === 'dark'
                ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            <FiCheck className="w-3 h-3" />
            Success
          </button>
          <button
            onClick={() =>
              showNotification(
                'error',
                'Test Error',
                'This is an error notification'
              )
            }
            className={`flex items-center gap-2 px-3 py-1 text-xs rounded ${
              theme === 'dark'
                ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            <FiX className="w-3 h-3" />
            Error
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionNotifications;
