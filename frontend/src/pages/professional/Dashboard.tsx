import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Upload, FileText, DollarSign, Eye, TrendingUp, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getProfessionalDashboardStats } from '../../services/professionals.service';
import { useAuth } from '../../context/AuthContext';

const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalSales: 0,
    views: 0,
    role: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getProfessionalDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Dashboard</h1>
          <p className="text-text-secondary">Welcome back, {user?.full_name}</p>
        </div>
        <Link to="/professional/upload">
          <Button className="bg-accent text-background hover:bg-accent/90 shadow-glow">
            <Plus size={18} className="mr-2" />
            Upload New Design
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <FileText className="text-blue-400" size={20} />
            </div>
            <span className="text-xs font-medium text-text-secondary bg-white/5 px-2 py-1 rounded-full border border-white/5">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.totalDesigns}</h3>
          <p className="text-sm text-text-secondary">Uploaded Designs</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <DollarSign className="text-green-400" size={20} />
            </div>
            <span className="text-xs font-medium text-text-secondary bg-white/5 px-2 py-1 rounded-full border border-white/5">Revenue</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">KES {stats.totalSales.toLocaleString()}</h3>
          <p className="text-sm text-text-secondary">Total Earnings</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <Eye className="text-purple-400" size={20} />
            </div>
            <span className="text-xs font-medium text-text-secondary bg-white/5 px-2 py-1 rounded-full border border-white/5">Analytics</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.views}</h3>
          <p className="text-sm text-text-secondary">Total Views</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
              <TrendingUp className="text-orange-400" size={20} />
            </div>
            <span className="text-xs font-medium text-text-secondary bg-white/5 px-2 py-1 rounded-full border border-white/5">Status</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{stats.role || 'Professional'}</h3>
          <p className="text-sm text-text-secondary">Current Role</p>
        </motion.div>
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Uploads</h2>
            <Link to="/professional/designs" className="text-sm text-accent hover:text-accent/80">View All</Link>
          </div>
          <div className="text-center py-12 text-text-secondary">
            <p>No recent activity to display.</p>
            <Link to="/professional/upload" className="text-accent hover:underline mt-2 inline-block">Upload your first design</Link>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-surface/50">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/professional/upload">
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 text-left">
                <Upload size={16} className="mr-2" /> Upload Design
              </Button>
            </Link>
            <Link to="/professional/profile">
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5 text-left">
                <LayoutDashboard size={16} className="mr-2" /> Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
