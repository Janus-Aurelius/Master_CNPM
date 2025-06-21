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
        console.log('🔍 [Axios Request Debug]');
        console.log('  Token from localStorage:', token);
        console.log('  Original URL:', config.url);
        console.log('  Original params:', config.params);
        console.log('  Original query string:', config.url?.includes('?') ? config.url.split('?')[1] : 'none');
        
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('No token found in localStorage');
        }

        // Check if any auto-injection of user params is happening
        console.log('  Final config before send:', {
            url: config.url,
            method: config.method,
            params: config.params,
            headers: config.headers
        });
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;