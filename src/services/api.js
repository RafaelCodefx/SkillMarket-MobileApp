import axios from 'axios';

// Defina a URL do seu backend
//
const API_BASE_URL = 'https://backend-skillmarket.onrender.com/api';
//const API_BASE_URL = 'http://192.168.1.8:8000/api'
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
