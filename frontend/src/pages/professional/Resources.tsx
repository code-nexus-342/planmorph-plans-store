import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, ExternalLink, PenTool, Video } from 'lucide-react';
import Button from '../../components/ui/Button';

interface ResourceItem {
  title: string;
  type: string;
  readTime?: string;
  size?: string;
  link?: string;
}

interface ResourceSection {
  category: string;
  icon: React.ReactNode;
  items: ResourceItem[];
}

const resources: ResourceSection[] = [
  {
    category: "Guides & Tutorials",
    icon: <BookOpen className="text-blue-400" size={24} />,
    items: [
      { title: "Getting Started with PlanMorph Pro", type: "Guide", readTime: "5 min read" },
      { title: "Optimizing Your Design Portfolio", type: "Tutorial", readTime: "10 min read" },
      { title: "Understanding Client Requirements", type: "Guide", readTime: "7 min read" },
    ]
  },
  {
    category: "Templates & Assets",
    icon: <Download className="text-green-400" size={24} />,
    items: [
      { title: "Project Proposal Template", type: "DOCX", size: "2.5 MB" },
      { title: "Client Contract Agreement", type: "PDF", size: "1.2 MB" },
      { title: "Site Analysis Checklist", type: "PDF", size: "0.8 MB" },
    ]
  },
  {
    category: "Tools & Software",
    icon: <PenTool className="text-purple-400" size={24} />,
    items: [
      { title: "3D Rendering Plugins", type: "Plugin", link: "#" },
      { title: "CAD Library Manager", type: "Software", link: "#" },
      { title: "Project Management Suite", type: "SaaS", link: "#" },
    ]
  }
];

const ProfessionalResources: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Professional Resources</h1>
        <p className="text-text-secondary text-lg">
          Everything you need to succeed as a professional on PlanMorph. Access guides, templates, and tools curated for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((section, index) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold text-white">{section.category}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="group p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium group-hover:text-accent transition-colors mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white/70">{item.type}</span>
                        {item.readTime && <span>• {item.readTime}</span>}
                        {item.size && <span>• {item.size}</span>}
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5">
              <Button variant="outline" className="w-full text-sm py-2">View All</Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Video Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 glass-panel p-8 rounded-2xl border border-white/10 bg-surface/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-accent/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Video size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Featured Webinar</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Future of Sustainable Architecture</h2>
            <p className="text-text-secondary mb-6">
              Join industry leaders as they discuss the latest trends in eco-friendly design and sustainable building materials. 
              Learn how to incorporate these practices into your next project.
            </p>
            <Button className="bg-accent text-background hover:bg-accent/90 shadow-glow">
              Watch Now
            </Button>
          </div>
          <div className="flex-1 w-full aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-white/10">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalResources;
