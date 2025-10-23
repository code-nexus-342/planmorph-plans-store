"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Sparkles, Send, CheckCircle2, XCircle } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletter';
import { motion, AnimatePresence } from 'framer-motion';

// Newsletter Signup Component with Real API Integration
const NewsletterForm = React.memo(() => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { subscribe, isLoading } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await subscribe(email);
    
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });
    
    if (result.success) {
      setEmail('');
    }
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
        <h3 className="font-semibold text-xl text-white">Stay Updated</h3>
      </div>
      <p className="text-gray-400 mb-6 leading-relaxed">
        Get the latest plans and exclusive offers delivered to your inbox.
      </p>
      
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`p-4 rounded-xl border backdrop-blur-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-start gap-3">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                {message.type === 'success' && (
                  <p className="text-xs mt-1 opacity-80">
                    Your first newsletter is on its way! 📬
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-cyan/20 via-brand-purple/20 to-brand-pink/20 opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"></div>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 pl-12 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all duration-300 text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-cyan transition-colors duration-300" />
          </div>
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink hover:shadow-glow-cyan text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="relative flex items-center justify-center">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Subscribing...
              </>
            ) : (
              <>
                Subscribe
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </>
            )}
          </span>
        </motion.button>
      </form>
      
      <p className="text-xs text-gray-500 mt-3">
        🔒 We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  )
});

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-white border-t border-slate-800/50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-brand-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-orange-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center overflow-hidden shadow-glow">
                  <img src="/planmorph-logo.jpg" alt="PlanMorph Logo" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <Sparkles className="w-full h-full text-brand-400 animate-pulse" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">PlanMorph</span>
                <div className="text-xs text-brand-400 font-medium tracking-wide">ARCHITECTURAL EXCELLENCE</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transform your vision into reality with our curated collection of architectural house plans and stunning 3D renders.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="group p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-brand-400 transition-all duration-300">
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link href="#" className="group p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-brand-400 transition-all duration-300">
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link href="#" className="group p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-brand-400 transition-all duration-300">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link href="#" className="group p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-gray-400 hover:text-brand-400 transition-all duration-300">
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-xl mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/plans" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Browse Plans
              </Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Categories
              </Link></li>
              <li><Link href="/3d-tours" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                3D Virtual Tours
              </Link></li>
              {/* Architects link removed - managed through external admin app */}
              <li><Link href="/custom-design" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Custom Design
              </Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-xl mb-6 text-white">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Help Center
              </Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Contact Us
              </Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                FAQ
              </Link></li>
              <li><Link href="/licensing" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Licensing
              </Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Terms of Service
              </Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                Privacy Policy
              </Link></li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-xl mb-6 text-white">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-brand-500/20 transition-colors duration-300">
                    <Mail className="w-5 h-5 text-brand-400" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300">contact@planmorph.software</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-brand-500/20 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-brand-400" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300">+254 (7) 487 673 96</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-brand-500/20 transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-brand-400" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300">Nairobi, Kenya</span>
                </div>
              </div>
            </div>
            
            {/* Newsletter */}
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 PlanMorph. All rights reserved. <span className="text-brand-400">Built with ❤️ for dreamers</span>
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Sitemap
            </Link>
            <Link href="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Accessibility
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
