import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ArchitectDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalSales: 0,
    views: 0
  });
  const [recentDesigns, setRecentDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/architect/dashboard');
        setStats(statsRes.data);

        const designsRes = await api.get('/architect/designs');
        setRecentDesigns(designsRes.data.slice(0, 5)); // Get top 5
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="text-sm font-medium text-gray-500">Total Designs</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalDesigns}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="text-sm font-medium text-gray-500">Total Sales</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSales}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="text-sm font-medium text-gray-500">Total Views</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.views}</div>
        </div>
      </div>

      {/* Recent Designs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Designs</h2>
          <Link to="/architect/upload">
            <Button size="sm">Upload New</Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Title</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentDesigns.map((design) => (
                <tr key={design.id}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{design.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      design.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {design.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">${design.price}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(design.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentDesigns.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No designs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArchitectDashboard;
