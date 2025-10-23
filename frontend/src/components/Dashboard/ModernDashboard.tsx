"use client";
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  ShoppingBag,
  Download,
  Heart,
  Settings,
  User,
  TrendingUp,
  Activity,
  Package,
  CreditCard,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';
import LoadingSpinner from '../LoadingSpinner';

// Tab Components
import OverviewTab from './tabs/OverviewTab';
import PurchasesTab from './tabs/PurchasesTab';
import DownloadsTab from './tabs/DownloadsTab';
import FavoritesTab from './tabs/FavoritesTab';
import SettingsTab from './tabs/SettingsTab';

type TabType = 'overview' | 'purchases' | 'downloads' | 'favorites' | 'settings';

interface DashboardStats {
  totalPurchases: number;
  totalSpent: number;
  favoritePlans: number;
  downloadsAvailable: number;
}

export default function ModernDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<DashboardStats>('/users/dashboard-stats');
      
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default stats on error so dashboard still works
      setStats({
        totalPurchases: 0,
        totalSpent: 0,
        favoritePlans: 0,
        downloadsAvailable: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'purchases' as TabType, label: 'My Purchases', icon: ShoppingBag },
    { id: 'downloads' as TabType, label: 'Downloads', icon: Download },
    { id: 'favorites' as TabType, label: 'Favorites', icon: Heart },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const statCards = [
    { 
      label: 'Total Purchases', 
      value: stats?.totalPurchases || 0, 
      icon: Package,
      gradient: 'from-cyan-500 to-blue-500',
      bg: 'from-cyan-500/10 to-blue-500/10'
    },
    { 
      label: 'Total Spent', 
      value: `$${(stats?.totalSpent || 0).toLocaleString()}`, 
      icon: CreditCard,
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-500/10 to-pink-500/10'
    },
    { 
      label: 'Favorites', 
      value: stats?.favoritePlans || 0, 
      icon: Heart,
      gradient: 'from-rose-500 to-orange-500',
      bg: 'from-rose-500/10 to-orange-500/10'
    },
    { 
      label: 'Downloads Available', 
      value: stats?.downloadsAvailable || 0, 
      icon: Download,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'from-emerald-500/10 to-teal-500/10'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 sm:pb-0">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 truncate max-w-[150px] sm:max-w-none">
                  Welcome back, {user?.first_name}!
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-xs sm:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">{statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-400 opacity-50" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:sticky lg:top-24">
              <nav className="space-y-1.5 sm:space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-left transition-all duration-300 group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-white shadow-lg shadow-cyan-500/20'
                          : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`} />
                      <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* User Profile Card */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-gray-500">Role</span>
                  <span className="px-2 py-0.5 sm:py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-medium capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[400px] sm:min-h-[600px]">
              {activeTab === 'overview' && <OverviewTab stats={stats} />}
              {activeTab === 'purchases' && <PurchasesTab />}
              {activeTab === 'downloads' && <DownloadsTab />}
              {activeTab === 'favorites' && <FavoritesTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
