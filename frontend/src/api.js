import axios from 'axios';

// Use environment variable or fallback to the production Render backend or localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tet-ai-photobooth-1.onrender.com' || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getProcessedImage = (imageId) => {
  return `${API_BASE_URL}/api/image/${imageId}/processed`;
};

export const getQRCode = (imageId) => {
  return `${API_BASE_URL}/api/image/${imageId}/qr`;
};

export const getDownloadUrl = (imageId) => {
  return `${API_BASE_URL}/api/download/${imageId}`;
};

export const getGallery = async () => {
  const response = await api.get('/api/gallery');
  return response.data;
};
