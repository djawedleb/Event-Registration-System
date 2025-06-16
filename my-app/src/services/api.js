import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',  // Use environment variable
    // Remove the default Content-Type header to allow browser to set it for FormData
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }
    
    console.log('Making request to:', config.url, {
        method: config.method,
        data: config.data,
        headers: config.headers,
        token: token ? 'exists' : 'missing'
    });
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use((response) => {
    console.log('Response from:', response.config.url, {
        status: response.status,
        data: response.data
    });
    return response;
}, (error) => {
    console.error('Response error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
    });
    return Promise.reject(error);
});

// Helper function to create FormData
const createFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    return formData;
};

// API calls
export const authAPI = {
    // Auth
    login: async (data) => {
        try {
            const response = await api.post('/users/Login', data);
            console.log('Login response:', response.data);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    register: async (data) => {
        try {
            const response = await api.post('/users/Register', data);
            console.log('Register response:', response.data);
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }
};

export const eventAPI = {
    // Events
    getEvents: () => api.get('/events/GetEvents'),
    getEvent: (id) => api.get(`/events/GetEventById/${id}`),
    registerForEvent: (eventId) => api.post('/registrations/Register', { eventId }),
    checkRegistration: (eventId) => api.get(`/registrations/check/${eventId}`),
    getMyRegistrations: () => api.get('/registrations/Registrations'),
    cancelRegistration: (registrationId) => api.delete(`/registrations/Registrations/${registrationId}`),
    
    // Organizer specific endpoints
    getMyEvents: () => api.get('/events/GetMyEvents'),
    createEvent: (formData) => {
        return api.post('/events/CreateEvent', formData);
    },
    updateEvent: (eventId, formData) => {
        return api.put(`/events/UpdateEvent/${eventId}`, formData);
    },
    deleteEvent: (eventId) => api.delete(`/events/DeleteEvent/${eventId}`),
    getEventParticipants: (eventId) => api.get(`/events/GetEventParticipants/${eventId}`),
};

export const userAPI = {
    // User
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    deleteAccount: () => api.delete('/users/profile'),
};

export default api;
