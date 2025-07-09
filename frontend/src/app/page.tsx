// =====src/app/page.txs=====
import HeroSection from "../components/HeroSection";
import PlanGrid from "../components/PlanGrid";
import FeaturesSection from "../components/FeaturesSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured House Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our most popular architectural designs, carefully curated by expert architects 
            and loved by thousands of homeowners worldwide.
          </p>
        </div>
        <PlanGrid />
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            View All Plans
          </button>
        </div>
      </section>
      <FeaturesSection />
    </>
  );
}

