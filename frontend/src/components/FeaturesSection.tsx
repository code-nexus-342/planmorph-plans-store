import { Box, Download, Users, Shield, Zap, Headphones } from "lucide-react";

const features = [
  {
    icon: Box,
    title: "3D Visualization",
    description: "Experience your future home with immersive 3D renders and virtual tours before you build.",
  },
  {
    icon: Download,
    title: "Instant Download",
    description: "Get immediate access to complete architectural plans, blueprints, and documentation.",
  },
  {
    icon: Users,
    title: "Expert Architects",
    description: "Plans designed by certified architects with years of experience in residential design.",
  },
  {
    icon: Shield,
    title: "Licensed & Legal",
    description: "All plans meet local building codes and come with proper licensing documentation.",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Skip months of design time with ready-to-build plans that accelerate your construction timeline.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our expert team is always ready to help you with any questions or customizations.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose PlanMorph?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We&apos;re revolutionizing home building with innovative technology, expert design, 
            and unmatched customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">House Plans</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50M+</div>
              <div className="text-blue-100">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Expert Architects</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
