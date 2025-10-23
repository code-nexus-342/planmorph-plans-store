"use client";
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Star, 
  Download, 
  DollarSign,
  Shield,
  Settings,
  AlertTriangle,
  UserCheck,
  Activity,
  Database,
  Server,
  Globe,
  Eye,
  MessageSquare,
  CreditCard,
  Package,
  Building,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';
import LoadingSpinner from '../LoadingSpinner';

interface AdminStats {
  total_users: number;
  total_plans: number;
  total_revenue: number;
  total_sales: number;
  active_users: number;
  pending_reviews: number;
  monthly_revenue: number;
  monthly_users: number;
  system_health: 'healthy' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'plan_upload' | 'purchase' | 'review' | 'system';
  description: string;
  user_name?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error';
}

interface TopUser {
  id: string;
  name: string;
  email: string;
  role: string;
  total_purchases: number;
  total_spent: number;
  join_date: string;
}

//Admin dashboard
export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes, usersRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/activity/recent'),
        apiClient.get('/admin/users/top-customers')
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data as AdminStats);
      }
      if (activityRes.success && Array.isArray(activityRes.data)) {
        setRecentActivity(activityRes.data);
      }
      if (usersRes.success && Array.isArray(usersRes.data)) {
        setTopUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'plan_upload':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'purchase':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'review':
        return <MessageSquare className="w-4 h-4 text-yellow-600" />;
      case 'system':
        return <Server className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">System Administration & Analytics</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(stats?.system_health || 'healthy')}`}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
                <span>System {stats?.system_health || 'Unknown'}</span>
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>System Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'content', name: 'Content', icon: FileText },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'system', name: 'System', icon: Server },
              { id: 'security', name: 'Security', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_users?.toLocaleString() || 0}</p>
                    <p className="text-xs text-green-600">+{stats?.monthly_users || 0} this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats?.total_revenue?.toLocaleString() || 0}</p>
                    <p className="text-xs text-green-600">+${stats?.monthly_revenue?.toLocaleString() || 0} this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Plans</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_plans?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500">{stats?.pending_reviews || 0} pending review</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.active_users?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500">Last 30 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {recentActivity.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          {activity.user_name && (
                            <p className="text-xs text-gray-500">by {activity.user_name}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {activity.severity && (
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            activity.severity === 'error' ? 'bg-red-500' :
                            activity.severity === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Customers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {topUsers.slice(0, 8).map((customer, index) => (
                    <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-500">
                              {customer.total_purchases} purchases
                            </span>
                            <span className="text-xs font-medium text-green-600">
                              ${customer.total_spent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            customer.role === 'architect' ? 'bg-purple-100 text-purple-800' :
                            customer.role === 'admin' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {customer.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        {stats?.pending_reviews || 0} plans pending review
                      </p>
                      <p className="text-xs text-yellow-600">
                        Review queue requires attention
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Database className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Database performance is optimal
                      </p>
                      <p className="text-xs text-green-600">
                        All systems running smoothly
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">
              Advanced {activeTab} management tools are under development.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
