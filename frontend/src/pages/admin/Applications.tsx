import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, AlertTriangle, FileText } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/admin/applications?status=pending');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await api.post(`/admin/applications/${id}/approve`);
      alert(res.data.message);
      fetchApplications();
      setSelectedApp(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await api.post(`/admin/applications/${id}/reject`);
      alert(res.data.message);
      fetchApplications();
      setSelectedApp(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Application Review</h1>
        <p className="text-text-secondary">Review and approve professional applications. Two approvals required.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4">
          {applications.length === 0 && !isLoading && (
            <div className="text-text-secondary text-center py-8">No pending applications.</div>
          )}
          
          {applications.map((app) => (
            <div 
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedApp?.id === app.id 
                  ? 'bg-accent/10 border-accent' 
                  : 'bg-surface border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{app.full_name}</h3>
                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">Pending</span>
              </div>
              <p className="text-sm text-text-secondary">{app.role_name || app.custom_role_name}</p>
              <div className="flex gap-2 mt-3 text-xs">
                <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded">
                  {app.approved_by?.length || 0}/2 Approvals
                </span>
                <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded">
                  {app.rejected_by?.length || 0}/2 Rejections
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-8 rounded-2xl border border-white/10 bg-surface/50"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedApp.full_name}</h2>
                  <p className="text-text-secondary">{selectedApp.email} • {selectedApp.phone_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary mb-1">Applied for</p>
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    {selectedApp.role_name || selectedApp.custom_role_name}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Experience</h4>
                  <p className="text-text-secondary mb-4">{selectedApp.bio}</p>
                  <div className="flex items-center gap-2 text-white">
                    <Briefcase size={16} className="text-accent" />
                    <span>{selectedApp.experience_years} Years Experience</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Documents</h4>
                  <div className="space-y-3">
                    <a href={selectedApp.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                      <Eye size={18} /> View Portfolio
                    </a>
                    <a href={selectedApp.cv_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                      <FileText size={18} /> View CV
                    </a>
                    <a href={selectedApp.id_document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                      <AlertTriangle size={18} /> View ID Document
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 flex gap-4">
                <Button 
                  onClick={() => handleApprove(selectedApp.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white border-none"
                >
                  <Check size={18} className="mr-2" />
                  Approve Application ({selectedApp.approved_by?.length || 0}/2)
                </Button>
                <Button 
                  onClick={() => handleReject(selectedApp.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none"
                >
                  <X size={18} className="mr-2" />
                  Reject Application ({selectedApp.rejected_by?.length || 0}/2)
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-text-secondary border border-dashed border-white/10 rounded-2xl min-h-[400px]">
              Select an application to review details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const Briefcase = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export default AdminApplications;
