import api from './api';

export const rolesService = {
  // Public endpoints
  getPublicJobRoles: () => api.get('/roles/public/job-roles'),
  getJobRole: (id: number) => api.get(`/roles/public/job-roles/${id}`),
  submitApplication: (data: any) => api.post('/roles/applications', data),
};

export default rolesService;
