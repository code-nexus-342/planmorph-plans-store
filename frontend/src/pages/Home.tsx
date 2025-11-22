import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HardHat, 
  Ruler, 
  FileCheck, 
  Users, 
  Building2, 
  ArrowRight, 
  CheckCircle2,
  Hammer,
  Scroll,
  Cpu,
  Zap
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import FeatureCard from '../components/FeatureCard';
import ProcessStep from '../components/ProcessStep';
import { fadeInUp, staggerContainer, fadeIn } from '../utils/animations';

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            style={{ y: y1, opacity }}
            className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-neon-purple/20 blur-[120px]" 
          />
          <motion.div 
            style={{ y: y2, opacity }}
            className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-neon-cyan/10 blur-[120px]" 
          />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-5xl"
          >
            <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-1.5 text-sm font-medium text-neon-cyan backdrop-blur-md shadow-neon-cyan">
                <Zap size={14} className="animate-pulse" />
                The Future of Architectural Design
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="mb-8 text-6xl font-heading font-black tracking-tight text-white sm:text-8xl leading-tight"
            >
              Design the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-shimmer bg-[length:200%_auto]">
                Impossible
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-12 text-xl text-gray-300 sm:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
            >
              Access visionary, construction-ready blueprints from the world's top digital architects. Transform abstract concepts into concrete reality.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <Link to="/designs">
                <button className="group relative px-8 py-4 rounded-full bg-neon-cyan text-nebula-900 font-bold text-lg tracking-wide overflow-hidden transition-all hover:scale-105 hover:shadow-neon-cyan">
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Designs <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </Link>
              <Link to="/architect/apply">
                <button className="group px-8 py-4 rounded-full border border-glass-200 bg-glass-100 text-white font-medium text-lg backdrop-blur-md transition-all hover:bg-glass-200 hover:border-neon-purple hover:text-neon-purple">
                  Join the Collective
                </button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={fadeIn}
              className="mt-20 flex flex-wrap justify-center gap-12 text-gray-400 font-mono text-sm tracking-wider uppercase"
            >
              <div className="flex items-center gap-3">
                <Cpu className="text-neon-cyan" size={20} />
                <span>AI-Verified Specs</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="text-neon-purple" size={20} />
                <span>BIM Ready Models</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-neon-magenta" size={20} />
                <span>Instant Digital Delivery</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="glass-panel p-12 grid grid-cols-2 gap-8 md:grid-cols-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5" />
            
            <div className="relative text-center">
              <AnimatedCounter end={1500} suffix="+" className="text-5xl font-heading font-bold text-white text-shadow-lg" />
              <p className="mt-2 text-sm font-medium text-neon-cyan uppercase tracking-widest">Visionary Designs</p>
            </div>
            <div className="relative text-center border-l border-glass-200">
              <AnimatedCounter end={350} suffix="+" className="text-5xl font-heading font-bold text-white text-shadow-lg" />
              <p className="mt-2 text-sm font-medium text-neon-purple uppercase tracking-widest">Elite Architects</p>
            </div>
            <div className="relative text-center border-l border-glass-200">
              <AnimatedCounter end={5000} suffix="+" className="text-5xl font-heading font-bold text-white text-shadow-lg" />
              <p className="mt-2 text-sm font-medium text-neon-magenta uppercase tracking-widest">Futuristic Builds</p>
            </div>
            <div className="relative text-center border-l border-glass-200">
              <AnimatedCounter end={99} suffix="%" className="text-5xl font-heading font-bold text-white text-shadow-lg" />
              <p className="mt-2 text-sm font-medium text-neon-cyan uppercase tracking-widest">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neon-purple/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-heading font-bold text-white sm:text-5xl">
              Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Blueprints</span>
            </h2>
            <p className="text-xl text-gray-400 font-light">
              We don't just sell plans. We provide a complete digital ecosystem for modern construction.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={Scroll}
              title="Smart Contracts"
              description="Secure, blockchain-verified ownership transfer of all architectural IP."
              delay={0}
            />
            <FeatureCard 
              icon={FileCheck}
              title="AI Compliance"
              description="Automated pre-checks against major international building codes."
              delay={0.1}
            />
            <FeatureCard 
              icon={Users}
              title="Holographic Support"
              description="Connect with architects via immersive video calls for real-time modifications."
              delay={0.2}
            />
            <FeatureCard 
              icon={Ruler}
              title="Precision CAD"
              description="Millimeter-perfect digital files compatible with all major BIM software."
              delay={0.3}
            />
            <FeatureCard 
              icon={HardHat}
              title="AR Visualization"
              description="Project designs onto your site using our companion mobile app."
              delay={0.4}
            />
            <FeatureCard 
              icon={Building2}
              title="Eco-Analysis"
              description="Built-in energy efficiency and sustainability modeling for every design."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-nebula-800/50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center">
            <span className="mb-4 block font-mono text-sm font-bold uppercase tracking-widest text-neon-cyan">The Workflow</span>
            <h2 className="text-4xl font-heading font-bold text-white sm:text-5xl">
              From <span className="text-neon-purple">Pixel</span> to <span className="text-neon-magenta">Physical</span>
            </h2>
          </div>

          <div className="mx-auto max-w-5xl space-y-16">
            <ProcessStep 
              number={1}
              icon={Users}
              title="Discover"
              description="Navigate our curated multiverse of architectural designs using AI-powered search."
            />
            <ProcessStep 
              number={2}
              icon={FileCheck}
              title="Acquire"
              description="Instant secure transaction unlocks full technical documentation and 3D assets."
            />
            <ProcessStep 
              number={3}
              icon={Hammer}
              title="Adapt"
              description="Use our digital tools to customize layouts or hire the original creator for bespoke changes."
            />
            <ProcessStep 
              number={4}
              icon={HardHat}
              title="Construct"
              description="Deploy the verified plans to your build team and watch the future take shape."
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-8 text-5xl font-heading font-black text-white sm:text-7xl">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white">Launch?</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Join the revolution of digital architecture. Your masterpiece awaits.
          </p>
          <Link to="/designs">
            <button className="px-10 py-5 rounded-full bg-white text-nebula-900 font-bold text-xl tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
              Start Your Journey <ArrowRight className="inline-block ml-2" size={24} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
