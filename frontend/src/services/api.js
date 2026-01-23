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

// Course API
export const courseAPI = {
  getAllCourses: (filters) => apiClient.get('/courses', { params: filters }),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
  createCourse: (data) => apiClient.post('/courses/create', data),
  updateCourse: (id, data) => apiClient.put(`/courses/${id}`, data),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
  enrollCourse: (courseId) => apiClient.post('/courses/enroll', { courseId }),
  confirmEnrollmentPayment: (enrollmentId) => apiClient.post('/courses/confirm-payment', { enrollmentId }),
  getMyEnrolledCourses: () => apiClient.get('/courses/my-courses'),
  getCourseAssignments: (courseId) => apiClient.get(`/courses/${courseId}/assignments`),
  getCourseAttendance: (courseId) => apiClient.get(`/courses/${courseId}/attendance`),
  addAssignment: (courseId, data) => apiClient.post(`/courses/${courseId}/add-assignment`, data),
  markAttendance: (courseId, data) => apiClient.post(`/courses/${courseId}/mark-attendance`, data),
  // New endpoints
  getStudents: () => apiClient.get('/users'),
  markAssignment: (assignmentId, data) => apiClient.post(`/assignments/${assignmentId}/mark`, data),
  getStudentCourseDetail: (courseId) => apiClient.get(`/courses/${courseId}/student-dashboard`),
  // Live class endpoints
  addLiveClass: (courseId, data) => apiClient.post(`/courses/${courseId}/live-classes`, data),
  getCourseLiveClasses: (courseId) => apiClient.get(`/courses/${courseId}/live-classes`),
  getUpcomingLiveClasses: () => apiClient.get('/live/upcoming'),
  getStudentDashboardStats: () => apiClient.get('/courses/dashboard/student-stats'),
};

export default apiClient;
