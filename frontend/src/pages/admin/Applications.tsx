import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/admin/applications/${id}`, { status });
      fetchApplications(); // Refresh list
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Architect Applications</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 font-medium text-gray-500">Experience</th>
              <th className="px-6 py-3 font-medium text-gray-500">Portfolio</th>
              <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {applications.map((app) => (
              <tr key={app.user_id}>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{app.full_name}</td>
                <td className="px-6 py-4 text-gray-500">{app.email}</td>
                <td className="px-6 py-4 text-gray-500">{app.experience_years} years</td>
                <td className="px-6 py-4 text-gray-500">
                    <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleStatusUpdate(app.user_id, 'approved')}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(app.user_id, 'rejected')}>Reject</Button>
                  </div>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No pending applications.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
