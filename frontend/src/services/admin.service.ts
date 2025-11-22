import api from './api';

export const getArchitectApplications = async () => {
  const response = await api.get('/admin/applications');
  return response.data;
};

export const approveArchitect = async (userId: number, status: 'approved' | 'rejected') => {
  const response = await api.put(`/admin/applications/${userId}`, { status });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getAllDesigns = async () => {
  const response = await api.get('/admin/designs');
  return response.data;
};
