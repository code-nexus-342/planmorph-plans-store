import api from './api';

export const login = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const registerArchitect = async (profileData: any) => {
    const response = await api.post('/auth/architect/apply', profileData);
    return response.data;
}
