import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',  // Your backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API calls
export const authAPI = {
    // Auth
    login: (data) => api.post('/users/Login', data),
    register: (data) => api.post('/users/Register', data),
};

export const eventAPI = {
    // Events
    getEvents: () => api.get('/events/GetEvents'),
    getEvent: (id) => api.get(`/events/GetEventById/${id}`),
    registerForEvent: (eventId) => api.post('/registrations/Register', { eventId }),
    checkRegistration: (eventId) => api.get(`/registrations/check/${eventId}`),
    getMyRegistrations: () => api.get('/registrations/Registrations'),
    cancelRegistration: (registrationId) => api.delete(`/registrations/Registrations/${registrationId}`),
};
export const userAPI = {
    // User
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    deleteAccount: () => api.delete('/users/profile'),
};

export default api;
