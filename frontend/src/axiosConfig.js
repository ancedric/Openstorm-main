// axiosConfig.js (Adapté pour JWT)

import axios from 'axios';

export const baseURL = 'https://openstorm.onrender.com';
export const port = 8082;

const instance = axios.create({
    baseURL: baseURL, 
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;