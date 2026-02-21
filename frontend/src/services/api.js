import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

console.log("🔗 API Configuration:");
console.log("   Environment:", process.env.NODE_ENV);
console.log("   Base URL:", API_URL);
console.log("   Status: Ready");

export const apiClient = axios.create({
	baseURL: API_URL,
	timeout: 10000, // 10 second timeout
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
			console.log("✓ Auth token attached to request");
		}
		console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
		return config;
	},
	(error) => {
		console.error("❌ Request error:", error);
		return Promise.reject(error);
	},
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
	(response) => {
		console.log(`✅ Response:`, response.status, response.statusText);
		return response;
	},
	(error) => {
		if (error.response) {
			console.error(
				`❌ API Error ${error.response.status}:`,
				error.response.data,
			);
		} else if (error.request) {
			console.error("❌ No response received:", error.message);
		} else {
			console.error("❌ Request setup error:", error.message);
		}
		return Promise.reject(error);
	},
);

// ============ TEST METHODS ============
export const testAPI = {
	// Test basic connectivity
	testHealth: () => apiClient.get("/health"),

	// Test API root
	testAPIRoot: () => apiClient.get(""),

	// Test database
	testDB: () => apiClient.get("/test/db"),

	// Test CORS
	testCORS: () => apiClient.get("/test/cors"),

	// Test authentication
	testAuth: () => apiClient.get("/test/auth"),

	// Test full status
	testStatus: () => apiClient.get("/test/status"),
};

// ============ AUTH API ============
export const authAPI = {
	register: (data) => apiClient.post("/auth/register", data),
	login: (data) => apiClient.post("/auth/login", data),
	getCurrentUser: () => apiClient.get("/auth/me"),
	updateProfile: (data) => apiClient.put("/auth/profile", data),
	verifyEmail: (token) => apiClient.get(`/auth/verify-email/${token}`),
	forgotPassword: (data) => apiClient.post("/auth/forgot-password", data),
	resetPassword: (token, data) =>
		apiClient.post(`/auth/reset-password/${token}`, data),
};

// Blog API
export const blogAPI = {
	getAllBlogs: (page = 1, limit = 10) =>
		apiClient.get(`/blogs?page=${page}&limit=${limit}`),
	getBlogBySlug: (slug) => apiClient.get(`/blogs/${slug}`),
	createBlog: (data) => apiClient.post("/blogs", data),
	updateBlog: (id, data) => apiClient.put(`/blogs/${id}`, data),
	deleteBlog: (id) => apiClient.delete(`/blogs/${id}`),
};

// Appointment API
export const appointmentAPI = {
	createAppointment: (data) => apiClient.post("/appointments", data),
	getUserAppointments: () => apiClient.get("/appointments/my-appointments"),
	getAllAppointments: () => apiClient.get("/appointments/all"),
	updateStatus: (id, data) => apiClient.put(`/appointments/${id}/status`, data),
	cancelAppointment: (id) => apiClient.put(`/appointments/${id}/cancel`),
};

// Consultation API
export const consultationAPI = {
	submitConsultationRequest: (data) =>
		apiClient.post("/consultations/submit", data),
	getAllConsultationRequests: () => apiClient.get("/consultations"),
	getConsultationRequest: (id) => apiClient.get(`/consultations/${id}`),
	updateConsultationStatus: (id, data) =>
		apiClient.put(`/consultations/${id}/status`, data),
	deleteConsultationRequest: (id) => apiClient.delete(`/consultations/${id}`),
};

// Contact Form API
export const contactAPI = {
	sendMessage: (data) => apiClient.post("/contact/send", data),
};

// Payment API
export const paymentAPI = {
	createPaymentIntent: (data) =>
		apiClient.post("/payments/create-intent", data),
	confirmPayment: (data) => apiClient.post("/payments/confirm", data),
	getUserPayments: () => apiClient.get("/payments/my-payments"),
	getAllPayments: () => apiClient.get("/payments/all"),
};

// Newsletter API
export const newsletterAPI = {
	subscribe: (email) => apiClient.post("/newsletter/subscribe", { email }),
	unsubscribe: (email) => apiClient.post("/newsletter/unsubscribe", { email }),
	getSubscribers: () => apiClient.get("/newsletter/subscribers"),
};

