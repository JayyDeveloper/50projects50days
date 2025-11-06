import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// Wallpaper endpoints
export const wallpaperAPI = {
  getAll: (params) => api.get('/wallpapers', { params }),
  getOne: (slug) => api.get(`/wallpapers/${slug}`),
  getFeatured: () => api.get('/wallpapers/featured'),
  download: (id, licenseType) => api.post(`/wallpapers/${id}/download`, { licenseType }),
  toggleFavorite: (id) => api.post(`/wallpapers/${id}/favorite`),
  create: (data) => api.post('/wallpapers', data),
  update: (id, data) => api.put(`/wallpapers/${id}`, data),
  delete: (id) => api.delete(`/wallpapers/${id}`),
};

// Category endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getOne: (slug) => api.get(`/categories/${slug}`),
};

// Subscription endpoints
export const subscriptionAPI = {
  getPlans: () => api.get('/subscriptions/plans'),
  getStatus: () => api.get('/subscriptions/status'),
  createCheckout: (plan) => api.post('/subscriptions/create-checkout', { plan }),
  cancel: () => api.post('/subscriptions/cancel'),
  resume: () => api.post('/subscriptions/resume'),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPendingWallpapers: (params) => api.get('/admin/wallpapers/pending', { params }),
  approveWallpaper: (id) => api.put(`/admin/wallpapers/${id}/approve`),
  rejectWallpaper: (id, reason) => api.put(`/admin/wallpapers/${id}/reject`, { reason }),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export default api;
