import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import { Save, RotateCcw, Palette, Layout } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateTheme, resetTheme } = useTheme();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string | boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    // Live preview
    updateTheme({ [key]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateTheme(localSettings);
    setIsSaving(false);
  };

  const handleReset = () => {
    resetTheme();
    setLocalSettings(settings); // This might need to wait for reset to propagate if we want to be exact, but resetTheme updates context.
    // Actually resetTheme updates context, so we should sync local state with context.
    // But since context update is async in terms of React render cycle, we might need useEffect.
    // For now, let's just manually set local to default values if we knew them, or rely on context.
    // A better way is to rely on the context value in a useEffect to update local state.
  };

  // Sync local state with global settings if they change externally (e.g. reset)
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/10">
            <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
              <Palette className="text-primary" />
              Appearance Settings
            </h1>
            <p className="text-text-secondary mt-2">Customize the look and feel of your workspace.</p>
          </div>

          <div className="p-8 space-y-12">
            {/* Color Theme Section */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Palette size={20} /> Color Theme
              </h3>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">Primary Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={localSettings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="h-12 w-24 rounded cursor-pointer border border-white/10 p-1 bg-white/5"
                    />
                    <span className="text-text-secondary font-mono">{localSettings.primaryColor}</span>
                  </div>
                  <p className="text-xs text-text-secondary/60">Used for headings, main buttons, and text.</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">Accent Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={localSettings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="h-12 w-24 rounded cursor-pointer border border-white/10 p-1 bg-white/5"
                    />
                    <span className="text-text-secondary font-mono">{localSettings.accentColor}</span>
                  </div>
                  <p className="text-xs text-text-secondary/60">Used for highlights, links, and active states.</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">Background Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="h-12 w-24 rounded cursor-pointer border border-white/10 p-1 bg-white/5"
                    />
                    <span className="text-text-secondary font-mono">{localSettings.backgroundColor}</span>
                  </div>
                  <p className="text-xs text-text-secondary/60">Main application background.</p>
                </div>
              </div>
            </section>

            {/* Layout Section */}
            <section className="pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Layout size={20} /> Layout Preferences
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <h4 className="font-bold text-white">Compact Mode</h4>
                  <p className="text-sm text-text-secondary">Reduce spacing for a denser information view.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={localSettings.isCompact}
                    onChange={(e) => handleChange('isCompact', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </section>
          </div>

          <div className="p-8 bg-white/5 border-t border-white/10 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-white/20 text-text-secondary hover:bg-white/10 hover:text-red-400 hover:border-red-400/50"
            >
              <RotateCcw size={18} className="mr-2" /> Reset to Default
            </Button>
            
            <Button 
              onClick={handleSave}
              isLoading={isSaving}
              className="bg-primary text-background hover:bg-primary/90 shadow-glow border-none"
            >
              <Save size={18} className="mr-2" /> Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
