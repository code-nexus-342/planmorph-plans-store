"use client";
import { useState, useEffect } from 'react';
import { Activity, Clock, Package, Heart, Download, TrendingUp } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import LoadingSpinner from '../../LoadingSpinner';

interface ActivityItem {
  id: string;
  type: 'purchase' | 'download' | 'favorite';
  title: string;
  description: string;
  timestamp: string;
}

interface OverviewTabProps {
  stats: {
    totalPurchases: number;
    totalSpent: number;
    favoritePlans: number;
    downloadsAvailable: number;
  } | null;
}

export default function OverviewTab({ stats }: OverviewTabProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<ActivityItem[]>('/users/recent-activity');
      
      if (response.success && response.data) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Package className="w-5 h-5 text-cyan-400" />;
      case 'download':
        return <Download className="w-5 h-5 text-purple-400" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-rose-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50';
      case 'download':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/50';
      case 'favorite':
        return 'from-rose-500/20 to-orange-500/20 border-rose-500/50';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          </div>
          <p className="text-gray-300 text-lg">
            Track your purchases, downloads, and favorite plans all in one place
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          </div>
          <Clock className="w-5 h-5 text-gray-500" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-white/10">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No activity yet</p>
            <p className="text-sm text-gray-500">Start exploring plans to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`relative group rounded-xl bg-gradient-to-r ${getActivityColor(activity.type)} border p-4 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium mb-1">{activity.title}</p>
                    <p className="text-sm text-gray-400 mb-2">{activity.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    activity.type === 'purchase' ? 'bg-cyan-500/20 text-cyan-400' :
                    activity.type === 'download' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {activity.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-4">
            <p className="text-sm text-gray-400 mb-2">Lifetime Spending</p>
            <p className="text-2xl font-bold text-white">${stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4">
            <p className="text-sm text-gray-400 mb-2">Total Plans Owned</p>
            <p className="text-2xl font-bold text-white">{stats.totalPurchases}</p>
          </div>
        </div>
      )}
    </div>
  );
}
