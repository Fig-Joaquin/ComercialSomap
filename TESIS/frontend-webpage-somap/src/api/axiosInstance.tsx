import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  withCredentials: false, // Cambiar a true si necesitas autenticación basada en cookies
});

// Interceptor de solicitudes
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Obtener token de localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la solicitud:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
