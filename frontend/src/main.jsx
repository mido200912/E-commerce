import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'
import './index.css'

// Configure Axios based on environment
if (import.meta.env.PROD) {
  // Production: Use direct backend URL
  axios.defaults.baseURL = 'https://shop-rahhalah.vercel.app';
} else {
  // Development: Use Vite Proxy (relative path) to avoid CORS
  // No baseURL set, so it defaults to same origin /api/...
}

// Enable credentials for cookies
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


