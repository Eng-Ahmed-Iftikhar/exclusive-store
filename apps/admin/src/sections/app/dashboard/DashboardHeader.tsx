import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FiCalendar, FiUser } from 'react-icons/fi';
import LiveTime from './LiveTime';

const DashboardHeader: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.user);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className={`mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}!{' '}
            <span role="img" aria-label="waving hand">
              👋
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Here's what's happening with your store today.
            </p>
            {user?.roleDetails && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  theme === 'dark'
                    ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {user.roleDetails.displayName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-slate-700/50 border border-slate-600'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-full ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                }`}
              >
                <FiUser className="w-3 h-3 text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {user.name}
                </span>
                <span
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {user.email}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiCalendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <LiveTime />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
