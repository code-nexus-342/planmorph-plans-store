import api from './api';

export const adminService = {
  // Legacy endpoints
  getArchitectApplications: () => api.get('/admin/applications'),
  approveArchitectApplication: (id: number, status: 'approved' | 'rejected') =>
    api.put(`/admin/applications/${id}`, { status }),
  getUsers: () => api.get('/admin/users'),
  getDesigns: () => api.get('/admin/designs'),

  // New analytics endpoint
  getAnalytics: () => api.get('/admin/analytics'),

  // Professional management
  getProfessionals: () => api.get('/admin/professionals'),

  // Job role management
  getJobRoles: () => api.get('/admin/job-roles'),
  createJobRole: (data: any) => api.post('/admin/job-roles', data),
  updateJobRole: (id: number, data: any) => api.put(`/admin/job-roles/${id}`, data),
  deleteJobRole: (id: number) => api.delete(`/admin/job-roles/${id}`),

  // Role application management
  getRoleApplications: (params?: { status?: string; role_id?: number }) =>
    api.get('/admin/role-applications', { params }),
  approveRoleApplication: (id: number, review_notes?: string) =>
    api.put(`/admin/role-applications/${id}/approve`, { review_notes }),
  rejectRoleApplication: (id: number, review_notes?: string) =>
    api.put(`/admin/role-applications/${id}/reject`, { review_notes }),
};

export default adminService;
