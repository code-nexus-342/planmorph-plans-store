import React, { useEffect, useState } from 'react';
import { Users, FileText, Briefcase, DollarSign, TrendingUp, Activity, UserCheck, Building2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import adminService from '../../services/admin.service';

interface AnalyticsData {
  overview: {
    users: {
      total_users: number;
      clients: number;
      architects: number;
      finance_managers: number;
      hr_managers: number;
      civil_engineers: number;
      surveyors: number;
      new_users_30d: number;
    };
    designs: {
      total_designs: number;
      published_designs: number;
      draft_designs: number;
      new_designs_30d: number;
    };
    applications: {
      total_applications: number;
      pending_applications: number;
      approved_applications: number;
      rejected_applications: number;
    };
    revenue: {
      total_purchases: number;
      total_revenue: number;
      revenue_30d: number;
    };
    activities: {
      total_activities: number;
      activities_7d: number;
    };
  };
  trends: {
    userGrowth: Array<{ month: string; count: number }>;
    applicationTrends: Array<{ month: string; count: number; status: string }>;
  };
  recentActivities: Array<{
    id: number;
    activity_type: string;
    description: string;
    created_at: string;
    user_name: string;
    user_email: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await adminService.getAnalytics();
        setAnalytics(response.data);
      } catch (err: any) {
        console.error('Failed to fetch analytics', err);
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/20">
        <p className="text-red-600 dark:text-red-400">{error || 'Failed to load analytics'}</p>
      </div>
    );
  }

  const { overview } = analytics;
  const totalProfessionals = 
    overview.users.architects + 
    overview.users.finance_managers + 
    overview.users.hr_managers + 
    overview.users.civil_engineers + 
    overview.users.surveyors;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Comprehensive overview of system performance and metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={overview.users.total_users}
          icon={Users}
          color="blue"
          subtitle={`${overview.users.new_users_30d} new this month`}
        />
        <StatCard
          title="Total Designs"
          value={overview.designs.total_designs}
          icon={FileText}
          color="green"
          subtitle={`${overview.designs.published_designs} published`}
        />
        <StatCard
          title="Pending Applications"
          value={overview.applications.pending_applications}
          icon={Briefcase}
          color="orange"
          subtitle={`${overview.applications.total_applications} total`}
        />
        <StatCard
          title="Total Revenue"
          value={`$${Number(overview.revenue.total_revenue).toLocaleString()}`}
          icon={DollarSign}
          color="purple"
          subtitle={`$${Number(overview.revenue.revenue_30d).toLocaleString()} this month`}
        />
      </div>

      {/* Professional Breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Professional Breakdown
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Architects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.users.architects}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Finance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.users.finance_managers}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <UserCheck className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">HR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.users.hr_managers}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Engineers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.users.civil_engineers}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <Activity className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Surveyors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.users.surveyors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {analytics.recentActivities.length > 0 ? (
            analytics.recentActivities.slice(0, 10).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.user_name || activity.user_email} • {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {activity.activity_type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Design Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Published</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {overview.designs.published_designs}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Draft</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {overview.designs.draft_designs}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">New (30d)</span>
              <span className="text-sm font-semibold text-green-600">
                {overview.designs.new_designs_30d}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Applications
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <span className="text-sm font-semibold text-orange-600">
                {overview.applications.pending_applications}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
              <span className="text-sm font-semibold text-green-600">
                {overview.applications.approved_applications}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
              <span className="text-sm font-semibold text-red-600">
                {overview.applications.rejected_applications}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Professionals</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {totalProfessionals}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {overview.revenue.total_purchases}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Activities (7d)</span>
              <span className="text-sm font-semibold text-blue-600">
                {overview.activities.activities_7d}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
