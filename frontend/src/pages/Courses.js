import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { courseAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Gear } from "phosphor-react";

const Courses = () => {
	const { user } = useContext(AuthContext);
	const location = useLocation();
	const [courses, setCourses] = useState([]);
	const [myCourses, setMyCourses] = useState([]);
	const [filteredCourses, setFilteredCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedLevel, setSelectedLevel] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [viewMode, setViewMode] = useState("grid");
	const [activeTab, setActiveTab] = useState("catalog");

	// Auto-switch to my-courses if user has enrollments
	useEffect(() => {
		if (myCourses.length > 0) {
			setActiveTab("my-courses");
		}
	}, [myCourses.length]);

	// Check if we are in dashboard context
	const isDashboard = !!user;

	const categories = [
		"Web Development",
		"Server Security",
		"Data Science",
		"Mobile Development",
		"Cloud Computing",
		"AI/ML",
	];
	const levels = ["Beginner", "Intermediate", "Advanced"];

	useEffect(() => {
		fetchCourses();
		if (isDashboard) {
			fetchMyCourses();
		}
	}, [isDashboard]);

	const fetchCourses = async () => {
		try {
			const response = await courseAPI.getAllCourses();
			setCourses(response.data || []);
			setFilteredCourses(response.data || []);
		} catch (error) {
			console.error("Error fetching courses:", error);
		} finally {
			if (!isDashboard) setLoading(false);
		}
	};

	const fetchMyCourses = async () => {
		try {
			const response = await courseAPI.getMyEnrolledCourses();
			setMyCourses(response.data || []);
		} catch (error) {
			console.error("Error fetching my courses:", error);
		} finally {
			setLoading(false);
		}
	};

	// Show all courses while filters are disabled
	useEffect(() => {
		setFilteredCourses(courses);
	}, [courses]);

	const getCategoryIcon = (category) => {
		const icons = {
			"Web Development": "🌐",
			"Server Security": "🔒",
			"Data Science": "📊",
			"Mobile Development": "📱",
			"Cloud Computing": "☁️",
			"AI/ML": "🤖",
		};
		return icons[category] || "📚";
	};

	const getLevelColor = (level) => {
		const colors = {
			Beginner: "#10b981",
			Intermediate: "#f59e0b",
			Advanced: "#ef4444",
		};
		return colors[level] || "#6b7280";
	};

	if (loading) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				}}>
				<div
					style={{
						textAlign: "center",
					}}>
					<div
						style={{
							fontSize: "3rem",
							marginBottom: "1rem",
							animation: "spin 1s linear infinite",
						}}>
						📚
					</div>
					<div
						style={{ fontSize: "1.3rem", color: "#0066cc", fontWeight: "600" }}>
						Loading amazing courses...
					</div>
				</div>
				<style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				padding: "0",
			}}>
			{/* Header Section */}
			<div
				style={{
					background: isDashboard
						? "white"
						: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
					padding: isDashboard ? "2rem 2.5rem" : "6rem 2rem",
					marginBottom: isDashboard ? "2rem" : "0",
					boxShadow: isDashboard ? "0 10px 30px rgba(0, 0, 0, 0.03)" : "none",
					textAlign: isDashboard ? "left" : "center",
					color: isDashboard ? "#1e293b" : "white",
					display: isDashboard ? "flex" : "block",
					alignItems: "center",
					justifyContent: "space-between",
					borderBottom: isDashboard ? "1px solid #f1f5f9" : "none",
					position: "relative",
					overflow: "hidden",
				}}>
				{!isDashboard && (
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0.15,
							backgroundImage:
								"radial-gradient(circle at 20% 50%, white, transparent 50%), radial-gradient(circle at 80% 80%, white, transparent 50%)",
							pointerEvents: "none",
						}}
					/>
				)}

				<div
					style={{
						position: "relative",
						zIndex: 1,
						maxWidth: isDashboard ? "none" : "800px",
						margin: isDashboard ? "0" : "0 auto",
					}}>
					<h1
						style={{
							margin: 0,
							fontSize: isDashboard ? "2rem" : "3.5rem",
							fontWeight: "900",
							letterSpacing: "-0.04em",
						}}>
						{isDashboard ? "Courses Hub 🎓" : "Master New Skills 🚀"}
					</h1>
					<p
						style={{
							margin: "0.5rem 0 0 0",
							fontSize: isDashboard ? "1rem" : "1.2rem",
							fontWeight: "500",
							opacity: isDashboard ? 0.7 : 0.9,
							lineHeight: "1.6",
						}}>
						{isDashboard
							? "Manage your learning journey and explore new content."
							: "Transform your career with industry-leading courses from expert instructors."}
					</p>
				</div>

				{isDashboard && (
					<div
						style={{
							display: "flex",
							background: "#f1f5f9",
							padding: "0.4rem",
							borderRadius: "14px",
							gap: "0.4rem",
							position: "relative",
							zIndex: 1,
						}}>
						<button
							onClick={() => setActiveTab("my-courses")}
							style={{
								padding: "0.7rem 1.4rem",
								borderRadius: "10px",
								border: "none",
								cursor: "pointer",
								fontWeight: "700",
								fontSize: "0.85rem",
								transition: "all 0.3s ease",
								background:
									activeTab === "my-courses" ? "white" : "transparent",
								color: activeTab === "my-courses" ? "#0066cc" : "#64748b",
								boxShadow:
									activeTab === "my-courses"
										? "0 4px 12px rgba(0,0,0,0.05)"
										: "none",
							}}>
							My Learning ({myCourses.length})
						</button>
						<button
							onClick={() => setActiveTab("catalog")}
							style={{
								padding: "0.7rem 1.4rem",
								borderRadius: "10px",
								border: "none",
								cursor: "pointer",
								fontWeight: "700",
								fontSize: "0.85rem",
								transition: "all 0.3s ease",
								background: activeTab === "catalog" ? "white" : "transparent",
								color: activeTab === "catalog" ? "#0066cc" : "#64748b",
								boxShadow:
									activeTab === "catalog"
										? "0 4px 12px rgba(0,0,0,0.05)"
										: "none",
							}}>
							Catalog
						</button>
					</div>
				)}
			</div>

			{/* Main Content Area */}
			<div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
				{/* My Courses Tab */}
				{isDashboard && activeTab === "my-courses" && (
					<div style={{ animation: "fadeIn 0.5s ease" }}>
						{myCourses.length > 0 ? (
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
									gap: "2.5rem",
								}}>
								{myCourses.map((enrollment) => (
									<Link
										key={enrollment._id}
										to={`/course/${enrollment.course?._id}`}
										style={{ textDecoration: "none" }}>
										<div
											style={{
												background: "white",
												borderRadius: "24px",
												overflow: "hidden",
												boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
												border: "1px solid #f1f5f9",
												height: "100%",
												display: "flex",
												flexDirection: "column",
												transition: "all 0.3s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = "translateY(-5px)";
												e.currentTarget.style.boxShadow =
													"0 20px 40px rgba(0, 102, 204, 0.12)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = "translateY(0)";
												e.currentTarget.style.boxShadow =
													"0 4px 15px rgba(0, 0, 0, 0.04)";
											}}>
											<div
												style={{
													height: "180px",
													background:
														"linear-gradient(135deg, #0f172a 0%, #334155 100%)",
													position: "relative",
													padding: "1.5rem",
													display: "flex",
													flexDirection: "column",
													justifyContent: "flex-end",
												}}>
												<div
													style={{
														position: "absolute",
														top: "1.5rem",
														right: "1.5rem",
														background: "#10b981",
														color: "white",
														padding: "0.4rem 0.8rem",
														borderRadius: "30px",
														fontSize: "0.7rem",
														fontWeight: "800",
													}}>
													ENROLLED
												</div>
												<h3
													style={{
														margin: 0,
														color: "white",
														fontSize: "1.4rem",
														fontWeight: "800",
													}}>
													{enrollment.course?.title}
												</h3>
											</div>
											<div
												style={{
													padding: "1.5rem",
													flex: 1,
													display: "flex",
													flexDirection: "column",
												}}>
												<p
													style={{
														margin: "0 0 1.5rem 0",
														color: "#64748b",
														fontSize: "0.9rem",
													}}>
													Last accessed:{" "}
													{new Date(
														enrollment.enrollmentDate,
													).toLocaleDateString()}
												</p>
												<div
													style={{
														background: "#f1f5f9",
														height: "8px",
														borderRadius: "10px",
														overflow: "hidden",
														marginBottom: "1.5rem",
													}}>
													<div
														style={{
															background:
																"linear-gradient(90deg, #0066cc, #00b4d8)",
															height: "100%",
															width: "20%",
														}}></div>
												</div>
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}>
													<span
														style={{
															fontSize: "0.85rem",
															fontWeight: "600",
															color: "#0066cc",
														}}>
														20% Complete
													</span>
													<span style={{ fontWeight: "700", color: "#0066cc" }}>
														Resume →
													</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						) : (
							<div
								style={{
									background: "white",
									borderRadius: "30px",
									padding: "5rem 2rem",
									textAlign: "center",
									border: "1px solid #f1f5f9",
								}}>
								<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎓</div>
								<h3
									style={{
										fontSize: "1.5rem",
										fontWeight: "800",
										color: "#1e293b",
									}}>
									Start your journey
								</h3>
								<p style={{ color: "#64748b", marginBottom: "2rem" }}>
									Explore our catalog to find your first course!
								</p>
								<button
									onClick={() => setActiveTab("catalog")}
									style={{
										padding: "1rem 2rem",
										background: "#0066cc",
										color: "white",
										borderRadius: "12px",
										border: "none",
										fontWeight: "700",
										cursor: "pointer",
									}}>
									Explore Catalog
								</button>
							</div>
						)}
					</div>
				)}

				{/* Course Catalog Tab (Also default for non-logged in) */}
				{(activeTab === "catalog" || !isDashboard) && (
					<div style={{ animation: "fadeIn 0.5s ease" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "1rem",
								marginBottom: "2.5rem",
							}}>
							<h2
								style={{
									margin: 0,
									fontSize: "2rem",
									fontWeight: "900",
									color: "#1e293b",
								}}>
								Course Discovery
							</h2>
							<div
								style={{
									background: "#0066cc",
									height: "4px",
									flex: 1,
									borderRadius: "2px",
									opacity: 0.1,
								}}></div>
							<span
								style={{
									background: "#f1f5f9",
									padding: "0.5rem 1rem",
									borderRadius: "50px",
									color: "#64748b",
									fontWeight: "700",
									fontSize: "0.85rem",
								}}>
								{filteredCourses.length} COURSES
							</span>
						</div>

						{filteredCourses.length === 0 ? (
							<div style={{ textAlign: "center", padding: "5rem" }}>
								<div style={{ fontSize: "4rem" }}>🔍</div>
								<p style={{ color: "#64748b" }}>
									No courses found at the moment.
								</p>
							</div>
						) : (
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
									gap: "2.5rem",
								}}>
								{filteredCourses.map((course) => {
									const enrollmentRate =
										(course.enrolledStudents / course.maxStudents) * 100;
									const isEnrolled =
										isDashboard &&
										myCourses.some((enr) => enr.course?._id === course._id);

									return (
										<Link
											key={course._id}
											to={`/course/${course._id}`}
											style={{ textDecoration: "none" }}>
											<div
												style={{
													background: "white",
													borderRadius: "24px",
													overflow: "hidden",
													boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
													transition: "all 0.3s ease",
													height: "100%",
													display: "flex",
													flexDirection: "column",
													border: "1px solid #f1f5f9",
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.transform = "translateY(-5px)";
													e.currentTarget.style.borderColor = "#0066cc";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = "translateY(0)";
													e.currentTarget.style.borderColor = "#f1f5f9";
												}}>
												<div
													style={{
														height: "200px",
														background: course.image
															? `url(${course.image})`
															: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
														backgroundSize: "cover",
														backgroundPosition: "center",
														position: "relative",
													}}>
													{isEnrolled && (
														<div
															style={{
																position: "absolute",
																top: 0,
																left: 0,
																right: 0,
																bottom: 0,
																background: "rgba(0, 102, 204, 0.8)",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																color: "white",
																fontWeight: "900",
																fontSize: "0.9rem",
															}}>
															OWNED ⚡ CONTINUE
														</div>
													)}
													<div
														style={{
															position: "absolute",
															top: "1rem",
															right: "1rem",
															background: getLevelColor(course.level),
															color: "white",
															padding: "0.3rem 0.7rem",
															borderRadius: "20px",
															fontSize: "0.7rem",
															fontWeight: "bold",
														}}>
														{course.level}
													</div>
												</div>

												<div
													style={{
														padding: "1.5rem",
														flex: 1,
														display: "flex",
														flexDirection: "column",
													}}>
													<h3
														style={{
															margin: "0 0 0.5rem 0",
															fontSize: "1.2rem",
															color: "#1e293b",
															fontWeight: "800",
														}}>
														{course.title}
													</h3>
													<p
														style={{
															margin: "0 0 1.5rem 0",
															color: "#64748b",
															fontSize: "0.85rem",
															flex: 1,
														}}>
														{course.description?.substring(0, 90)}...
													</p>

													<div
														style={{
															display: "flex",
															justifyContent: "space-between",
															marginBottom: "1rem",
														}}>
														<span
															style={{ fontSize: "0.8rem", color: "#64748b" }}>
															⏱️ {course.duration} weeks
														</span>
														<span
															style={{ fontSize: "0.8rem", color: "#64748b" }}>
															👥 {course.enrolledStudents} students
														</span>
													</div>

													<div
														style={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
															borderTop: "1px solid #f1f5f9",
															paddingTop: "1rem",
														}}>
														<span
															style={{
																fontSize: "1.3rem",
																fontWeight: "900",
																color: "#0066cc",
															}}>
															₦{course.price?.toLocaleString()}
														</span>
														<button
															style={{
																padding: "0.6rem 1.2rem",
																background: "#0066cc",
																color: "white",
																border: "none",
																borderRadius: "10px",
																fontWeight: "700",
																fontSize: "0.85rem",
																cursor: "pointer",
															}}>
															Enroll Now
														</button>
													</div>
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						)}
					</div>
				)}
			</div>
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`}</style>
		</div>
	);
};

export default Courses;
