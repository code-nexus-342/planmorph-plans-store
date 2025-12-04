import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, TrendingUp, Globe, Shield, ArrowRight, Building2, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const ProfessionalLanding: React.FC = () => {
  return (
    <div className="bg-background text-text-primary overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center opacity-20 animate-scale-up" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="container relative z-20 mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 px-6 py-2 text-sm font-bold tracking-[0.2em] text-accent uppercase border border-accent/20 bg-accent/5 backdrop-blur-md rounded-full shadow-glow animate-glow">
                <Briefcase size={14} className="text-accent" />
                For Professionals
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="mb-8 text-5xl md:text-7xl font-heading font-bold tracking-tighter text-white leading-[1.1]"
            >
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-primary animate-gradient-x">
                Professional Practice
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-12 text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto font-light leading-relaxed"
            >
              Join the premier marketplace for Architects, Engineers, and Surveyors. Showcase your work, reach global clients, and manage your projects with ease.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <Link to="/professional/apply">
                <button className="px-8 py-4 bg-accent text-background font-heading font-bold tracking-wide uppercase rounded-full hover:bg-accent/90 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 group shadow-xl">
                  Apply Now
                  <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>
              <Link to="/login">
                <button className="px-8 py-4 bg-transparent text-white border-2 border-white/20 font-heading font-bold tracking-wide uppercase rounded-full hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                  Login to Portal
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-surface relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Why Join PlanMorph?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">We provide the tools and platform you need to scale your business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-all duration-300 group">
              <div className="h-14 w-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Globe className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Global Reach</h3>
              <p className="text-text-secondary leading-relaxed">
                Showcase your designs to a worldwide audience of potential clients looking for professional architectural plans.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-all duration-300 group">
              <div className="h-14 w-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Passive Income</h3>
              <p className="text-text-secondary leading-relaxed">
                Earn revenue from your existing portfolio. Upload once and sell multiple times to qualified buyers.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-all duration-300 group">
              <div className="h-14 w-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Shield className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Verified Status</h3>
              <p className="text-text-secondary leading-relaxed">
                Get a verified professional badge that builds trust with clients and sets you apart from the competition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Join Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-accent/5 skew-x-12 -translate-x-20 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">Who Can Join?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-accent/10 p-2 rounded-lg">
                    <Building2 className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Architects</h3>
                    <p className="text-text-secondary">Licensed architects with a portfolio of residential or commercial designs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-accent/10 p-2 rounded-lg">
                    <Users className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Engineers</h3>
                    <p className="text-text-secondary">Structural, Civil, and Electrical engineers offering specialized plans and consultations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-accent/10 p-2 rounded-lg">
                    <CheckCircle2 className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Surveyors</h3>
                    <p className="text-text-secondary">Professional surveyors providing land survey and mapping services.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Simple Application Process</h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent text-background font-bold flex items-center justify-center text-lg">1</div>
                    <p className="text-white font-medium">Submit your professional details</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-lg border border-white/20">2</div>
                    <p className="text-white font-medium">Upload proof of qualifications</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-lg border border-white/20">3</div>
                    <p className="text-white font-medium">Get verified by our admin team</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-lg border border-white/20">4</div>
                    <p className="text-white font-medium">Start uploading and earning</p>
                  </div>
                </div>
                <div className="mt-10 text-center">
                  <Link to="/professional/apply">
                    <Button className="w-full bg-accent text-background hover:bg-accent/90 shadow-glow">Start Application</Button>
                  </Link>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalLanding;
