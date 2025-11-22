import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  HardHat, 
  User, 
  LogOut, 
  ShoppingBag,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FloatingNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'designs', icon: Search, label: 'Browse', path: '/designs' },
    { id: 'architects', icon: HardHat, label: 'Professionals', path: '/architect/apply' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 rounded-full border border-glass-200 bg-glass-100 p-2 shadow-glass backdrop-blur-xl"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.id} to={item.path}>
              <motion.div
                onHoverStart={() => setHoveredTab(item.id)}
                onHoverEnd={() => setHoveredTab(null)}
                className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-neon-cyan text-nebula-900 shadow-neon-cyan' 
                    : 'text-gray-400 hover:bg-glass-200 hover:text-white'
                }`}
              >
                <AnimatePresence>
                  {hoveredTab === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -45, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-nebula-800 border border-glass-200 px-2 py-1 text-xs font-heading font-medium text-neon-cyan shadow-lg"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>
                <Icon size={20} />
              </motion.div>
            </Link>
          );
        })}

        <div className="mx-2 h-8 w-px bg-glass-200" />

        {/* User Menu Trigger */}
        <div className="relative">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              isAuthenticated 
                ? 'border-neon-purple bg-neon-purple/20 text-neon-purple shadow-neon-purple' 
                : 'border-transparent text-gray-400 hover:bg-glass-200 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={20} />
          </motion.button>

          {/* User Menu Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[-1]" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: -16 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  style={{ translateX: '-50%' }}
                  className="absolute bottom-full left-1/2 mb-4 w-64 origin-bottom rounded-2xl border border-glass-200 bg-nebula-800/90 p-2 shadow-glass backdrop-blur-xl"
                >
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-white font-heading">Signed in as</p>
                        <p className="truncate text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <div className="h-px bg-glass-200" />
                      
                      {user?.role === 'client' && (
                        <Link 
                          to="/purchases" 
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-glass-200 hover:text-neon-cyan transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShoppingBag size={16} /> My Purchases
                        </Link>
                      )}
                      
                      {(user?.role === 'architect' || user?.role === 'admin') && (
                        <Link 
                          to={user.role === 'admin' ? '/admin/dashboard' : '/architect/dashboard'}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-glass-200 hover:text-neon-cyan transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      )}

                      <Link 
                        to="/settings" 
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-glass-200 hover:text-neon-cyan transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                      
                      <div className="h-px bg-glass-200" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full rounded-lg bg-glass-200 px-4 py-2 text-sm font-medium text-white hover:bg-glass-300 transition-colors">
                          Log In
                        </button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full rounded-lg bg-neon-cyan px-4 py-2 text-sm font-bold text-nebula-900 shadow-neon-cyan hover:bg-white transition-colors">
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingNav;
