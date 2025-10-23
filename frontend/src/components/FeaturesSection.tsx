import { Box, Download, Users, Shield, Zap, Headphones, Star, Trophy, Crown } from "lucide-react";

const features = [
  {
    icon: Box,
    title: "3D Visualization",
    description: "Experience your future home with immersive 3D renders and virtual tours before you build.",
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400"
  },
  {
    icon: Download,
    title: "Instant Download",
    description: "Get immediate access to complete architectural plans, blueprints, and documentation.",
    gradient: "from-green-500 to-emerald-500",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400"
  },
  {
    icon: Users,
    title: "Expert Architects",
    description: "Plans designed by certified architects with years of experience in residential design.",
    gradient: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400"
  },
  {
    icon: Shield,
    title: "Licensed & Legal",
    description: "All plans meet local building codes and come with proper licensing documentation.",
    gradient: "from-red-500 to-rose-500",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400"
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Skip months of design time with ready-to-build plans that accelerate your construction timeline.",
    gradient: "from-yellow-500 to-orange-500",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our expert team is always ready to help you with any questions or customizations.",
    gradient: "from-indigo-500 to-blue-500",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400"
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-brand-400/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-8 py-4 mb-8 group hover:border-brand-500/50 transition-all duration-300">
            <Crown className="w-5 h-5 text-brand-400" />
            <span className="text-lg font-semibold text-white">Premium Features</span>
            <Trophy className="w-5 h-5 text-brand-400" />
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose
            </span>
            <span className="block bg-gradient-to-r from-brand-400 to-orange-500 bg-clip-text text-transparent">
              PlanMorph?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're revolutionizing home building with <span className="text-brand-400 font-semibold">innovative technology</span>, expert design, 
            and unmatched customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl hover:border-slate-600 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-dark-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 relative z-10`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Premium Stats Section */}
        <div className="relative mt-20">
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-brand-400 mr-3" />
                  <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-brand-400 transition-colors duration-300">10K+</div>
                </div>
                <div className="text-gray-400 font-medium text-lg">House Plans</div>
              </div>
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-brand-400 mr-3" />
                  <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-brand-400 transition-colors duration-300">50M+</div>
                </div>
                <div className="text-gray-400 font-medium text-lg">Happy Users</div>
              </div>
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-brand-400 mr-3" />
                  <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-brand-400 transition-colors duration-300">500+</div>
                </div>
                <div className="text-gray-400 font-medium text-lg">Expert Architects</div>
              </div>
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-brand-400 mr-3" />
                  <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-brand-400 transition-colors duration-300">99.9%</div>
                </div>
                <div className="text-gray-400 font-medium text-lg">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
