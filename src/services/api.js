import axios from 'axios';

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

  if (configuredUrl) {
    try {
      const apiUrl = new URL(configuredUrl);
      const pageHostname = window.location.hostname;
      const isLocalApiHost = apiUrl.hostname === 'localhost' || apiUrl.hostname === '127.0.0.1';
      const isLocalPageHost = pageHostname === 'localhost' || pageHostname === '127.0.0.1';

      if (import.meta.env.DEV && isLocalApiHost && !isLocalPageHost) {
        apiUrl.hostname = pageHostname;
        return apiUrl.toString().replace(/\/$/, '');
      }
    } catch {
      return configuredUrl;
    }

    return configuredUrl;
  }

  if (import.meta.env.DEV) {
    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
  }

  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthHandshake = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/me');
      const isAdminArea = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

      if (!isAuthHandshake && isAdminArea) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getAllAdmin: (params) => api.get('/products/admin/all', { params }),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`),
};

// Blog API
export const blogAPI = {
  getAll: (params) => api.get('/blog', { params }),
  getById: (id) => api.get(`/blog/${id}`),
  getAllAdmin: (params) => api.get('/blog/admin/all', { params }),
  create: (formData) => api.post('/blog', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/blog/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/blog/${id}`),
};

// Contacts API
export const contactsAPI = {
  create: (data) => publicApi.post('/contacts', data),
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  updateStatus: (id, status) => api.patch(`/contacts/${id}/status`, { status }),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (data) => publicApi.post('/newsletter', data),
  getAll: (params) => api.get('/newsletter', { params }),
};

// Purchases API
export const purchasesAPI = {
  create: (data) => api.post('/purchases', data),
  getByTransactionId: (transactionId) => api.get(`/purchases/transaction/${transactionId}`),
  trackDownload: (transactionId) => api.post(`/purchases/download/${transactionId}`),
  getAll: (params) => api.get('/purchases', { params }),
  updateStatus: (id, status) => api.patch(`/purchases/${id}/status`, { paymentStatus: status }),
};

// Shop API
export const shopAPI = {
  getState: () => api.get('/shop'),
  saveCart: (items) => api.put('/shop/cart', { items }),
  saveFavorites: (items) => api.put('/shop/favorites', { items }),
  updateFavoriteStatus: (productId, status, slug) => {
    return api.post('/favorites-update-status', {
      slug,
      isFavorite: status,
      productId,
      status,
    });
  },
  addFavorite: (productId, slug) => shopAPI.updateFavoriteStatus(productId, true, slug), // Pass slug
  removeFavorite: (productId, slug) => shopAPI.updateFavoriteStatus(productId, false, slug), // Pass slug
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
