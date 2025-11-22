import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, HardHat } from 'lucide-react';
import FloatingNav from '../components/FloatingNav';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col font-sans text-white selection:bg-neon-cyan selection:text-nebula-900">
      <FloatingNav />

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-glass-200 bg-nebula-900/50 pt-16 pb-32 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-neon-cyan text-nebula-900 shadow-neon-cyan">
                  <HardHat size={20} />
                </div>
                <span className="text-xl font-heading font-bold tracking-wider">PlanMorph</span>
              </div>
              <p className="text-gray-400 mb-6">
                The premier marketplace for construction-ready architectural designs. Connecting visionaries with builders.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-neon-cyan hover:shadow-neon-cyan transition-all"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-neon-cyan hover:shadow-neon-cyan transition-all"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-neon-cyan hover:shadow-neon-cyan transition-all"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-neon-cyan hover:shadow-neon-cyan transition-all"><Linkedin size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-heading font-bold mb-6 text-neon-purple">Platform</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/designs" className="hover:text-white hover:translate-x-1 transition-all inline-block">Browse Plans</Link></li>
                <li><Link to="/architects" className="hover:text-white hover:translate-x-1 transition-all inline-block">Top Architects</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white hover:translate-x-1 transition-all inline-block">How It Works</Link></li>
                <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 transition-all inline-block">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-heading font-bold mb-6 text-neon-purple">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/help" className="hover:text-white hover:translate-x-1 transition-all inline-block">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-heading font-bold mb-6 text-neon-purple">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3 group">
                  <Mail size={18} className="text-neon-cyan group-hover:shadow-neon-cyan transition-all" />
                  <span>support@planmorph.com</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <Phone size={18} className="text-neon-cyan group-hover:shadow-neon-cyan transition-all" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <MapPin size={18} className="text-neon-cyan group-hover:shadow-neon-cyan transition-all" />
                  <span>123 Builder Ave, Suite 100<br/>San Francisco, CA 94107</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-glass-200 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} PlanMorph. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
