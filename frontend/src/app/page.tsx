// =====src/app/page.txs=====
import HeroSection from "../components/HeroSection";
import PlanGrid from "../components/PlanGrid";
import FeaturesSection from "../components/FeaturesSection";

export default function HomePage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <HeroSection />
      
      {/* Featured Plans Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {/* Section Badge */}
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300">Curated Collection</span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Featured House
              </span>
              <span className="block bg-gradient-to-r from-brand-400 to-orange-500 bg-clip-text text-transparent">
                Plans
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover our most popular architectural designs, carefully curated by expert architects 
              and loved by <span className="text-brand-400 font-semibold">thousands of homeowners</span> worldwide.
            </p>
          </div>
          
          <PlanGrid />
          
          <div className="text-center mt-20">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-orange-600 text-white rounded-xl font-semibold text-xl transition-all duration-500 transform hover:scale-105 shadow-glow hover:shadow-glow-lg">
              <span className="relative z-10">View All Plans</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>
      
      <FeaturesSection />
    </div>
  );
}

