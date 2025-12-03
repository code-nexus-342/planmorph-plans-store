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
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-float"
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
                    ? 'bg-architect-900 text-white shadow-md' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-architect-900'
                }`}
              >
                <AnimatePresence>
                  {hoveredTab === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -45, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-architect-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg"
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

        <div className="mx-2 h-8 w-px bg-gray-200" />

        {/* User Menu Trigger */}
        <div className="relative">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              isAuthenticated 
                ? 'border-accent-teal bg-accent-teal/10 text-accent-teal' 
                : 'border-transparent text-gray-400 hover:bg-gray-100 hover:text-architect-900'
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
                  className="absolute bottom-full left-1/2 mb-4 w-64 origin-bottom bg-white border border-gray-200 p-2 shadow-float"
                >
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1">
                      <div className="px-3 py-2">
                        <p className="text-sm font-bold text-architect-900 uppercase tracking-wider">Signed in as</p>
                        <p className="truncate text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="h-px bg-gray-100" />
                      
                      {user?.role === 'client' && (
                        <Link 
                          to="/purchases" 
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-architect-900 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShoppingBag size={16} /> My Purchases
                        </Link>
                      )}
                      


                      <Link 
                        to="/settings" 
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-architect-900 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                      
                      <div className="h-px bg-gray-100" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full bg-gray-100 px-4 py-2 text-sm font-bold text-architect-900 hover:bg-gray-200 transition-colors uppercase tracking-wide">
                          Log In
                        </button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full bg-architect-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-accent-teal transition-colors uppercase tracking-wide">
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
