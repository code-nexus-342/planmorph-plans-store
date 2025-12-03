import api from './api';

export const login = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const verifyEmail = async (data: { email: string; code: string }) => {
  const response = await api.post('/auth/verify-email', data);
  return response.data;
};

export const resendVerification = async (email: string) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

export const registerArchitect = async (profileData: any) => {
    const response = await api.post('/architect/apply', profileData);
    return response.data;
}
