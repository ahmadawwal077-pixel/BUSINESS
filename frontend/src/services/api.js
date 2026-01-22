import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

// Blog API
export const blogAPI = {
  getAllBlogs: (page = 1, limit = 10) =>
    apiClient.get(`/blogs?page=${page}&limit=${limit}`),
  getBlogBySlug: (slug) => apiClient.get(`/blogs/${slug}`),
  createBlog: (data) => apiClient.post('/blogs', data),
  updateBlog: (id, data) => apiClient.put(`/blogs/${id}`, data),
  deleteBlog: (id) => apiClient.delete(`/blogs/${id}`),
};

// Appointment API
export const appointmentAPI = {
  createAppointment: (data) => apiClient.post('/appointments', data),
  getUserAppointments: () => apiClient.get('/appointments/my-appointments'),
  getAllAppointments: () => apiClient.get('/appointments/all'),
  updateStatus: (id, data) => apiClient.put(`/appointments/${id}/status`, data),
  cancelAppointment: (id) => apiClient.put(`/appointments/${id}/cancel`),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (data) =>
    apiClient.post('/payments/create-intent', data),
  confirmPayment: (data) => apiClient.post('/payments/confirm', data),
  getUserPayments: () => apiClient.get('/payments/my-payments'),
  getAllPayments: () => apiClient.get('/payments/all'),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => apiClient.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => apiClient.post('/newsletter/unsubscribe', { email }),
  getSubscribers: () => apiClient.get('/newsletter/subscribers'),
};

export default apiClient;
