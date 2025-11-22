import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const ArchitectLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            PlanMorph <span className="text-xs font-normal text-gray-500">Architect</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/architect/dashboard" className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
            Dashboard
          </Link>
          <Link to="/architect/designs" className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
            My Designs
          </Link>
          <Link to="/architect/upload" className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
            Upload New
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm font-medium truncate">{user?.email}</div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ArchitectLayout;
