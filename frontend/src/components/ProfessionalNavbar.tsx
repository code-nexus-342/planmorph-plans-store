import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Briefcase, LayoutDashboard, LogOut } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';

const ProfessionalNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', path: '/professional' },
    { name: 'Resources', path: '/professional/resources' }, // Placeholder
    { name: 'Community', path: '/professional/community' }, // Placeholder
  ];


  const handleLogout = () => {
    logout();
    // Force navigation to professional login to avoid client login redirect
    window.location.href = '/professional/login';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/professional" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Briefcase className="text-accent" size={24} />
            </div>
            <span className="text-xl font-heading font-bold text-white tracking-wide">
              PlanMorph <span className="text-accent">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === link.path ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/professional/dashboard">
                  <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/10">
                    <LayoutDashboard size={18} className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <button onClick={handleLogout} className="text-text-secondary hover:text-white transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/professional/login">
                  <span className="text-sm font-bold text-white hover:text-accent transition-colors cursor-pointer">
                    Log In
                  </span>
                </Link>
                <Link to="/professional/apply">
                  <Button className="bg-accent text-background hover:bg-accent/90 shadow-glow">
                    Join Network
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg font-medium text-white hover:text-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <>
                  <Link to="/professional/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-accent text-background">Dashboard</Button>
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="text-left text-text-secondary hover:text-white"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/professional/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-white/20 text-white">Log In</Button>
                  </Link>
                  <Link to="/professional/apply" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-accent text-background">Join Network</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ProfessionalNavbar;
