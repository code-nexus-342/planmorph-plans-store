import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const updateSettings = async (settings: any) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/settings`, { settings }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getSettings = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/settings`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
