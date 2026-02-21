import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { courseAPI, paymentAPI } from "../services/api";
import alertService from "../utils/alertService";

const CourseDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [enrolling, setEnrolling] = useState(false);
	const [enrolled, setEnrolled] = useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("paystack");
	const [enrollmentId, setEnrollmentId] = useState(null);

	const isDashboard = !!user;

	useEffect(() => {
		fetchCourse();
	}, [id]);

	const fetchCourse = async () => {
		try {
			const response = await courseAPI.getCourseById(id);
			setCourse(response.data);

			// Check if already enrolled
			const enrolledCoursesRes = await courseAPI.getMyEnrolledCourses();
			const isEnrolled = enrolledCoursesRes.data.some(
				(e) => String(e.course?._id || e.course?.id) === String(id),
			);
			setEnrolled(isEnrolled);

			setLoading(false);
		} catch (error) {
			console.error("Error fetching course:", error);
			setLoading(false);
		}
	};

	const handleEnroll = async () => {
		if (!user) {
			navigate("/login", { state: { from: window.location.pathname } });
			return;
		}

		setEnrolling(true);
		try {
			console.log("Enrolling in course:", id);
			const response = await courseAPI.enrollCourse(id);
			console.log("Enrollment response:", response.data);

			const enrollmentData = response.data.enrollment;
			const enrollmentIdRes = enrollmentData?._id || enrollmentData?.id;

			if (!enrollmentIdRes) {
				throw new Error("Failed to get enrollment ID from server");
			}

			setEnrollmentId(enrollmentIdRes);

			// Initialize payment for this enrollment via Paystack
			console.log("Creating payment intent for enrollment:", enrollmentIdRes);
			const paymentInit = await paymentAPI.createPaymentIntent({
				amount: course.price || 0,
				enrollmentId: enrollmentIdRes,
				email: user.email,
				fullName: user.name || user.email,
			});

			console.log("Payment initialization response:", paymentInit.data);

			const { authorization_url } = paymentInit.data;
			if (authorization_url) {
				// Open Paystack payment page
				window.open(authorization_url, "_blank");
				alertService.info(
					"Payment Window Opened",
					"Please complete payment in the new window to finish enrollment.",
				);
			} else {
				setPaymentModalOpen(true);
			}
		} catch (error) {
			console.error("Error enrolling:", error);
			alertService.error(
				"Enrollment Failed",
				error.response?.data?.message ||
					"Something went wrong while enrolling in this course.",
			);
		} finally {
			setEnrolling(false);
		}
	};

	const handleConfirmPayment = async () => {
		if (!enrollmentId) return;

		try {
			// In a real app, you would integrate with Paystack or Stripe here
			// For now, we'll just confirm the payment locally
			await courseAPI.confirmEnrollmentPayment(enrollmentId);

			alertService.success(
				"Enrollment Successful!",
				"You are now enrolled in the course. Happy learning!",
			);
			setPaymentModalOpen(false);
			setEnrolled(true);

			// Refresh course data
			await fetchCourse();

			// Redirect to Dashboard so it reloads enrolled courses
			navigate("/dashboard");
		} catch (error) {
			console.error("Error confirming payment:", error);
			alert("Payment confirmation failed");
		}
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
				<div style={{ fontSize: "1.5rem", color: "#0066cc" }}>
					Loading course details...
				</div>
			</div>
		);
	}

	if (!course) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				}}>
				<div style={{ fontSize: "1.5rem", color: "#dc2626" }}>
					Course not found
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				padding: "2rem",
			}}>
			{/* Back Button */}
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					marginBottom: "2rem",
				}}>
				<button
					onClick={() => navigate("/courses")}
					style={{
						padding: "0.7rem 1.5rem",
						background: "white",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer",
						fontWeight: "600",
						color: "#0066cc",
						transition: "all 0.3s ease",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = "#f3f4f6";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = "white";
					}}>
					← Back to Courses
				</button>
			</div>

			{/* Course Header & Content Wrapper */}
			<div
				style={
					isDashboard
						? { marginBottom: "2rem" }
						: {
								maxWidth: "1200px",
								margin: "0 auto",
								marginBottom: "2rem",
							}
				}>
				<div
					style={{
						background: "white",
						borderRadius: "15px",
						overflow: "hidden",
						boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
						borderLeft: isDashboard ? "8px solid #0066cc" : "none",
					}}>
					{isDashboard ? (
						<div style={{ padding: "2.5rem" }}>
							<div
								style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
								<span
									style={{
										background: "rgba(0, 102, 204, 0.1)",
										color: "#0066cc",
										padding: "0.4rem 1rem",
										borderRadius: "20px",
										fontSize: "0.85rem",
										fontWeight: "bold",
									}}>
									{course.category}
								</span>
								<span
									style={{
										background: "#f3f4f6",
										color: "#4b5563",
										padding: "0.4rem 1rem",
										borderRadius: "20px",
										fontSize: "0.85rem",
										fontWeight: "bold",
									}}>
									{course.level}
								</span>
							</div>
							<h1
								style={{
									margin: "0 0 1rem 0",
									fontSize: "2.2rem",
									fontWeight: "bold",
									color: "#1f2937",
								}}>
								{course.title}
							</h1>
							<p
								style={{
									margin: 0,
									fontSize: "1.1rem",
									color: "#6b7280",
									maxWidth: "800px",
								}}>
								{course.description}
							</p>
						</div>
					) : (
						/* Hero Image */
						<div
							style={{
								height: "350px",
								background: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
								backgroundImage: course.image ? `url(${course.image})` : "none",
								backgroundSize: "cover",
								backgroundPosition: "center",
								position: "relative",
							}}>
							<div
								style={{
									position: "absolute",
									top: "2rem",
									left: "2rem",
									background: "white",
									padding: "0.7rem 1.5rem",
									borderRadius: "20px",
									fontSize: "0.9rem",
									fontWeight: "bold",
									color: "#0066cc",
								}}>
								{course.category}
							</div>
							<div
								style={{
									position: "absolute",
									top: "2rem",
									right: "2rem",
									background: "white",
									padding: "0.7rem 1.5rem",
									borderRadius: "20px",
									fontSize: "0.9rem",
									fontWeight: "bold",
									color: "#0066cc",
								}}>
								{course.level}
							</div>
						</div>
					)}

					{/* Course Details */}
					<div
						style={{
							padding: "3rem",
						}}>
						<h1
							style={{
								margin: "0 0 1rem 0",
								fontSize: "2.5rem",
								fontWeight: "bold",
								color: "#1f2937",
							}}>
							{course.title}
						</h1>

						<p
							style={{
								margin: "0 0 2rem 0",
								fontSize: "1.1rem",
								color: "#6b7280",
								lineHeight: "1.6",
							}}>
							{course.description}
						</p>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
								gap: "2rem",
								marginBottom: "2rem",
								paddingBottom: "2rem",
								borderBottom: "1px solid #e5e7eb",
							}}>
							{/* Instructor */}
							<div>
								<p
									style={{
										margin: "0 0 0.5rem 0",
										fontSize: "0.85rem",
										color: "#9ca3af",
										fontWeight: "bold",
										textTransform: "uppercase",
									}}>
									Instructor
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "1.1rem",
										fontWeight: "bold",
										color: "#1f2937",
									}}>
									{course.instructor?.name}
								</p>
							</div>

							{/* Duration */}
							<div>
								<p
									style={{
										margin: "0 0 0.5rem 0",
										fontSize: "0.85rem",
										color: "#9ca3af",
										fontWeight: "bold",
										textTransform: "uppercase",
									}}>
									Duration
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "1.1rem",
										fontWeight: "bold",
										color: "#1f2937",
									}}>
									{course.duration} weeks
								</p>
							</div>

							{/* Schedule */}
							<div>
								<p
									style={{
										margin: "0 0 0.5rem 0",
										fontSize: "0.85rem",
										color: "#9ca3af",
										fontWeight: "bold",
										textTransform: "uppercase",
									}}>
									Schedule
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "1.1rem",
										fontWeight: "bold",
										color: "#1f2937",
									}}>
									{course.schedule?.days?.join(", ")}
								</p>
								<p
									style={{
										margin: "0.5rem 0 0 0",
										fontSize: "0.9rem",
										color: "#6b7280",
									}}>
									{course.schedule?.startTime} - {course.schedule?.endTime}
								</p>
							</div>

							{/* Availability */}
							<div>
								<p
									style={{
										margin: "0 0 0.5rem 0",
										fontSize: "0.85rem",
										color: "#9ca3af",
										fontWeight: "bold",
										textTransform: "uppercase",
									}}>
									Spots Available
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "1.1rem",
										fontWeight: "bold",
										color:
											course.enrolledStudents >= course.maxStudents
												? "#dc2626"
												: "#0066cc",
									}}>
									{Math.max(0, course.maxStudents - course.enrolledStudents)}/
									{course.maxStudents}
								</p>
							</div>
						</div>

						{/* Price and Enroll Button */}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: "2rem",
							}}>
							<div>
								<p
									style={{
										margin: "0 0 0.5rem 0",
										fontSize: "0.85rem",
										color: "#9ca3af",
										fontWeight: "bold",
									}}>
									Course Fee
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "2rem",
										fontWeight: "bold",
										color: "#0066cc",
									}}>
									₦{course.price?.toLocaleString()}
								</p>
							</div>

							<button
								onClick={handleEnroll}
								disabled={
									enrolling ||
									enrolled ||
									course.enrolledStudents >= course.maxStudents
								}
								style={{
									padding: "1rem 2rem",
									background: enrolled
										? "#10b981"
										: course.enrolledStudents >= course.maxStudents
											? "#9ca3af"
											: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
									color: "white",
									border: "none",
									borderRadius: "10px",
									fontWeight: "600",
									fontSize: "1.1rem",
									cursor:
										enrolling ||
										enrolled ||
										course.enrolledStudents >= course.maxStudents
											? "not-allowed"
											: "pointer",
									transition: "all 0.3s ease",
									opacity:
										enrolling ||
										enrolled ||
										course.enrolledStudents >= course.maxStudents
											? 0.6
											: 1,
								}}
								onMouseEnter={(e) => {
									if (
										!enrolling &&
										!enrolled &&
										course.enrolledStudents < course.maxStudents
									) {
										e.currentTarget.style.transform = "scale(1.05)";
									}
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "scale(1)";
								}}>
								{enrolled
									? "✓ Already Enrolled"
									: course.enrolledStudents >= course.maxStudents
										? "Course Full"
										: enrolling
											? "Processing..."
											: "Enroll Now"}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Course Content Sections */}
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gap: "2rem",
				}}>
				{/* What You'll Learn */}
				<div
					style={{
						background: "white",
						borderRadius: "15px",
						padding: "2rem",
						boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
					}}>
					<h2
						style={{
							margin: "0 0 1.5rem 0",
							fontSize: "1.3rem",
							fontWeight: "bold",
							color: "#1f2937",
						}}>
						📚 What You'll Learn
					</h2>
					<ul
						style={{
							margin: 0,
							padding: "0 0 0 1.5rem",
							listStyle: "none",
						}}>
						{[
							"Master core concepts and industry practices",
							"Build real-world projects from scratch",
							"Learn from experienced instructors",
							"Get a certificate upon completion",
							"Access lifetime course materials",
							"Connect with fellow students",
						].map((item, idx) => (
							<li
								key={idx}
								style={{
									margin: "0.8rem 0",
									color: "#6b7280",
									fontSize: "0.95rem",
									lineHeight: "1.5",
								}}>
								✓ {item}
							</li>
						))}
					</ul>
				</div>

				{/* Course Requirements */}
				<div
					style={{
						background: "white",
						borderRadius: "15px",
						padding: "2rem",
						boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
					}}>
					<h2
						style={{
							margin: "0 0 1.5rem 0",
							fontSize: "1.3rem",
							fontWeight: "bold",
							color: "#1f2937",
						}}>
						✓ Requirements
					</h2>
					<ul
						style={{
							margin: 0,
							padding: "0 0 0 1.5rem",
							listStyle: "none",
						}}>
						{[
							"Basic computer knowledge",
							"Willingness to learn",
							"Consistent attendance (80%+)",
							"Access to course materials",
							"A positive attitude",
							"Commitment to learning",
						].map((item, idx) => (
							<li
								key={idx}
								style={{
									margin: "0.8rem 0",
									color: "#6b7280",
									fontSize: "0.95rem",
									lineHeight: "1.5",
								}}>
								• {item}
							</li>
						))}
					</ul>
				</div>

				{/* Course Features */}
				<div
					style={{
						background: "white",
						borderRadius: "15px",
						padding: "2rem",
						boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
					}}>
					<h2
						style={{
							margin: "0 0 1.5rem 0",
							fontSize: "1.3rem",
							fontWeight: "bold",
							color: "#1f2937",
						}}>
						🎯 Course Features
					</h2>
					<ul
						style={{
							margin: 0,
							padding: "0 0 0 1.5rem",
							listStyle: "none",
						}}>
						{[
							"Interactive assignments",
							"Attendance tracking",
							"Performance grades",
							"Completion certificate",
							"Student support",
							"Resource library access",
						].map((item, idx) => (
							<li
								key={idx}
								style={{
									margin: "0.8rem 0",
									color: "#6b7280",
									fontSize: "0.95rem",
									lineHeight: "1.5",
								}}>
								★ {item}
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Payment Modal */}
			{paymentModalOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: "rgba(0, 0, 0, 0.6)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
						padding: "1rem",
					}}>
					<div
						style={{
							background: "white",
							borderRadius: "15px",
							padding: "2rem",
							maxWidth: "500px",
							width: "100%",
							boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
						}}>
						<h2
							style={{
								margin: "0 0 1rem 0",
								fontSize: "1.8rem",
								fontWeight: "bold",
								color: "#1f2937",
							}}>
							Complete Payment
						</h2>

						<div
							style={{
								background: "rgba(0, 102, 204, 0.1)",
								borderLeft: "4px solid #0066cc",
								padding: "1rem",
								marginBottom: "2rem",
								borderRadius: "8px",
							}}>
							<p
								style={{
									margin: "0 0 0.5rem 0",
									color: "#6b7280",
									fontSize: "0.9rem",
								}}>
								Course: <strong>{course.title}</strong>
							</p>
							<p
								style={{
									margin: 0,
									fontSize: "1.5rem",
									fontWeight: "bold",
									color: "#0066cc",
								}}>
								Amount: ₦{course.price?.toLocaleString()}
							</p>
						</div>

						<div style={{ marginBottom: "2rem" }}>
							<label
								style={{
									display: "block",
									marginBottom: "0.5rem",
									fontWeight: "600",
									color: "#374151",
									fontSize: "0.9rem",
								}}>
								Select Payment Method
							</label>
							<select
								value={paymentMethod}
								onChange={(e) => setPaymentMethod(e.target.value)}
								style={{
									width: "100%",
									padding: "0.8rem",
									borderRadius: "8px",
									border: "1px solid #d1d5db",
									fontSize: "0.95rem",
									cursor: "pointer",
								}}>
								<option value="paystack">Paystack</option>
								<option value="stripe">Stripe</option>
								<option value="bank-transfer">Bank Transfer</option>
							</select>
						</div>

						<div
							style={{
								display: "flex",
								gap: "1rem",
							}}>
							<button
								onClick={() => setPaymentModalOpen(false)}
								style={{
									flex: 1,
									padding: "0.8rem",
									background: "#e5e7eb",
									border: "none",
									borderRadius: "8px",
									cursor: "pointer",
									fontWeight: "600",
									color: "#374151",
									transition: "all 0.3s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = "#d1d5db";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = "#e5e7eb";
								}}>
								Cancel
							</button>
							<button
								onClick={handleConfirmPayment}
								style={{
									flex: 1,
									padding: "0.8rem",
									background:
										"linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
									color: "white",
									border: "none",
									borderRadius: "8px",
									cursor: "pointer",
									fontWeight: "600",
									transition: "all 0.3s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "scale(1.05)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "scale(1)";
								}}>
								Confirm Payment
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CourseDetail;
