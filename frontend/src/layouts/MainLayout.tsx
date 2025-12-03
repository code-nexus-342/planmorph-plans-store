import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import FloatingNav from '../components/FloatingNav';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col font-sans text-architect-900 selection:bg-accent-teal selection:text-white bg-white">
      {user && user.role === 'client' && !user.is_verified && (
        <div className="bg-accent-gold/10 border-b border-accent-gold/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-architect-900">
              <AlertTriangle size={20} className="text-accent-gold" />
              <span className="text-sm font-medium">
                Your email address is not verified. Please verify to access all features.
              </span>
            </div>
            <Button 
              size="sm" 
              className="bg-accent-gold text-white hover:bg-accent-gold/90 border-none shadow-sm"
              onClick={() => navigate('/verify-email', { state: { email: user.email } })}
            >
              Verify Now
            </Button>
          </div>
        </div>
      )}
      <FloatingNav />

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-gray-100 bg-gray-50 pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.jpg" alt="PlanMorph Logo" className="h-10 w-auto rounded-none grayscale hover:grayscale-0 transition-all" />
                <span className="text-xl font-heading font-bold tracking-wider text-architect-900">PlanMorph</span>
              </div>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                The premier marketplace for construction-ready architectural designs. Connecting visionaries with builders.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-architect-900 transition-all"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-architect-900 transition-all"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-architect-900 transition-all"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-architect-900 transition-all"><Linkedin size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold mb-6 text-architect-900 uppercase tracking-wider">Platform</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link to="/designs" className="hover:text-accent-teal hover:translate-x-1 transition-all inline-block">Browse Plans</Link></li>
                <li><Link to="/how-it-works" className="hover:text-accent-teal hover:translate-x-1 transition-all inline-block">How It Works</Link></li>
                <li><Link to="/pricing" className="hover:text-accent-teal hover:translate-x-1 transition-all inline-block">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold mb-6 text-architect-900 uppercase tracking-wider">Support</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link to="/contact" className="hover:text-accent-teal hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-accent-teal hover:translate-x-1 transition-all inline-block">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-accent-teal hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-accent-teal hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold mb-6 text-architect-900 uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-accent-teal" />
                  <a href="mailto:planmorph@gmail.com" className="hover:text-architect-900 transition-colors">planmorph@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-accent-teal" />
                  <a href="tel:+254748767396" className="hover:text-architect-900 transition-colors">+254 748 767 396</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-accent-teal" />
                  <span>Online Store (Kenya)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center text-gray-400 text-xs uppercase tracking-wider">
            <p>© {new Date().getFullYear()} PlanMorph. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
