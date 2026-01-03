import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const isDev = import.meta.env.DEV;
  const showContent = !!user || isDev; // In dev, allow rendering even if user is missing

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar only visible on mobile - fixed at top */}
      <div className='lg:hidden'>
        <Navbar activeMenu={activeMenu} />
      </div>

      {showContent && (
        <div className='flex h-screen overflow-hidden'>
          {/* Sidebar - fixed on large screens */}
          <div className='hidden lg:block w-64 flex-shrink-0'>
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Content Area - scrollable with padding for mobile navbar */}
          <div className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-4'>
            {children}
            {(!user && isDev) && (
              <div className='mt-4 text-sm text-yellow-700'>Dev notice: no user found in context; rendering for debugging.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;