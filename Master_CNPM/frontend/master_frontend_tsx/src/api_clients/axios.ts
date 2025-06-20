import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    // withCredentials: true, // Bỏ comment nếu dùng cookie
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Debug token
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Request config:', {
                url: config.url,
                method: config.method,
                headers: config.headers
            }); // Debug full request config
        } else {
            console.warn('No token found in localStorage'); // Warning if no token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance; 