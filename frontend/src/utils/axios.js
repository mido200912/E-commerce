import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
    baseURL: 'https://shop-rahhalah.vercel.app', // Hardcoded to ensure it works
    withCredentials: true
});

export default instance;