// Course API
export const courseAPI = {
	getAllCourses: (filters) => apiClient.get("/courses", { params: filters }),
	getCourseById: (id) => apiClient.get(`/courses/${id}`),
	createCourse: (data) => apiClient.post("/courses/create", data),
	updateCourse: (id, data) => apiClient.put(`/courses/${id}`, data),
	deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
	enrollCourse: (courseId) => apiClient.post("/courses/enroll", { courseId }),
	confirmEnrollmentPayment: (enrollmentId) =>
		apiClient.post("/courses/confirm-payment", { enrollmentId }),
	getMyEnrolledCourses: () => apiClient.get("/courses/my-courses"),
	getCourseAssignments: (courseId) =>
		apiClient.get(`/courses/${courseId}/assignments`),
	getCourseAttendance: (courseId) =>
		apiClient.get(`/courses/${courseId}/attendance`),
	addAssignment: (courseId, data) =>
		apiClient.post(`/courses/${courseId}/add-assignment`, data),
	markAttendance: (courseId, data) =>
		apiClient.post(`/courses/${courseId}/mark-attendance`, data),
	// New endpoints
	getStudents: () => apiClient.get("/users"),
	markAssignment: (assignmentId, data) =>
		apiClient.post(`/assignments/${assignmentId}/mark`, data),
	getStudentCourseDetail: (courseId) =>
		apiClient.get(`/courses/${courseId}/student-dashboard`),
	// Live class endpoints
	addLiveClass: (courseId, data) =>
		apiClient.post(`/courses/${courseId}/live-classes`, data),
	getCourseLiveClasses: (courseId) =>
		apiClient.get(`/courses/${courseId}/live-classes`),
	getUpcomingLiveClasses: () => apiClient.get("/live/upcoming"),
	getAllUpcomingLiveClasses: () => apiClient.get("/live/all"),
	deleteLiveClass: (liveId) => apiClient.delete(`/live/${liveId}`),
	markLiveClassAttendance: (liveId, attendance) =>
		apiClient.post(`/live/${liveId}/attendance`, { attendance }),
	getCourseEnrollments: (courseId) =>
		apiClient.get(`/courses/${courseId}/enrollments`),
	getStudentDashboardStats: () =>
		apiClient.get("/courses/dashboard/student-stats"),
	getMySubmissions: () => apiClient.get("/assignments/my-submissions"),
};

// Assignment API
export const assignmentAPI = {
	createAssignment: (data) => apiClient.post("/assignments/create", data),
	getCourseAssignments: (courseId) =>
		apiClient.get(`/assignments/course/${courseId}`),
	getAssignmentById: (assignmentId) =>
		apiClient.get(`/assignments/${assignmentId}`),
	updateAssignment: (assignmentId, data) =>
		apiClient.put(`/assignments/${assignmentId}`, data),
	deleteAssignment: (assignmentId) =>
		apiClient.delete(`/assignments/${assignmentId}`),
	submitResponse: (assignmentId, courseId, data) =>
		apiClient.post(
			`/assignments/${assignmentId}/course/${courseId}/submit`,
			data,
		),
	getMySubmission: (assignmentId) =>
		apiClient.get(`/assignments/${assignmentId}/my-submission`),
	getSubmissions: (assignmentId) =>
		apiClient.get(`/assignments/${assignmentId}/submissions`),
	gradeSubmission: (submissionId, data) =>
		apiClient.post(`/assignments/${submissionId}/grade`, data),
};

// Live Classes API
export const liveClassAPI = {
	getUpcomingClasses: () => apiClient.get("/live/upcoming"),
	getCourseLiveClasses: (courseId) => apiClient.get(`/live/course/${courseId}`),
	addLiveClass: (courseId, data) =>
		apiClient.post(`/live/course/${courseId}`, data),
	deleteLiveClass: (liveId) => apiClient.delete(`/live/${liveId}`),
	markLiveClassAttendance: (liveId, attendance) =>
		apiClient.post(`/live/${liveId}/attendance`, { attendance }),
	getCourseEnrollments: (courseId) =>
		apiClient.get(`/courses/${courseId}/enrollments`),
};

export default apiClient;
