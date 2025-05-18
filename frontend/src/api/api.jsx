import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // Coba tambahkan ini
    }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  if (token) {
    console.log('token ada')
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

