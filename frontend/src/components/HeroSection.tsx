// ====src/components/HeroSection.tsx====

export default function HeroSection() {
    return (
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                    Build Your Dream Home Today
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
                    Browse ready-made architectural plans and 3D renders for instant, confident building with PlanMorph.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Browse Plans
                    </button>
                    <button className="px-8 py-4 border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/10">
                        Learn More
                    </button>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </section>
    )
}