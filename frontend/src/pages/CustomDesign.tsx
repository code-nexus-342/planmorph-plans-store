import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Upload, Check, ChevronRight, Ruler, Home, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fadeInUp, staggerContainer } from '../utils/animations';

const CustomDesign: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    plotSize: '',
    location: '',
    budget: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    description: '',
    files: null as FileList | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, files: e.target.files }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/custom-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Request submitted successfully! Our team will contact you shortly.');
        // Reset form or redirect
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      {/* Header */}
      <div className="bg-surface/30 border-b border-white/10 backdrop-blur-md py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary uppercase tracking-widest font-bold text-sm">
              <PenTool size={16} />
              <span>Bespoke Architecture</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">Request Custom Design</h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Collaborate with our licensed architects and engineers to bring your unique vision to life. 
              From initial sketches to full construction documentation.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10"></div>
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex flex-col items-center gap-2 bg-background px-2`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 border ${
                  step >= s ? 'bg-primary text-background border-primary shadow-glow' : 'bg-white/5 text-text-secondary border-white/10'
                }`}>
                  {step > s ? <Check size={20} /> : s}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  step >= s ? 'text-primary' : 'text-text-secondary'
                }`}>
                  {s === 1 ? 'Project Details' : s === 2 ? 'Requirements' : 'Contact Info'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="glass-panel p-8 md:p-12 rounded-2xl"
        >
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div variants={fadeInUp} className="space-y-8">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                    <Home className="text-primary" size={24} /> Project Overview
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-text-secondary uppercase tracking-wider">Project Type</label>
                    <select 
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="flex h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                    >
                      <option value="" className="bg-surface text-white">Select Type</option>
                      <option value="residential" className="bg-surface text-white">Residential (Villa/Bungalow)</option>
                      <option value="commercial" className="bg-surface text-white">Commercial</option>
                      <option value="apartment" className="bg-surface text-white">Apartment Complex</option>
                      <option value="renovation" className="bg-surface text-white">Renovation/Extension</option>
                    </select>
                  </div>
                  <Input 
                    label="Plot Size (e.g. 50x100 ft)"
                    name="plotSize"
                    value={formData.plotSize}
                    onChange={handleInputChange}
                    placeholder="Dimensions or Total Area"
                  />
                  <Input 
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                  <Input 
                    label="Estimated Budget (KES)"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g. 5,000,000"
                  />
                </div>

                <div className="flex justify-end pt-6">
                  <Button type="button" onClick={nextStep} className="w-full md:w-auto bg-primary text-background hover:bg-primary/90 shadow-glow border-none">
                    Next Step <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div variants={fadeInUp} className="space-y-8">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                    <Ruler className="text-primary" size={24} /> Design Requirements
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <Input 
                    label="Bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                  />
                  <Input 
                    label="Bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                  <Input 
                    label="Floors"
                    name="floors"
                    type="number"
                    value={formData.floors}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-text-secondary uppercase tracking-wider">Additional Details / Wishlist</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                    placeholder="Describe your vision, specific style preferences, or must-have features..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-text-secondary uppercase tracking-wider">Upload Plot Map or Sketches</label>
                  <div className="border-2 border-dashed border-white/10 bg-white/5 p-8 text-center hover:border-primary transition-colors cursor-pointer relative rounded-xl">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-text-secondary mb-2" size={32} />
                    <p className="text-sm text-text-secondary font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-text-secondary/60 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                    {formData.files && (
                      <div className="mt-4 text-sm text-primary font-bold">
                        {formData.files.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={prevStep} className="border-white/20 text-white hover:bg-white/10">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="bg-primary text-background hover:bg-primary/90 shadow-glow border-none">
                    Next Step <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div variants={fadeInUp} className="space-y-8">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                    <User className="text-primary" size={24} /> Contact Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                  <Input 
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="bg-white/5 p-6 border border-white/10 text-sm text-text-secondary rounded-lg">
                  <p className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5" size={16} />
                    <span>Your project will be handled by licensed architects & engineers.</span>
                  </p>
                  <p className="flex items-start gap-2 mt-2">
                    <Check className="text-primary mt-0.5" size={16} />
                    <span>We will review your requirements and provide a preliminary consultation within 24 hours.</span>
                  </p>
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={prevStep} className="border-white/20 text-white hover:bg-white/10">
                    Back
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-background border-none shadow-glow">
                    Submit Request
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomDesign;
