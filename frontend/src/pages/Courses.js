import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { courseAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Gear } from "phosphor-react";

const Courses = () => {
	const { user } = useContext(AuthContext);
	const location = useLocation();
	const [courses, setCourses] = useState([]);
	const [filteredCourses, setFilteredCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedLevel, setSelectedLevel] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [viewMode, setViewMode] = useState("grid");

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
	}, []);

	const fetchCourses = async () => {
		try {
			const response = await courseAPI.getAllCourses();
			setCourses(response.data || []);
			setFilteredCourses(response.data || []);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching courses:", error);
			setLoading(false);
		}
	};

	/* FILTERS DISABLED - original filtering logic preserved below for easy restore:
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel) {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
    }

    setFilteredCourses(filtered);
  }, [selectedCategory, selectedLevel, courses, searchTerm, sortBy]);
  */

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
			{isDashboard ? (
				<div
					style={{
						background: "white",
						borderRadius: "24px",
						padding: "2rem",
						marginBottom: "2.5rem",
						boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						border: "1px solid #f1f5f9",
						position: "relative",
						overflow: "hidden",
					}}>
					<div
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							width: "300px",
							height: "100%",
							background:
								"linear-gradient(90deg, transparent 0%, rgba(0, 102, 204, 0.03) 100%)",
							pointerEvents: "none",
						}}
					/>
					<div style={{ position: "relative", zIndex: 1 }}>
						<h1
							style={{
								margin: 0,
								fontSize: "1.75rem",
								color: "#1e293b",
								fontWeight: "800",
								letterSpacing: "-0.02em",
							}}>
							Available Courses 📚
						</h1>
						<p
							style={{
								margin: "0.5rem 0 0 0",
								color: "#64748b",
								fontSize: "1rem",
								maxWidth: "600px",
							}}>
							Expand your knowledge with our curated professional courses.
						</p>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "1rem",
							position: "relative",
							zIndex: 1,
						}}>
						<div
							style={{
								background: "#f8fafc",
								padding: "0.6rem 1.2rem",
								borderRadius: "12px",
								border: "1px solid #e2e8f0",
								color: "#475569",
								fontWeight: "600",
								fontSize: "0.9rem",
							}}>
							<span style={{ color: "#0066cc" }}>{filteredCourses.length}</span>{" "}
							Courses
						</div>
						{user?.isAdmin && (
							<Link
								to="/admin/dashboard"
								style={{
									padding: "0.75rem 1.25rem",
									background: "#0066cc",
									color: "white",
									borderRadius: "12px",
									textDecoration: "none",
									fontWeight: "600",
									fontSize: "0.9rem",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
									boxShadow: "0 4px 12px rgba(0, 102, 204, 0.2)",
									transition: "all 0.3s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow =
										"0 6px 16px rgba(0, 102, 204, 0.3)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow =
										"0 4px 12px rgba(0, 102, 204, 0.2)";
								}}>
								<Gear size={18} weight="bold" />
								Admin Panel
							</Link>
						)}
					</div>
				</div>
			) : (
				<div
					style={{
						background: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
						padding: "4rem 2rem",
						textAlign: "center",
						color: "white",
						position: "relative",
						overflow: "hidden",
					}}>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0.1,
							backgroundImage:
								"radial-gradient(circle at 20% 50%, white, transparent 50%)",
							pointerEvents: "none",
						}}
					/>

					<div
						style={{
							maxWidth: "1400px",
							margin: "0 auto",
							position: "relative",
							zIndex: 1,
						}}>
						<h1
							style={{
								margin: "0 0 0.5rem 0",
								fontSize: "3rem",
								fontWeight: "bold",
								textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
							}}>
							Explore Professional Courses 📚
						</h1>
						<p
							style={{
								margin: "0 0 1.5rem 0",
								fontSize: "1.2rem",
								opacity: 0.95,
								maxWidth: "600px",
								marginLeft: "auto",
								marginRight: "auto",
							}}>
							Master new skills from industry experts. Start learning today and
							transform your career!
						</p>
						<div
							style={{
								background: "rgba(255, 255, 255, 0.15)",
								backdropFilter: "blur(10px)",
								padding: "0.5rem 1rem",
								borderRadius: "50px",
								display: "inline-block",
								border: "1px solid rgba(255, 255, 255, 0.3)",
							}}>
							<span style={{ fontSize: "1rem" }}>🎯</span>{" "}
							{filteredCourses.length} courses available |{" "}
							{courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)}{" "}
							students enrolled
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			<div
				style={{
					maxWidth: "1400px",
					margin: "0 auto",
					padding: "2rem",
				}}>
				{/* Search and Controls - temporarily hidden (filters disabled) */}
				{false && (
					<div
						style={{
							background: "white",
							borderRadius: "18px",
							padding: "2rem",
							marginBottom: "2rem",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
							gap: "1.5rem",
							alignItems: "end",
						}}>
						{/* Search Bar */}
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "0.5rem",
									fontWeight: "600",
									color: "#1f2937",
									fontSize: "0.9rem",
								}}>
								🔍 Search Courses
							</label>
							<input
								type="text"
								placeholder="Search by title or keyword..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								style={{
									width: "100%",
									padding: "0.8rem 1rem",
									borderRadius: "10px",
									border: "2px solid #e5e7eb",
									fontSize: "0.95rem",
									transition: "all 0.3s ease",
									boxSizing: "border-box",
								}}
								onFocus={(e) => {
									e.target.style.borderColor = "#0066cc";
									e.target.style.boxShadow = "0 0 0 3px rgba(0, 102, 204, 0.1)";
								}}
								onBlur={(e) => {
									e.target.style.borderColor = "#e5e7eb";
									e.target.style.boxShadow = "none";
								}}
							/>
						</div>

						{/* Category Filter */}
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "0.5rem",
									fontWeight: "600",
									color: "#1f2937",
									fontSize: "0.9rem",
								}}>
								📂 Category
							</label>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								style={{
									width: "100%",
									padding: "0.8rem 1rem",
									borderRadius: "10px",
									border: "2px solid #e5e7eb",
									fontSize: "0.95rem",
									cursor: "pointer",
									backgroundColor: "white",
									transition: "all 0.3s ease",
								}}
								onFocus={(e) => {
									e.target.style.borderColor = "#0066cc";
								}}
								onBlur={(e) => {
									e.target.style.borderColor = "#e5e7eb";
								}}>
								<option value="">All Categories</option>
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{getCategoryIcon(cat)} {cat}
									</option>
								))}
							</select>
						</div>

						{/* Level Filter */}
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "0.5rem",
									fontWeight: "600",
									color: "#1f2937",
									fontSize: "0.9rem",
								}}>
								🎯 Level
							</label>
							<select
								value={selectedLevel}
								onChange={(e) => setSelectedLevel(e.target.value)}
								style={{
									width: "100%",
									padding: "0.8rem 1rem",
									borderRadius: "10px",
									border: "2px solid #e5e7eb",
									fontSize: "0.95rem",
									cursor: "pointer",
									backgroundColor: "white",
									transition: "all 0.3s ease",
								}}
								onFocus={(e) => {
									e.target.style.borderColor = "#0066cc";
								}}
								onBlur={(e) => {
									e.target.style.borderColor = "#e5e7eb";
								}}>
								<option value="">All Levels</option>
								{levels.map((level) => (
									<option key={level} value={level}>
										{level}
									</option>
								))}
							</select>
						</div>

						{/* Sort Filter */}
						<div>
							<label
								style={{
									display: "block",
									marginBottom: "0.5rem",
									fontWeight: "600",
									color: "#1f2937",
									fontSize: "0.9rem",
								}}>
								⬇️ Sort By
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								style={{
									width: "100%",
									padding: "0.8rem 1rem",
									borderRadius: "10px",
									border: "2px solid #e5e7eb",
									fontSize: "0.95rem",
									cursor: "pointer",
									backgroundColor: "white",
									transition: "all 0.3s ease",
								}}
								onFocus={(e) => {
									e.target.style.borderColor = "#0066cc";
								}}
								onBlur={(e) => {
									e.target.style.borderColor = "#e5e7eb";
								}}>
								<option value="newest">Newest First</option>
								<option value="popular">Most Popular</option>
								<option value="price-low">Price: Low to High</option>
								<option value="price-high">Price: High to Low</option>
							</select>
						</div>

						{/* Clear Filters Button */}
						<button
							onClick={() => {
								setSelectedCategory("");
								setSelectedLevel("");
								setSearchTerm("");
								setSortBy("newest");
							}}
							style={{
								padding: "0.8rem 1.5rem",
								background: "#f3f4f6",
								border: "2px solid #e5e7eb",
								borderRadius: "10px",
								cursor: "pointer",
								fontWeight: "600",
								color: "#374151",
								transition: "all 0.3s ease",
								fontSize: "0.95rem",
							}}
							onMouseEnter={(e) => {
								e.target.style.background = "#e5e7eb";
							}}
							onMouseLeave={(e) => {
								e.target.style.background = "#f3f4f6";
							}}>
							✕ Clear All
						</button>
					</div>
				)}

				{/* Results Section */}
				<div
					style={{
						marginBottom: "2rem",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "1rem",
					}}>
					<h2
						style={{
							margin: 0,
							fontSize: "1.6rem",
							fontWeight: "bold",
							color: "#1f2937",
						}}>
						{filteredCourses.length}{" "}
						{filteredCourses.length === 1 ? "Course" : "Courses"} Found
					</h2>
				</div>

				{/* No Results */}
				{filteredCourses.length === 0 ? (
					<div
						style={{
							background: "white",
							borderRadius: "18px",
							padding: "4rem 2rem",
							textAlign: "center",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
						}}>
						<div
							style={{
								fontSize: "4rem",
								marginBottom: "1rem",
							}}>
							🔍
						</div>
						<p
							style={{
								fontSize: "1.2rem",
								color: "#6b7280",
								marginBottom: "0.5rem",
							}}>
							No courses match your search criteria
						</p>
						<p
							style={{
								fontSize: "0.95rem",
								color: "#9ca3af",
							}}>
							Try adjusting your filters or search term
						</p>
					</div>
				) : (
					<>
						{/* Courses Grid */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
								gap: "2rem",
							}}>
							{filteredCourses.map((course) => {
								const enrollmentRate =
									(course.enrolledStudents / course.maxStudents) * 100;
								const isAlmostFull = enrollmentRate >= 80;

								return (
									<Link
										key={course._id}
										to={`/course/${course._id}`}
										style={{ textDecoration: "none" }}>
										<div
											style={{
												background: "white",
												borderRadius: "20px",
												overflow: "hidden",
												boxShadow: isDashboard
													? "0 4px 15px rgba(0, 0, 0, 0.04)"
													: "0 4px 20px rgba(0, 0, 0, 0.08)",
												transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
												height: "100%",
												cursor: "pointer",
												display: "flex",
												flexDirection: "column",
												position: "relative",
												border: "1px solid #f1f5f9",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = "translateY(-8px)";
												e.currentTarget.style.boxShadow =
													"0 15px 35px rgba(0, 102, 204, 0.15)";
												e.currentTarget.style.borderColor = "#0066cc";
												e.currentTarget.style.background = "#ffffff";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = "translateY(0)";
												e.currentTarget.style.boxShadow = isDashboard
													? "0 4px 15px rgba(0, 0, 0, 0.04)"
													: "0 4px 20px rgba(0, 0, 0, 0.08)";
												e.currentTarget.style.borderColor = "#f1f5f9";
											}}>
											{/* Featured Badge */}
											{isAlmostFull && (
												<div
													style={{
														position: "absolute",
														top: "1rem",
														left: "1rem",
														background: "#ff6b6b",
														color: "white",
														padding: "0.4rem 0.8rem",
														borderRadius: "20px",
														fontSize: "0.75rem",
														fontWeight: "bold",
														zIndex: 10,
													}}>
													⚡ Almost Full
												</div>
											)}

											{/* Course Image */}
											<div
												style={{
													height: "200px",
													background:
														"linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
													backgroundImage: course.image
														? `url(${course.image})`
														: "none",
													backgroundSize: "cover",
													backgroundPosition: "center",
													position: "relative",
													overflow: "hidden",
												}}>
												<div
													style={{
														position: "absolute",
														top: 0,
														right: 0,
														bottom: 0,
														left: 0,
														background:
															"linear-gradient(135deg, rgba(0, 102, 204, 0.7) 0%, rgba(0, 180, 216, 0.7) 100%)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														opacity: 0,
														transition: "opacity 0.3s ease",
														fontSize: "3rem",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.opacity = "1";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.opacity = "0";
													}}>
													{getCategoryIcon(course.category)}
												</div>

												{/* Level Badge */}
												<div
													style={{
														position: "absolute",
														top: "1rem",
														right: "1rem",
														background: getLevelColor(course.level),
														color: "white",
														padding: "0.4rem 0.8rem",
														borderRadius: "20px",
														fontSize: "0.75rem",
														fontWeight: "bold",
														textTransform: "uppercase",
													}}>
													{course.level}
												</div>
											</div>

											{/* Course Content */}
											<div
												style={{
													padding: "1.5rem",
													flex: 1,
													display: "flex",
													flexDirection: "column",
												}}>
												{/* Category Badge */}
												<div
													style={{
														display: "inline-block",
														background: "rgba(0, 102, 204, 0.1)",
														color: "#0066cc",
														padding: "0.4rem 0.9rem",
														borderRadius: "20px",
														fontSize: "0.75rem",
														fontWeight: "bold",
														marginBottom: "0.8rem",
														width: "fit-content",
													}}>
													{getCategoryIcon(course.category)} {course.category}
												</div>

												{/* Title */}
												<h3
													style={{
														margin: "0.5rem 0",
														fontSize: "1.2rem",
														fontWeight: "bold",
														color: "#1f2937",
														lineHeight: "1.4",
													}}>
													{course.title}
												</h3>

												{/* Description */}
												<p
													style={{
														margin: "0.7rem 0 1rem 0",
														fontSize: "0.85rem",
														color: "#6b7280",
														lineHeight: "1.5",
														flex: 1,
													}}>
													{course.description?.substring(0, 100)}...
												</p>

												{/* Course Meta */}
												<div
													style={{
														display: "grid",
														gridTemplateColumns: "1fr 1fr",
														gap: "1rem",
														marginBottom: "1rem",
														paddingBottom: "1rem",
														borderBottom: "1px solid #e5e7eb",
													}}>
													<div>
														<p
															style={{
																margin: "0 0 0.3rem 0",
																fontSize: "0.75rem",
																color: "#9ca3af",
																fontWeight: "600",
																textTransform: "uppercase",
															}}>
															⏱️ Duration
														</p>
														<p
															style={{
																margin: 0,
																fontSize: "0.95rem",
																fontWeight: "bold",
																color: "#1f2937",
															}}>
															{course.duration} weeks
														</p>
													</div>
													<div>
														<p
															style={{
																margin: "0 0 0.3rem 0",
																fontSize: "0.75rem",
																color: "#9ca3af",
																fontWeight: "600",
																textTransform: "uppercase",
															}}>
															👥 Enrolled
														</p>
														<p
															style={{
																margin: 0,
																fontSize: "0.95rem",
																fontWeight: "bold",
																color: "#1f2937",
															}}>
															{course.enrolledStudents}/{course.maxStudents}
														</p>
													</div>
												</div>

												{/* Enrollment Progress Bar */}
												<div
													style={{
														marginBottom: "1rem",
													}}>
													<div
														style={{
															width: "100%",
															height: "6px",
															background: "#e5e7eb",
															borderRadius: "3px",
															overflow: "hidden",
														}}>
														<div
															style={{
																height: "100%",
																background:
																	enrollmentRate >= 80
																		? "#ff6b6b"
																		: "linear-gradient(90deg, #0066cc, #00b4d8)",
																width: `${Math.min(enrollmentRate, 100)}%`,
																transition: "width 0.3s ease",
															}}
														/>
													</div>
													<p
														style={{
															margin: "0.4rem 0 0 0",
															fontSize: "0.75rem",
															color: "#9ca3af",
														}}>
														{Math.round(enrollmentRate)}% Full
													</p>
												</div>

												{/* Footer */}
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														gap: "0.8rem",
													}}>
													<p
														style={{
															margin: 0,
															fontSize: "1.4rem",
															fontWeight: "bold",
															background:
																"linear-gradient(135deg, #0066cc, #00b4d8)",
															WebkitBackgroundClip: "text",
															WebkitTextFillColor: "transparent",
															backgroundClip: "text",
														}}>
														₦{course.price?.toLocaleString()}
													</p>
													<button
														style={{
															padding: "0.7rem 1.2rem",
															background:
																"linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
															color: "white",
															border: "none",
															borderRadius: "10px",
															fontWeight: "600",
															fontSize: "0.9rem",
															cursor: "pointer",
															transition: "all 0.3s ease",
															whiteSpace: "nowrap",
														}}
														onMouseEnter={(e) => {
															e.currentTarget.style.transform = "scale(1.08)";
															e.currentTarget.style.opacity = "0.9";
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.transform = "scale(1)";
															e.currentTarget.style.opacity = "1";
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

						{/* Footer Stats */}
						<div
							style={{
								marginTop: "4rem",
								background: "white",
								borderRadius: "18px",
								padding: "2rem",
								boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
								textAlign: "center",
							}}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
									gap: "2rem",
								}}>
								<div>
									<p
										style={{
											margin: "0 0 0.5rem 0",
											fontSize: "0.9rem",
											color: "#6b7280",
											textTransform: "uppercase",
											fontWeight: "600",
										}}>
										Total Courses
									</p>
									<p
										style={{
											margin: 0,
											fontSize: "2rem",
											fontWeight: "bold",
											color: "#0066cc",
										}}>
										{courses.length}
									</p>
								</div>
								<div>
									<p
										style={{
											margin: "0 0 0.5rem 0",
											fontSize: "0.9rem",
											color: "#6b7280",
											textTransform: "uppercase",
											fontWeight: "600",
										}}>
										Students Enrolled
									</p>
									<p
										style={{
											margin: 0,
											fontSize: "2rem",
											fontWeight: "bold",
											color: "#00b4d8",
										}}>
										{courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}+
									</p>
								</div>
								<div>
									<p
										style={{
											margin: "0 0 0.5rem 0",
											fontSize: "0.9rem",
											color: "#6b7280",
											textTransform: "uppercase",
											fontWeight: "600",
										}}>
										Expert Instructors
									</p>
									<p
										style={{
											margin: 0,
											fontSize: "2rem",
											fontWeight: "bold",
											color: "#0066cc",
										}}>
										{new Set(courses.map((c) => c.instructor)).size}+
									</p>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Courses;
