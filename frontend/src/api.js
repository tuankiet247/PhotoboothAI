import axios from 'axios';

// Auto-detect environment:
// - Development (local): use localhost:8000
// - Production (deployed): use VITE_API_URL env var or fallback to Render URL
const isDev = import.meta.env.DEV;
export const API_BASE_URL = isDev 
  ? 'http://localhost:8000'
  : (import.meta.env.VITE_API_URL || 'https://photoboothai.onrender.com');

console.log(`[API] Environment: ${isDev ? 'Development' : 'Production'}, URL: ${API_BASE_URL}`);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  timeout: 180000, // 3 minutes timeout for AI processing
});

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Cache-Control': 'no-cache',
    },
  });

  return response.data;
};

export const getProcessedImage = (imageId) => `${API_BASE_URL}/api/image/${imageId}/processed?t=${Date.now()}`;
export const getQRCode = (imageId) => `${API_BASE_URL}/api/image/${imageId}/qr?t=${Date.now()}`;
export const getDownloadUrl = (imageId) => `${API_BASE_URL}/api/download/${imageId}`;

export const getGallery = async () => {
  const response = await api.get('/api/gallery', {
    params: { t: Date.now() }, // Cache bust
    headers: { 'Cache-Control': 'no-cache' }
  });
  return response.data;
};
