"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Sparkles, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletter';
import Confetti from './Confetti';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
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
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Confetti Animation on Success */}
      <Confetti show={showConfetti} />
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
      
      {/* Futuristic Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink blur-xl opacity-50 animate-pulse"></div>
              <div className="relative p-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                <Mail className="w-12 h-12 text-brand-cyan" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-brand-pink animate-pulse" />
              <Zap className="absolute -bottom-2 -left-2 w-6 h-6 text-brand-purple animate-bounce" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink bg-clip-text text-transparent">
              Join the Future
            </span>
            <br />
            <span className="text-white">of Architectural Design</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Subscribe to our newsletter and get exclusive access to new house plans, design tips, 
            and special offers before anyone else.
          </motion.p>
        </motion.div>

        {/* Newsletter Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass p-8 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`mb-6 p-5 rounded-xl border backdrop-blur-sm ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.type === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 animate-bounce" />
                    ) : (
                      <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-base leading-relaxed">{message.text}</p>
                      {message.type === 'success' && (
                        <p className="text-sm mt-2 opacity-90">
                          🎁 Plus, we've sent you a special welcome gift! Check your inbox.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-cyan/20 via-brand-purple/20 to-brand-pink/20 opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"></div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                    className="w-full px-6 py-4 pl-14 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all duration-300 text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-cyan transition-colors duration-300" />
                </div>
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink hover:shadow-glow-cyan text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center justify-center whitespace-nowrap">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Sparkles, text: 'Exclusive Plans' },
                { icon: Zap, text: 'Early Access' },
                { icon: Mail, text: 'Weekly Updates' }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-400"
                >
                  <item.icon className="w-4 h-4 text-brand-cyan" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              🔒 We respect your privacy. No spam, unsubscribe at any time.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: '10K+', label: 'Subscribers' },
            { value: '500+', label: 'House Plans' },
            { value: '50+', label: 'Architects' }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
