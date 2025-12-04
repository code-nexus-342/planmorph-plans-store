import React from 'react';
import { Check } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          No hidden fees. Pay once and own the plans forever.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Standard Plan */}
        <div className="glass-panel p-8 flex flex-col rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">Standard Plans</h3>
          <div className="text-4xl font-bold text-primary mb-6">Market Rates</div>
          <p className="text-text-secondary mb-8 text-sm">Perfect for individuals looking for high-quality, pre-designed homes.</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Architectural Floor Plans</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Elevations & Sections</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>3D Renderings</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Instant Download</span>
            </li>
          </ul>
          
          <Button onClick={() => navigate('/designs')} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Browse Plans</Button>
        </div>

        {/* Custom Design */}
        <div className="bg-primary/10 border border-primary/30 shadow-glow p-8 flex flex-col transform md:-translate-y-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-background text-xs font-bold px-3 py-1 uppercase tracking-wider">Most Popular</div>
          <h3 className="text-xl font-bold mb-2 text-white">Custom Design</h3>
          <div className="text-4xl font-bold text-primary mb-6">Custom Quote</div>
          <p className="text-text-secondary mb-8 text-sm">Tailored specifically to your plot, budget, and lifestyle requirements.</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-white">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Bespoke Architecture</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-white">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Site Analysis & Planning</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-white">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Structural Engineering</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-white">
              <Check size={16} className="text-primary mt-0.5" />
              <span>County Approval Support</span>
            </li>
          </ul>
          
          <Button onClick={() => navigate('/custom-design')} className="w-full bg-primary text-background hover:bg-primary/90 border-none shadow-glow">Request Quote</Button>
        </div>

        {/* Modifications */}
        <div className="glass-panel p-8 flex flex-col rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">Modifications</h3>
          <div className="text-4xl font-bold text-primary mb-6">Hourly Rate</div>
          <p className="text-text-secondary mb-8 text-sm">Need to tweak an existing plan? We can adjust it to fit your needs.</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Minor Layout Changes</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Facade Updates</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Additional Details</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-text-secondary">
              <Check size={16} className="text-primary mt-0.5" />
              <span>Fast Turnaround</span>
            </li>
          </ul>
          
          <Button onClick={() => navigate('/contact')} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Contact Us</Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
