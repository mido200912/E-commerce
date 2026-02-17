import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
    baseURL: import.meta.env.PROD ? 'https://shop-rahhalah.vercel.app' : '', // Use proxy in dev, direct URL in prod
    withCredentials: true
});

export default instance;
