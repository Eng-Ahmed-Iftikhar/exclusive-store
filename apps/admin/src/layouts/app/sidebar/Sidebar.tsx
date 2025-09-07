import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { toggleSidebar } from '../../../store/slices/uiSlice';
import { FiMenu } from 'react-icons/fi';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);

  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <div className="flex flex-col h-full">
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
          <SidebarHeader />
          <SidebarNavigation />
          <SidebarFooter />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
