import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
    baseURL: import.meta.env.PROD
        ? import.meta.env.VITE_API_URL || ''
        : '', // Empty string for dev to use Vite Proxy
    withCredentials: true
});

export default instance;
