// ====src/components/HeroSection.tsx====
"use client";
import { ArrowRight, Sparkles, Star, Users, Building, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1] as const
            }
        }
    };

    const floatVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    // Fixed particle positions to avoid hydration mismatch
    const particlePositions = [
        { left: 15, top: 20 }, { left: 35, top: 45 }, { left: 55, top: 15 }, { left: 75, top: 60 },
        { left: 25, top: 75 }, { left: 45, top: 30 }, { left: 65, top: 80 }, { left: 85, top: 25 },
        { left: 10, top: 50 }, { left: 30, top: 10 }, { left: 50, top: 70 }, { left: 70, top: 35 },
        { left: 90, top: 55 }, { left: 20, top: 65 }, { left: 40, top: 40 }, { left: 60, top: 85 },
        { left: 80, top: 15 }, { left: 5, top: 45 }, { left: 95, top: 30 }, { left: 50, top: 5 }
    ];

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white overflow-hidden">
            {/* Animated Background Layers */}
            <div className="absolute inset-0">
                {/* Gradient Mesh */}
                <motion.div 
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(0, 212, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at ${30 - mousePosition.x}% ${70 - mousePosition.y}%, rgba(123, 47, 247, 0.15) 0%, transparent 50%)`
                    }}
                />
                
                {/* Geometric Grid */}
                <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full" style={{
                        backgroundImage: `linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
                
                {/* Floating Orbs */}
                <motion.div 
                    className="absolute top-20 left-[10%] w-64 h-64 rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)'
                    }}
                    variants={floatVariants}
                    initial="initial"
                    animate="animate"
                />
                <motion.div 
                    className="absolute bottom-32 right-[15%] w-96 h-96 rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(123, 47, 247, 0.25) 0%, transparent 70%)'
                    }}
                    initial={{ y: 0 }}
                    animate={{
                        y: [10, -10, 10],
                        transition: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut" as const
                        }
                    }}
                />
                <motion.div 
                    className="absolute top-1/2 left-[20%] w-48 h-48 rounded-full blur-2xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 46, 151, 0.2) 0%, transparent 70%)'
                    }}
                    initial={{ y: 0 }}
                    animate={{
                        y: [-15, 15, -15],
                        transition: {
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut" as const
                        }
                    }}
                />

                {/* Particles */}
                {isClient && particlePositions.map((pos, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        style={{
                            left: `${pos.left}%`,
                            top: `${pos.top}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0]
                        }}
                        transition={{
                            duration: 3 + (i * 0.2),
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut" as const
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Content */}
                <motion.div 
                    className="pt-32 pb-20 text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Premium Badge */}
                    <motion.div 
                        className="inline-flex items-center space-x-2 glass border-glow-cyan rounded-full px-6 py-3 mb-8 group hover:bg-[#1a1a2e] transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Premium Architectural & Engineering Collection
                        </span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-glow"></div>
                    </motion.div>

                    {/* Main Heading with 3D Effect */}
                    <motion.h1 
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
                        variants={itemVariants}
                    >
                        <motion.span 
                            className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                            style={{
                                transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0)`
                            }}
                        >
                            Build Your
                        </motion.span>
                        <motion.span 
                            className="block neon-text"
                            style={{
                                background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff2e97 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                transform: `translate3d(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px, 0)`
                            }}
                        >
                            Dream Home
                        </motion.span>
                        <motion.span 
                            className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                            style={{
                                transform: `translate3d(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px, 0)`
                            }}
                        >
                            Today
                        </motion.span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p 
                        className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto text-gray-300 leading-relaxed mb-12"
                        variants={itemVariants}
                    >
                        Browse <span className="text-cyan-400 font-semibold">ready-made architectural plans</span> and stunning 3D renders for instant, confident building with <span className="font-bold holographic bg-clip-text text-transparent">PlanMorph</span>.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
                        variants={itemVariants}
                    >
                        <motion.button 
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-semibold text-lg overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                Browse Plans
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                                initial={{ x: '100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'var(--glow-cyan)' }}></div>
                        </motion.button>
                        <motion.button 
                            className="group px-8 py-4 glass border-2 border-cyan-500/30 hover:border-cyan-500 rounded-2xl font-semibold text-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-gray-300 group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                                <Globe className="mr-2 w-5 h-5" />
                                Watch Demo
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Stats Section with 3D Cards */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
                        variants={containerVariants}
                    >
                        {[
                            { icon: Building, value: "10K+", label: "House Plans", color: "cyan" },
                            { icon: Users, value: "50M+", label: "Happy Users", color: "purple" },
                            { icon: Star, value: "500+", label: "Expert Architects", color: "pink" },
                            { icon: Zap, value: "99.9%", label: "Client Satisfaction", color: "cyan" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="group card-3d glass hover:glass-hover rounded-2xl p-6 perspective-1000"
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.05,
                                    rotateY: 5,
                                    rotateX: 5
                                }}
                            >
                                <div className="flex flex-col items-center preserve-3d">
                                    <stat.icon className={`w-8 h-8 mb-3 text-${stat.color}-400`} />
                                    <div className={`text-3xl md:text-4xl font-bold text-white group-hover:text-${stat.color}-400 transition-colors duration-300`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-400 font-medium mt-2">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Gradient Line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            
            {/* Scroll Indicator */}
            <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-cyan-400 rounded-full p-1">
                    <motion.div 
                        className="w-1 h-3 bg-cyan-400 rounded-full mx-auto"
                        animate={{ y: [0, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    ></motion.div>
                </div>
            </motion.div>
        </section>
    )
}