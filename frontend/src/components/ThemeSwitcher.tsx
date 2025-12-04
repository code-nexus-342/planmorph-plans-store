import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import { Palette } from 'lucide-react';

const themes = [
  { 
    id: 'vibrant-dark', 
    name: 'Vibrant Dark', 
    settings: { primaryColor: '#00E0C6', accentColor: '#FF0080', backgroundColor: '#050505', isCompact: false } 
  },
  { 
    id: 'architectural-blueprints', 
    name: 'Architectural Blueprints', 
    settings: { primaryColor: '#1C4E80', accentColor: '#E0E0E0', backgroundColor: '#0A1929', isCompact: true } 
  },
  { 
    id: 'technical-neon', 
    name: 'Technical Neon', 
    settings: { primaryColor: '#00FF00', accentColor: '#FFFF00', backgroundColor: '#000000', isCompact: false } 
  },
  { 
    id: 'premium-minimalist', 
    name: 'Premium Minimalist', 
    settings: { primaryColor: '#FFFFFF', accentColor: '#A1A1AA', backgroundColor: '#121212', isCompact: false } 
  },
];

const ThemeSwitcher: React.FC = () => {
  const { updateTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 glass-panel rounded-2xl shadow-glow p-4 w-64 border border-white/10 mb-2"
          >
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Select Theme</h3>
            <div className="space-y-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    updateTheme(t.settings);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-white/10"
                >
                  <div 
                    className="w-6 h-6 rounded-full mr-3 border border-white/20 shadow-sm" 
                    style={{ backgroundColor: t.settings.primaryColor }}
                  />
                  <span className="text-sm font-medium text-text-secondary">{t.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-surface border border-white/10 shadow-glow flex items-center justify-center hover:scale-105 transition-transform duration-200 group"
        aria-label="Toggle Theme"
      >
        <Palette className="w-6 h-6 text-primary group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
