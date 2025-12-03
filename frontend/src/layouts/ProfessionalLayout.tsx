import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfessionalRoles } from '../context/ProfessionalRoleContext';

const ProfessionalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { getRoleConfig, getIconComponent, loading } = useProfessionalRoles();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Determine role from current path or user role
  const roleType = user?.role === 'admin' 
    ? location.pathname.split('/')[1] 
    : (user?.role || location.pathname.split('/')[1]);
    
  const roleConfig = getRoleConfig(roleType);

  if (!roleConfig) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role not configured</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please contact administrator
          </p>
        </div>
      </div>
    );
  }

  const { displayName, navItems, color } = roleConfig;

  const borderColorClass = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500',
    red: 'border-red-500'
  }[color];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h1>
              </div>
              <div className="ml-6 flex space-x-8">
                {navItems.map((item) => {
                  const Icon = getIconComponent(item.icon);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                          isActive
                            ? `${borderColorClass} text-gray-900 dark:text-white`
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`
                      }
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfessionalLayout;
