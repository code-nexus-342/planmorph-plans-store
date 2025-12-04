import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Linkedin, Globe } from 'lucide-react';

const ProfessionalFooter: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Briefcase className="text-accent" size={20} />
              </div>
              <span className="text-xl font-heading font-bold text-white">PlanMorph <span className="text-accent">Pro</span></span>
            </div>
            <p className="text-text-secondary max-w-md leading-relaxed">
              Empowering architectural professionals with tools to showcase their work, connect with clients, and grow their business globally.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Platform</h4>
            <ul className="space-y-4 text-text-secondary text-sm">
              <li><Link to="/professional" className="hover:text-accent transition-colors">Overview</Link></li>
              <li><Link to="/professional/apply" className="hover:text-accent transition-colors">Join Network</Link></li>
              <li><Link to="/professional/login" className="hover:text-accent transition-colors">Portal Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Connect</h4>
            <ul className="space-y-4 text-text-secondary text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                <a href="mailto:pro@planmorph.com" className="hover:text-white transition-colors">pro@planmorph.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin size={16} className="text-accent" />
                <a href="https://www.linkedin.com/in/plan-morph-9aa11636a/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              </li>
              <li className="flex items-center gap-2">
                <Globe size={16} className="text-accent" />
                <a href="/" className="hover:text-white transition-colors">Client Store</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-text-secondary">
            <p>&copy; {new Date().getFullYear()} PlanMorph. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/professional/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/professional/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/professional/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
      </div>
    </footer>
  );
};

export default ProfessionalFooter;
