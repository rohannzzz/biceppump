import axios from 'axios';
import { API_BASE_URL } from './api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// API methods
export const api = {
    // Auth
    auth: {
        signup: (data) => apiClient.post('/api/auth/signup', data),
        login: (data) => apiClient.post('/api/auth/login', data),
        logout: () => apiClient.post('/api/auth/logout'),
        getProfile: () => apiClient.get('/api/auth/profile'),
        updateProfile: (data) => apiClient.put('/api/auth/profile', data)
    },

    // Workouts
    workouts: {
        getAll: (params) => apiClient.get('/api/workouts', { params }),
        getById: (id) => apiClient.get(`/api/workouts/${id}`),
        create: (data) => apiClient.post('/api/workouts', data),
        update: (id, data) => apiClient.put(`/api/workouts/${id}`, data),
        delete: (id) => apiClient.delete(`/api/workouts/${id}`)
    },

    // Exercises
    exercises: {
        create: (data) => apiClient.post('/api/exercises', data),
        update: (id, data) => apiClient.put(`/api/exercises/${id}`, data),
        delete: (id) => apiClient.delete(`/api/exercises/${id}`)
    },

    // Analytics
    analytics: {
        getProgress: (params) => apiClient.get('/api/analytics/progress', { params }),
        getPumpScore: () => apiClient.get('/api/analytics/pump-score'),
        getPRs: () => apiClient.get('/api/analytics/prs')
    },

    // Leaderboard
    leaderboard: {
        get: (params) => apiClient.get('/api/leaderboard', { params })
    }
};

export default apiClient;
