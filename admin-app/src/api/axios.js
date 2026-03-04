import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo development with physical device, you need your computer's local IP
// Replace this with your actual local IP (e.g., http://192.168.1.something:3000)
// or your production backend URL.
const baseURL = 'https://rahhalah-back.vercel.app'; // Defaulting to production-like or update to local IP

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(
    async (config) => {
        try {
            // You can also change the base URL dynamically if user inputs it
            const customURL = await AsyncStorage.getItem('custom_api_url');
            if (customURL) {
                config.baseURL = customURL;
            }

            const token = await AsyncStorage.getItem('adminToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error(e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    async (response) => {
        if (response.data?.token) {
            await AsyncStorage.setItem('adminToken', response.data.token);
        }
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('adminToken');
        }
        return Promise.reject(error);
    }
);

export default instance;
