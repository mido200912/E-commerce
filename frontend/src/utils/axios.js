import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://shop-rahhalah.vercel.app'
        : '', // Empty string for dev to use Proxy
    withCredentials: true
});

export default instance;
