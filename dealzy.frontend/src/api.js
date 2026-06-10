import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5176/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve());
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
        if (original.url?.includes('/auth/refresh') || original.url?.includes('/auth/logout')) return Promise.reject(error);

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(original));
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const { data } = await api.post('/auth/refresh', {}, { withCredentials: true });
            localStorage.setItem('token', data.token);
            original.headers.Authorization = `Bearer ${data.token}`;
            processQueue(null);
            window.dispatchEvent(new CustomEvent('auth:tokenRefreshed', { detail: { token: data.token } }));
            return api(original);
        } catch (refreshError) {
            const latestToken = localStorage.getItem('token');
            const originalToken = error.config.headers?.Authorization?.replace('Bearer ', '');
            if (latestToken && latestToken !== originalToken) {
                original.headers.Authorization = `Bearer ${latestToken}`;
                processQueue(null);
                isRefreshing = false;
                return api(original);
            }
            processQueue(refreshError);
            localStorage.removeItem('token');
            window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export const authService = {
    register: (name, email, password) =>
        api.post('/auth/register', { name, email, password }),

    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    refresh: () =>
        api.post('/auth/refresh', {}, { withCredentials: true }),

    logout: () =>
        api.post('/auth/logout', {}, { withCredentials: true }),
};

export default api;
