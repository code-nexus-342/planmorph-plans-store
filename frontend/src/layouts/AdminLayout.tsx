import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Briefcase,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/10 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Settings className="text-red-500" size={20} />
            </div>
            <span className="text-xl font-heading font-bold text-white">Admin<span className="text-red-500">Panel</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/admin/dashboard') 
                ? 'bg-red-500/20 text-red-500 font-medium' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link 
            to="/admin/applications" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/admin/applications') 
                ? 'bg-red-500/20 text-red-500 font-medium' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText size={20} />
            Applications
          </Link>

          <Link 
            to="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/admin/users') 
                ? 'bg-red-500/20 text-red-500 font-medium' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users size={20} />
            Users & Pros
          </Link>

          <Link 
            to="/admin/designs" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/admin/designs') 
                ? 'bg-red-500/20 text-red-500 font-medium' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers size={20} />
            Designs
          </Link>

          <Link 
            to="/admin/roles" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/admin/roles') 
                ? 'bg-red-500/20 text-red-500 font-medium' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            <Briefcase size={20} />
            Job Roles
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 w-full transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
