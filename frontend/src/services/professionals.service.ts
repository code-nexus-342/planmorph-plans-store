import api from './api';

export const getProfessionalRoles = async () => {
  const response = await api.get('/professionals/roles');
  return response.data;
};

export const applyAsProfessional = async (data: any) => {
  const response = await api.post('/professionals/apply', data);
  return response.data;
};

export const loginAsProfessional = async (credentials: any) => {
  const response = await api.post('/professionals/login', credentials);
  return response.data;
};

export const getProfessionalDashboardStats = async () => {
  const response = await api.get('/professionals/dashboard');
  return response.data;
};
