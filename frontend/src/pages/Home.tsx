import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, PenTool, Home as HomeIcon, Building2, Grid, Layers, Briefcase, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import FeatureCard from '../components/FeatureCard';
import ProcessStep from '../components/ProcessStep';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 bg-gray-50">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center grayscale" />
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold tracking-widest text-architect-900 uppercase border border-architect-900/20 bg-white">
                <Building2 size={14} />
                Premium Architectural Plans
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="mb-8 text-5xl font-heading font-bold tracking-tight text-architect-900 sm:text-7xl leading-tight"
            >
              PlanMorph Plans Store <br />
              <span className="text-gray-500 font-light italic">
                Ready Made & Custom Designs
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-12 text-xl text-gray-600 sm:text-2xl max-w-2xl mx-auto font-light leading-relaxed"
            >
              Discover a curated collection of architectural masterpieces. From modern villas to commercial complexes, find the perfect blueprint for your vision.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <Link to="/designs">
                <button className="btn-primary min-w-[200px]">
                  Browse Plans
                </button>
              </Link>
              <Link to="/custom-design">
                <button className="btn-secondary min-w-[200px]">
                  Request Custom Design
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search & Categories Section */}
      <section className="relative z-20 -mt-24 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white shadow-float p-8 max-w-5xl mx-auto border-t-4 border-accent-teal"
          >
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by style, plot size, or budget..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 focus:border-accent-teal focus:outline-none transition-colors"
                />
              </div>
              <button className="bg-architect-900 text-white px-8 py-4 font-bold uppercase tracking-wide hover:bg-accent-teal transition-colors">
                Search
              </button>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Villas', icon: HomeIcon },
                { name: 'Bungalows', icon: HomeIcon },
                { name: 'Maisonettes', icon: Layers },
                { name: 'Apartments', icon: Building2 },
                { name: 'Extensions', icon: Grid },
                { name: 'Commercial', icon: Briefcase },
              ].map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-4 border border-gray-100 hover:border-accent-teal hover:bg-gray-50 cursor-pointer transition-all group">
                  <cat.icon className="mb-2 text-gray-400 group-hover:text-accent-teal transition-colors" size={24} />
                  <span className="text-sm font-bold text-architect-900 uppercase tracking-wide">{cat.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <AnimatedCounter end={1500} suffix="+" className="text-4xl font-heading font-bold text-architect-900" />
              <p className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Ready Designs</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <AnimatedCounter end={350} suffix="+" className="text-4xl font-heading font-bold text-architect-900" />
              <p className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Licensed Architects</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <AnimatedCounter end={5000} suffix="+" className="text-4xl font-heading font-bold text-architect-900" />
              <p className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Successful Builds</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <AnimatedCounter end={100} suffix="%" className="text-4xl font-heading font-bold text-architect-900" />
              <p className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-heading font-bold text-architect-900 sm:text-5xl">
              Why Choose <span className="text-accent-teal">PlanMorph?</span>
            </h2>
            <p className="text-xl text-gray-500 font-light">
              We provide professional-grade architectural drawings that are ready for construction.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={CheckCircle2}
              title="Code Compliant"
              description="All plans are designed to meet standard building codes and regulations."
              delay={0}
            />
            <FeatureCard 
              icon={PenTool}
              title="Fully Customizable"
              description="Request modifications to any plan to perfectly fit your plot and needs."
              delay={0.1}
            />
            <FeatureCard 
              icon={Layers}
              title="Complete Sets"
              description="Includes floor plans, elevations, sections, and structural details."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <span className="mb-4 block font-mono text-sm font-bold uppercase tracking-widest text-accent-teal">How It Works</span>
            <h2 className="text-4xl font-heading font-bold text-architect-900 sm:text-5xl">
              From Concept to <span className="text-accent-gold">Construction</span>
            </h2>
          </div>

          <div className="mx-auto max-w-5xl space-y-16">
            <ProcessStep 
              number={1}
              icon={Search}
              title="Browse & Select"
              description="Filter through our extensive library to find a design that matches your requirements."
            />
            <ProcessStep 
              number={2}
              icon={PenTool}
              title="Customize (Optional)"
              description="Work with our team to adjust the layout or specifications if needed."
            />
            <ProcessStep 
              number={3}
              icon={CheckCircle2}
              title="Download & Build"
              description="Receive high-quality PDF and CAD files instantly, ready for your contractor."
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-architect-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-overlay" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-8 text-5xl font-heading font-bold sm:text-6xl">
            Ready to Start Your Project?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-400">
            Whether you need a ready-made plan or a custom design, we have the expertise to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/designs">
              <button className="px-10 py-5 bg-white text-architect-900 font-bold text-xl tracking-wide hover:bg-gray-100 transition-colors">
                View Collection
              </button>
            </Link>
            <Link to="/custom-design">
              <button className="px-10 py-5 border border-white text-white font-bold text-xl tracking-wide hover:bg-white hover:text-architect-900 transition-colors">
                Custom Request
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
