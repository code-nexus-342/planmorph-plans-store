import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    designs: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we'd have a dedicated stats endpoint
        // For now, let's fetch lists and count
        const usersRes = await api.get('/admin/users');
        const designsRes = await api.get('/admin/designs');
        const appsRes = await api.get('/admin/applications');

        setStats({
          users: usersRes.data.length,
          designs: designsRes.data.length,
          pendingApplications: appsRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="text-sm font-medium text-gray-500">Total Users</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.users}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="text-sm font-medium text-gray-500">Total Designs</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.designs}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="text-sm font-medium text-gray-500">Pending Applications</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingApplications}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
