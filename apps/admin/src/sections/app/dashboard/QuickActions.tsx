import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  FiPlus,
  FiUsers,
  FiPackage,
  FiSettings,
  FiBarChart,
  FiMail,
  FiShield,
  FiFileText,
} from 'react-icons/fi';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-lg group ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium text-sm truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-xs mt-1 line-clamp-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

const QuickActions: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.ui);

  const actions = [
    {
      title: 'Add Product',
      description: 'Create a new product listing',
      icon: <FiPlus className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      onClick: () => console.log('Add Product clicked'),
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: <FiUsers className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      onClick: () => console.log('Manage Users clicked'),
    },
    {
      title: 'Inventory',
      description: 'Check stock levels and updates',
      icon: <FiPackage className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      onClick: () => console.log('Inventory clicked'),
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: <FiBarChart className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      onClick: () => console.log('Analytics clicked'),
    },
    {
      title: 'Send Email',
      description: 'Send notifications to users',
      icon: <FiMail className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      onClick: () => console.log('Send Email clicked'),
    },
    {
      title: 'Security',
      description: 'Manage security settings',
      icon: <FiShield className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-red-500 to-pink-600',
      onClick: () => console.log('Security clicked'),
    },
    {
      title: 'Reports',
      description: 'Generate business reports',
      icon: <FiFileText className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
      onClick: () => console.log('Reports clicked'),
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: <FiSettings className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-gray-500 to-slate-600',
      onClick: () => console.log('Settings clicked'),
    },
  ];

  return (
    <div
      className={`p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <h3
        className={`text-lg font-medium mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
