import React, { useState } from 'react';
import {
  FiBarChart2,
  FiChevronDown,
  FiChevronRight,
  FiFolder,
  FiHome,
  FiPackage,
  FiSettings,
  FiShield,
  FiShoppingCart,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import adminNavigations, {
  NavigationItem,
} from '../../../navigations/admin.navigations';
import { RootState } from '../../../store';
import { toggleSidebar } from '../../../store/slices/uiSlice';
import { PermissionGuard } from '../../../components/PermissionGuard';

const SidebarNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.user);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const iconMap = {
    dashboard: FiHome,
    products: FiPackage,
    orders: FiShoppingCart,
    users: FiUsers,
    analytics: FiBarChart2,
    settings: FiSettings,
    permissions: FiShield,
    roles: FiUserCheck,
    categories: FiFolder,
    content: FiPackage,
    resources: FiPackage,
    teams: FiUsers,
  };

  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap];
    const isExpanded = expandedItems.includes(item.name);

    if (item.isParent && item.children) {
      // Filter children based on permissions
      const visibleChildren = item.children.filter((child) => {
        if (!child.permission) return true; // Show if no permission required
        return true; // We'll handle permission checking in the child rendering
      });

      // Don't show parent if no visible children
      if (visibleChildren.length === 0) return null;

      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`group w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              theme === 'dark'
                ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-center">
              <IconComponent
                className={`w-5 h-5 mr-3.5 transition-colors ${
                  theme === 'dark'
                    ? 'text-slate-400 group-hover:text-slate-200'
                    : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />
              {item.name}
            </div>
            {isExpanded ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {visibleChildren.map((child) => {
                const ChildIconComponent =
                  iconMap[child.icon as keyof typeof iconMap];

                // If child has permission requirement, wrap with PermissionGuard
                if (child.permission) {
                  return (
                    <PermissionGuard
                      key={child.path}
                      action={child.permission.action as any}
                      subject={child.permission.subject as any}
                    >
                      <NavLink
                        to={child.path!}
                        onClick={handleCloseSidebar}
                        className={({ isActive }) =>
                          `group flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? theme === 'dark'
                                ? 'bg-slate-700 text-white border border-slate-600 shadow-sm'
                                : 'bg-slate-50 text-slate-900 border border-slate-200 shadow-sm'
                              : theme === 'dark'
                              ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'
                          }`
                        }
                      >
                        <ChildIconComponent
                          className={`w-4 h-4 mr-3 transition-colors ${
                            theme === 'dark'
                              ? 'text-slate-500 group-hover:text-slate-300'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        {child.name}
                      </NavLink>
                    </PermissionGuard>
                  );
                }

                // No permission required
                return (
                  <NavLink
                    key={child.path}
                    to={child.path!}
                    onClick={handleCloseSidebar}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-slate-700 text-white border border-slate-600 shadow-sm'
                            : 'bg-slate-50 text-slate-900 border border-slate-200 shadow-sm'
                          : theme === 'dark'
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'
                      }`
                    }
                  >
                    <ChildIconComponent
                      className={`w-4 h-4 mr-3 transition-colors ${
                        theme === 'dark'
                          ? 'text-slate-500 group-hover:text-slate-300'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {child.name}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // If item has permission requirement, wrap with PermissionGuard
    if (item.permission) {
      return (
        <PermissionGuard
          key={item.path}
          action={item.permission.action as any}
          subject={item.permission.subject as any}
        >
          <NavLink
            to={item.path!}
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
        </PermissionGuard>
      );
    }

    // No permission required
    return (
      <NavLink
        key={item.path}
        to={item.path!}
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
  };

  return (
    <nav className="flex-1 px-6 py-8 overflow-y-auto sidebar-scroll">
      <div className="space-y-1">
        {adminNavigations.map(renderNavigationItem)}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
