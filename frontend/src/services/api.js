import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE });

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginAdmin = (data) => api.post('/admin/login', data);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Menu Items
export const getMenuItems = (params) => api.get('/menu-items', { params });
export const getMenuItem = (id) => api.get(`/menu-items/${id}`);
export const createMenuItem = (data) => api.post('/menu-items', data);   // FormData
export const updateMenuItem = (id, data) => api.put(`/menu-items/${id}`, data); // FormData
export const deleteMenuItem = (id) => api.delete(`/menu-items/${id}`);

// Orders
export const placeOrder = (data) => api.post('/orders', data);
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });
export const getOrderStats = () => api.get('/orders/stats');
export const getDailyRevenue = () => api.get('/orders/revenue/daily');

// Tables
export const getTables = () => api.get('/tables');
export const createTable = (data) => api.post('/tables', data);
export const updateTable = (id, data) => api.put(`/tables/${id}`, data);
export const deleteTable = (id) => api.delete(`/tables/${id}`);

export default api;