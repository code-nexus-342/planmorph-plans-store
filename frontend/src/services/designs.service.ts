import api from './api';

export const getDesigns = async (params?: any) => {
  const response = await api.get('/designs', { params });
  return response.data;
};

export const getDesignById = async (id: string) => {
  const response = await api.get(`/designs/${id}`);
  return response.data;
};

export const createDesign = async (designData: FormData) => {
  const response = await api.post('/designs', designData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
