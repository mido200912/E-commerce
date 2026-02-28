import axios from 'axios';

// Determine the API base URL
// In development: empty string (uses Vite proxy)
// In production: use the VITE_API_URL environment variable
const baseURL = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || '')
    : '';

// Create an Axios instance
const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - attach token from localStorage as fallback
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - save token from login responses
instance.interceptors.response.use(
    (response) => {
        // If the response contains a token (like from login), store it
        if (response.data?.token) {
            localStorage.setItem('adminToken', response.data.token);
        }
        return response;
    },
    (error) => {
        // If we get a 401, clear stored token
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
        }
        return Promise.reject(error);
    }
);

export default instance;
