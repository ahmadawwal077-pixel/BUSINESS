import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticsConsent from "./components/AnalyticsConsent";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import MakeAppointment from "./pages/MakeAppointment";
import Payments from "./pages/Payments";
import AdminBlog from "./pages/AdminBlog";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPreviousGrades from "./pages/StudentPreviousGrades";

// Styles
import "./styles/global.css";
import DashboardLayout from "./components/DashboardLayout";

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					{/* Dashboard/Protected Area */}
					<Route
						path="/*"
						element={
							<Routes>
								{/* Protected Routes wrapped in DashboardLayout */}
								<Route
									path="/dashboard"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<Dashboard />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/profile"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<Profile />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/appointments"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<Appointments />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/make-appointment"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<MakeAppointment />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/payments"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<Payments />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/admin/blog"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<AdminBlog />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/student-previous-grades"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<StudentPreviousGrades />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>
								<Route
									path="/admin/dashboard"
									element={
										<ProtectedRoute>
											<DashboardLayout>
												<AdminDashboard />
											</DashboardLayout>
										</ProtectedRoute>
									}
								/>

								{/* Public Routes with Navbar/Footer */}
								<Route
									path="*"
									element={
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												minHeight: "100vh",
											}}>
											<Navbar />
											<AnalyticsConsent />
											<main style={{ flex: 1 }}>
												<Routes>
													<Route path="/" element={<Home />} />
													<Route path="/about" element={<About />} />
													<Route path="/services" element={<Services />} />
													<Route path="/projects" element={<Projects />} />
													<Route path="/blog" element={<Blog />} />
													<Route path="/blog/:slug" element={<BlogDetail />} />
													<Route path="/contact" element={<Contact />} />
													<Route path="/login" element={<Login />} />
													<Route path="/register" element={<Register />} />
													<Route
														path="/verify-email/:token"
														element={<VerifyEmail />}
													/>
													<Route
														path="/forgot-password"
														element={<ForgotPassword />}
													/>
													<Route
														path="/reset-password/:token"
														element={<ResetPassword />}
													/>
													<Route
														path="/courses"
														element={
															<CourseRouter>
																<Courses />
															</CourseRouter>
														}
													/>
													<Route
														path="/course/:id"
														element={
															<CourseRouter>
																<CourseDetail />
															</CourseRouter>
														}
													/>
												</Routes>
											</main>
											<Footer />
										</div>
									}
								/>
							</Routes>
						}
					/>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

// Helper component for conditional layout on courses
function CourseRouter({ children }) {
	const { isAuthenticated, loading } = React.useContext(
		require("./context/AuthContext").AuthContext,
	);

	if (loading) return null;

	if (isAuthenticated) {
		return <DashboardLayout>{children}</DashboardLayout>;
	}

	return children;
}

export default App;
