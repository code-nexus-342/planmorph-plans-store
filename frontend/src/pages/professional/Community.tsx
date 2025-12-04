import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Heart, MessageCircle, Share2, Search } from 'lucide-react';
import Button from '../../components/ui/Button';


const discussions = [
  {
    id: 1,
    author: "Sarah Jenkins",
    role: "Architect",
    avatar: "SJ",
    title: "Best practices for sustainable residential design in tropical climates?",
    content: "I'm working on a project in Mombasa and looking for advice on passive cooling techniques...",
    likes: 24,
    comments: 8,
    tags: ["Sustainability", "Residential", "Tropical"]
  },
  {
    id: 2,
    author: "David Kimani",
    role: "Structural Engineer",
    avatar: "DK",
    title: "Recommendations for structural analysis software for high-rise buildings",
    content: "Comparing ETABS vs SAP2000 for a 15-story mixed-use development. Thoughts?",
    likes: 15,
    comments: 12,
    tags: ["Engineering", "Software", "High-rise"]
  },
  {
    id: 3,
    author: "Elena Rodriguez",
    role: "Interior Designer",
    avatar: "ER",
    title: "Sourcing local materials for luxury interiors",
    content: "Does anyone have contacts for high-quality local timber suppliers?",
    likes: 32,
    comments: 5,
    tags: ["Interiors", "Materials", "Sourcing"]
  }
];

const events = [
  {
    title: "Nairobi Architecture Expo 2024",
    date: "Aug 15-17, 2024",
    location: "KICC, Nairobi",
    type: "Conference"
  },
  {
    title: "Sustainable Design Workshop",
    date: "Sep 05, 2024",
    location: "Virtual",
    type: "Webinar"
  }
];

const ProfessionalCommunity: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Community Hub</h1>
          <p className="text-text-secondary text-lg">
            Connect, collaborate, and grow with fellow professionals. Join discussions, attend events, and expand your network.
          </p>
        </div>
        <Button className="bg-accent text-background hover:bg-accent/90 shadow-glow shrink-0">
          Start Discussion
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10 bg-surface/50 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search discussions, topics, or people..." 
                className="w-full bg-background/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-accent outline-none transition-all"
              />
            </div>
            <select className="bg-background/50 border border-white/10 rounded-lg px-4 text-text-secondary focus:border-accent outline-none">
              <option>Latest</option>
              <option>Top</option>
              <option>Unanswered</option>
            </select>
          </div>

          {discussions.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                    {post.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{post.author}</h3>
                    <p className="text-xs text-text-secondary">{post.role}</p>
                  </div>
                </div>
                <button className="text-text-secondary hover:text-white">
                  <Share2 size={18} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mb-2 hover:text-accent cursor-pointer transition-colors">
                {post.title}
              </h2>
              <p className="text-text-secondary mb-4 line-clamp-2">
                {post.content}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/5 text-text-secondary px-2 py-1 rounded-full border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button className="flex items-center gap-2 text-text-secondary hover:text-red-400 transition-colors">
                  <Heart size={18} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-text-secondary hover:text-blue-400 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm">{post.comments} Comments</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="text-accent" size={20} />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {events.map((event, i) => (
                <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="bg-white/5 rounded-lg p-2 text-center min-w-[60px]">
                    <span className="block text-xs text-text-secondary uppercase">{event.date.split(' ')[0]}</span>
                    <span className="block text-lg font-bold text-white">{event.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm hover:text-accent cursor-pointer transition-colors">{event.title}</h4>
                    <p className="text-xs text-text-secondary mt-1">{event.location}</p>
                    <span className="inline-block mt-2 text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-sm">View Calendar</Button>
          </div>

          {/* Top Contributors */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="text-accent" size={20} />
              Top Contributors
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-white/10 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-white/5 rounded"></div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 px-2 text-xs">Follow</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCommunity;
