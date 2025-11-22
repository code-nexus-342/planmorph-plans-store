import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/architect/dashboard');
  return response.data;
};

export const getMyDesigns = async () => {
  const response = await api.get('/architect/designs');
  return response.data;
};

export const createDesign = async (designData: any) => {
  const response = await api.post('/architect/designs', designData);
  return response.data;
};

export const getUploadUrl = async (fileData: any) => {
  const response = await api.post('/architect/upload-url', fileData);
  return response.data;
};

export const addDesignMedia = async (mediaData: any) => {
  const response = await api.post('/architect/media', mediaData);
  return response.data;
};

export const uploadToSpace = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  return response;
};
