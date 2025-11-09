import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routers/routes';
import { RootState } from '../../../store';
import { FiPlus, FiPackage, FiLayers, FiShield, FiTag } from 'react-icons/fi';
import { useAbility } from '@/lib/AbilityContext';

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
  const navigate = useNavigate();
  const ability = useAbility();
  // Only include actions with valid, existing routes
  const rawActions = [
    {
      key: 'create-product',
      required: () => ability.can('create', 'product'),
      title: 'Add Product',
      description: 'Create a new product listing',
      icon: <FiPlus className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      onClick: () =>
        navigate(
          `${ROUTES.ADMIN_CONTENT}${ROUTES.ADMIN_CREATE_PRODUCT.replace(
            '/*',
            ''
          )}`
        ),
    },
    {
      key: 'view-products',
      required: () => ability.can('view', 'product'),
      title: 'Inventory',
      description: 'Check stock levels and updates',
      icon: <FiPackage className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      onClick: () =>
        navigate(`${ROUTES.ADMIN_CONTENT}${ROUTES.ADMIN_PRODUCTS}`),
    },
    {
      key: 'view-categories',
      required: () => ability.can('view', 'category'),
      title: 'Categories',
      description: 'Browse and manage categories',
      icon: <FiLayers className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      onClick: () =>
        navigate(`${ROUTES.ADMIN_CONTENT}${ROUTES.ADMIN_CATEGORIES}`),
    },
    {
      key: 'manage-roles',
      required: () => ability.can('view', 'role'),
      title: 'Roles',
      description: 'View and manage roles',
      icon: <FiShield className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-rose-500 to-pink-600',
      onClick: () =>
        navigate(`${ROUTES.ADMIN_MANAGEMENT}${ROUTES.ADMIN_ROLES}`),
    },
    {
      key: 'manage-permissions',
      required: () => ability.can('view', 'permission'),
      title: 'Permissions',
      description: 'Manage access control',
      icon: <FiTag className="w-5 h-5 text-white" />,
      color: 'bg-gradient-to-r from-indigo-500 to-fuchsia-600',
      onClick: () =>
        navigate(`${ROUTES.ADMIN_MANAGEMENT}${ROUTES.ADMIN_PERMISSIONS}`),
    },
  ] as const;

  const actions = rawActions.filter((a) => {
    try {
      return a.required();
    } catch {
      return false;
    }
  });

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
        {actions.map((action) => (
          <QuickAction
            key={action.key}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
