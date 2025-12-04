import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  User, 
  LogOut, 
  ShoppingBag,
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
  ];

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl p-2 shadow-float"
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
                    ? 'bg-primary text-background shadow-glow scale-110' 
                    : 'text-text-secondary hover:bg-white/10 hover:text-white hover:shadow-lg'
                }`}
              >
                <AnimatePresence>
                  {hoveredTab === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -50, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface/90 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-xl rounded-md"
                    >
                      {item.label}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface/90 border-r border-b border-white/10 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
            </Link>
          );
        })}

        <div className="mx-2 h-8 w-px bg-gray-200/50" />

        {/* User Menu Trigger */}
        <div className="relative">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              isAuthenticated 
                ? 'border-primary bg-primary/10 text-primary shadow-glow' 
                : 'border-transparent text-text-secondary hover:bg-white/10 hover:text-white hover:shadow-lg'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={20} strokeWidth={2} />
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
                  animate={{ opacity: 1, scale: 1, y: -20 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  style={{ translateX: '-50%' }}
                  className="absolute bottom-full left-1/2 mb-4 w-64 origin-bottom glass-panel p-2 shadow-float rounded-2xl"
                >
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1">
                      <div className="px-3 py-2">
                        <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="truncate text-xs text-text-secondary font-medium">{user?.email}</p>
                      </div>
                      <div className="h-px bg-white/10 my-1" />
                      
                      {user?.role === 'client' && (
                        <Link 
                          to="/purchases" 
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-white/10 hover:text-white hover:shadow-sm rounded-lg transition-all"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShoppingBag size={16} /> My Purchases
                        </Link>
                      )}
                      
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-white/10 hover:text-white hover:shadow-sm rounded-lg transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>

                      <div className="h-px bg-white/10 my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 hover:shadow-md transition-all uppercase tracking-wide rounded-xl">
                          Log In
                        </button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full bg-primary px-4 py-3 text-sm font-bold text-background shadow-glow hover:bg-primary/90 hover:-translate-y-0.5 transition-all uppercase tracking-wide rounded-xl">
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
