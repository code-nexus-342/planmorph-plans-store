import api from './api';

export const createPurchase = async (designId: number) => {
  const response = await api.post('/purchases', { designId });
  return response.data;
};

export const getMyPurchases = async () => {
  const response = await api.get('/purchases/my-purchases');
  return response.data;
};

export const getDesignFiles = async (designId: number) => {
  const response = await api.get(`/purchases/files/${designId}`);
  return response.data;
};
