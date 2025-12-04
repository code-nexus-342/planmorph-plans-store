import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, PenTool, Home as HomeIcon, Building2, Grid, Layers, Briefcase, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import ProcessStep from '../components/ProcessStep';
import { fadeInUp, staggerContainer } from '../utils/animations';

import { getCategories } from '../services/categories.service';

const Home: React.FC = () => {
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  // Map icon keys to components
  const getIcon = (key: string) => {
    const icons: any = {
      Home: HomeIcon,
      Layers: Layers,
      Building2: Building2,
      Grid: Grid,
      Briefcase: Briefcase,
    };
    return icons[key] || HomeIcon;
  };

  const [userType, setUserType] = React.useState<'client' | 'professional' | null>(null);

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6">
              Welcome to <span className="text-primary">PlanMorph</span>
            </h1>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
              The premier marketplace for architectural designs. Please select how you would like to proceed.
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              {/* Client Option */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer bg-surface/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full max-w-sm hover:border-primary/50 transition-all duration-300 shadow-2xl"
                onClick={() => setUserType('client')}
              >
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <HomeIcon size={40} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">I am a Client</h3>
                <p className="text-text-secondary">
                  I'm looking for architectural plans for my dream home or project.
                </p>
              </motion.div>

              {/* Professional Option */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer bg-surface/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full max-w-sm hover:border-accent/50 transition-all duration-300 shadow-2xl"
                onClick={() => {
                    setUserType('professional');
                    // Redirect to professional portal or show professional content
                    // For now, we can just set state, but maybe we want to redirect to a specific professional landing?
                    // The user said "receive necessary content". 
                    // Let's just redirect to the professional apply/login flow if they choose professional, 
                    // or show a professional-focused landing page.
                    // For simplicity in this step, let's redirect to the apply page if they are new, or login.
                    // But wait, the user said "dual domain app".
                    // Let's keep it simple: if professional, go to /professional/apply (or a professional landing).
                    window.location.href = '/professional'; 
                }}
              >
                <div className="h-20 w-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <Briefcase size={40} className="text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">I am a Professional</h3>
                <p className="text-text-secondary">
                  I'm an architect, engineer, or surveyor looking to upload designs.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-background text-text-primary">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop')] bg-cover bg-center opacity-20 animate-scale-up" />
          
          {/* Neon Glow Effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        </div>
        
        <div className="container relative z-20 mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 px-6 py-2 text-sm font-bold tracking-[0.2em] text-primary uppercase border border-primary/20 bg-primary/5 backdrop-blur-md rounded-full shadow-glow animate-glow">
                <Sparkles size={14} className="text-primary" />
                Next Gen Architecture
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="mb-8 text-6xl md:text-8xl font-heading font-bold tracking-tighter text-white leading-[1.1]"
            >
              Design Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">
                Dream Reality
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-12 text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto font-light leading-relaxed"
            >
              A curated collection of architectural masterpieces. From modern villas to commercial complexes, find the blueprint that speaks to your vision.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <Link to="/designs">
                <button className="px-8 py-4 bg-primary text-background font-heading font-bold tracking-wide uppercase rounded-full hover:bg-primary/90 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 group">
                  Browse Collection
                  <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>
              <Link to="/custom-design">
                <button className="px-8 py-4 bg-transparent text-white border-2 border-white/20 font-heading font-bold tracking-wide uppercase rounded-full hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                  Custom Request
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-text-secondary"
        >
          <div className="w-6 h-10 border-2 border-text-secondary/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-primary rounded-full animate-scroll" />
          </div>
        </motion.div>
      </section>

      {/* Search & Categories Section */}
      <section className="relative z-30 -mt-32 pb-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 max-w-6xl mx-auto rounded-3xl shadow-2xl"
          >
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search by style, plot size, or budget..." 
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-lg text-white placeholder-text-secondary/50 backdrop-blur-sm"
                />
              </div>
              <button className="bg-primary text-background px-10 py-5 font-bold uppercase tracking-wide hover:bg-primary/90 transition-all rounded-xl shadow-glow hover:-translate-y-1">
                Search
              </button>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat, idx) => {
                const Icon = getIcon(cat.icon_key);
                return (
                  <div key={idx} className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/5 rounded-xl hover:border-primary hover:bg-white/10 hover:shadow-glow cursor-pointer transition-all duration-300 group backdrop-blur-sm">
                    <Icon className="mb-3 text-text-secondary group-hover:text-primary group-hover:scale-110 transition-all duration-300" size={28} />
                    <span className="text-xs font-bold text-white uppercase tracking-widest group-hover:text-primary transition-colors">{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-20 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Why Choose Us</span>
            <h2 className="mb-6 text-4xl md:text-5xl font-heading font-bold text-white">
              Professional Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary">Architecture</span>
            </h2>
            <p className="text-xl text-text-secondary font-light leading-relaxed">
              We provide construction-ready drawings that meet all regulatory standards, designed by licensed professionals.
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
      <section className="py-32 bg-surface relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2592&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-24 text-center">
            <span className="mb-4 block font-mono text-sm font-bold uppercase tracking-widest text-primary">How It Works</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white">
              From Concept to <span className="text-accent">Reality</span>
            </h2>
          </div>

          <div className="mx-auto max-w-5xl space-y-24">
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
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-surface/50 backdrop-blur-lg rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            
            <h2 className="mb-8 text-4xl md:text-6xl font-heading font-bold text-white">
              Ready to Start?
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-text-secondary font-light">
              Whether you need a ready-made plan or a custom design, we have the expertise to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/designs">
                <button className="px-8 py-4 bg-white text-background font-heading font-bold tracking-wide uppercase rounded-full hover:bg-primary hover:text-background hover:shadow-glow hover:-translate-y-1 transition-all duration-300 shadow-xl">
                  View Collection
                </button>
              </Link>
              <Link to="/custom-design">
                <button className="px-8 py-4 bg-transparent text-white border-2 border-white/20 font-heading font-bold tracking-wide uppercase rounded-full hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 transition-all duration-300">
                  Custom Request
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
