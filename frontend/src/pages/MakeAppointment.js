import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
	Calendar,
	CreditCard,
	User,
	X,
	CheckCircle,
	CaretRight,
	CaretLeft,
	Info,
	Clock,
	BookOpen,
} from "phosphor-react";
import { appointmentAPI, paymentAPI, courseAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const MakeAppointment = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		service: "",
		appointmentDate: "",
		timeSlot: "",
		description: "",
		userEmail: user?.email || "",
		courseId: "",
	});

	const [currentStep, setCurrentStep] = useState(1);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [appointmentData, setAppointmentData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [cardError, setCardError] = useState("");

	const services = [
		{ name: "Strategic Planning", price: 199.99, icon: "📈" },
		{ name: "Business Development", price: 179.99, icon: "🚀" },
		{ name: "Market Analysis", price: 149.99, icon: "📊" },
		{ name: "Organizational Design", price: 189.99, icon: "🏢" },
		{ name: "Digital Transformation", price: 229.99, icon: "💻" },
		{ name: "Change Management", price: 169.99, icon: "🔄" },
	];

	const timeSlots = [
		"09:00 AM",
		"10:00 AM",
		"11:00 AM",
		"02:00 PM",
		"03:00 PM",
		"04:00 PM",
	];

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await courseAPI.getMyEnrolledCourses();
				setEnrolledCourses(res.data || []);
			} catch (err) {
				console.error("Error fetching enrolled courses:", err);
			}
		};
		if (user) fetchCourses();
	}, [user]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleNextStep = () => {
		if (currentStep === 1 && !formData.service) {
			setError("Please select a service");
			return;
		}
		setError("");
		setCurrentStep(currentStep + 1);
	};

	const handlePrevStep = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleSubmitAppointment = async (e) => {
		e.preventDefault();
		if (!formData.appointmentDate || !formData.timeSlot) {
			setError("Please select both date and time slot");
			return;
		}
		setError("");
		setLoading(true);

		try {
			const createdAppointment =
				await appointmentAPI.createAppointment(formData);
			setAppointmentData(createdAppointment.data.appointment);
			setCurrentStep(3);
		} catch (err) {
			setError(err.response?.data?.message || "Error creating appointment");
		} finally {
			setLoading(false);
		}
	};

	const handlePayment = async (e) => {
		e.preventDefault();
		setCardError("");
		setLoading(true);

		try {
			const service = services.find((s) => s.name === appointmentData.service);
			const amount = service ? service.price : 199.99;

			const paymentResponse = await paymentAPI.createPaymentIntent({
				amount,
				appointmentId: appointmentData.id || appointmentData._id,
				email: user?.email || formData.userEmail,
				fullName: user?.name || "Customer",
			});

			if (paymentResponse.authorization_url) {
				window.location.href = paymentResponse.authorization_url;
			} else {
				setCardError("Failed to initialize payment");
			}
		} catch (err) {
			setCardError(
				err.response?.data?.message || "Payment initialization failed",
			);
		} finally {
			setLoading(false);
		}
	};

	const stepStyles = {
		container: {
			maxWidth: "900px",
			margin: "0 auto",
			animation: "fadeIn 0.5s ease",
		},
		stepIndicator: {
			display: "flex",
			justifyContent: "center",
			marginBottom: "3rem",
			gap: "1rem",
		},
		indicator: (active) => ({
			width: "40px",
			height: "40px",
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			background: active ? "#0066cc" : "#e2e8f0",
			color: active ? "white" : "#64748b",
			fontWeight: "bold",
			transition: "all 0.3s ease",
		}),
		card: {
			background: "white",
			borderRadius: "24px",
			padding: "3rem",
			boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
			border: "1px solid #f1f5f9",
		},
	};

	return (
		<div style={stepStyles.container}>
			{/* Steps Indicator */}
			<div style={stepStyles.stepIndicator}>
				{[1, 2, 3].map((s) => (
					<div key={s} style={{ display: "flex", alignItems: "center" }}>
						<div style={stepStyles.indicator(currentStep >= s)}>
							{s === 3 && currentStep === 3 ? <CheckCircle size={20} /> : s}
						</div>
						{s < 3 && (
							<div
								style={{
									width: "40px",
									h: "2px",
									background: currentStep > s ? "#0066cc" : "#e2e8f0",
									margin: "0 0.5rem",
								}}
							/>
						)}
					</div>
				))}
			</div>

			<div style={stepStyles.card}>
				{error && (
					<div
						style={{
							background: "#fef2f2",
							border: "1px solid #fee2e2",
							color: "#dc2626",
							padding: "1rem",
							borderRadius: "12px",
							marginBottom: "2rem",
							display: "flex",
							alignItems: "center",
							gap: "0.75rem",
						}}>
						<X size={20} weight="bold" />
						{error}
					</div>
				)}

				{/* Step 1: Select Service */}
				{currentStep === 1 && (
					<div>
						<h2
							style={{
								fontSize: "1.8rem",
								fontWeight: "800",
								color: "#1e293b",
								marginBottom: "0.5rem",
							}}>
							Select Service
						</h2>
						<p style={{ color: "#64748b", marginBottom: "2rem" }}>
							Which area of expertise do you need help with?
						</p>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
								gap: "1.5rem",
							}}>
							{services.map((s) => (
								<div
									key={s.name}
									onClick={() => setFormData({ ...formData, service: s.name })}
									style={{
										padding: "1.5rem",
										borderRadius: "16px",
										border: `2px solid ${formData.service === s.name ? "#0066cc" : "#f1f5f9"}`,
										background:
											formData.service === s.name ? "#eff6ff" : "white",
										cursor: "pointer",
										transition: "all 0.2s ease",
										textAlign: "center",
									}}
									onMouseEnter={(e) => {
										if (formData.service !== s.name)
											e.currentTarget.style.borderColor = "#cbd5e1";
									}}
									onMouseLeave={(e) => {
										if (formData.service !== s.name)
											e.currentTarget.style.borderColor = "#f1f5f9";
									}}>
									<div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
										{s.icon}
									</div>
									<h3
										style={{
											fontSize: "1.1rem",
											fontWeight: "700",
											marginBottom: "0.5rem",
											color: "#1e293b",
										}}>
										{s.name}
									</h3>
									<p style={{ fontWeight: "600", color: "#0066cc" }}>
										₦{(s.price * 1500).toLocaleString()}
									</p>
								</div>
							))}
						</div>

						<div
							style={{
								marginTop: "3rem",
								display: "flex",
								justifyContent: "flex-end",
							}}>
							<button
								onClick={handleNextStep}
								style={{
									padding: "1rem 2.5rem",
									background: "#0066cc",
									color: "white",
									border: "none",
									borderRadius: "12px",
									fontWeight: "700",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
								}}>
								Continue <CaretRight size={20} />
							</button>
						</div>
					</div>
				)}

				{/* Step 2: Details */}
				{currentStep === 2 && (
					<form onSubmit={handleSubmitAppointment}>
						<h2
							style={{
								fontSize: "1.8rem",
								fontWeight: "800",
								color: "#1e293b",
								marginBottom: "0.5rem",
							}}>
							Appointment Details
						</h2>
						<p style={{ color: "#64748b", marginBottom: "2rem" }}>
							Provide more information about your consultation needs.
						</p>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "1.5rem",
							}}>
							{/* Course Selection */}
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										fontWeight: "600",
										color: "#475569",
									}}>
									<BookOpen
										size={18}
										style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
									/>
									Related Course (Optional)
								</label>
								<select
									name="courseId"
									value={formData.courseId}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "1rem",
										borderRadius: "12px",
										border: "1px solid #e2e8f0",
										background: "#f8fafc",
									}}>
									<option value="">-- Select a course if applicable --</option>
									{enrolledCourses.map((enr) => (
										<option key={enr._id} value={enr.course?._id}>
											{enr.course?.title}
										</option>
									))}
								</select>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "1.5rem",
								}}>
								<div>
									<label
										style={{
											display: "block",
											marginBottom: "0.5rem",
											fontWeight: "600",
											color: "#475569",
										}}>
										<Calendar
											size={18}
											style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
										/>
										Preferred Date
									</label>
									<input
										type="date"
										name="appointmentDate"
										required
										value={formData.appointmentDate}
										onChange={handleChange}
										style={{
											width: "100%",
											padding: "1rem",
											borderRadius: "12px",
											border: "1px solid #e2e8f0",
											background: "#f8fafc",
										}}
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											marginBottom: "0.5rem",
											fontWeight: "600",
											color: "#475569",
										}}>
										<Clock
											size={18}
											style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
										/>
										Time Slot
									</label>
									<select
										name="timeSlot"
										required
										value={formData.timeSlot}
										onChange={handleChange}
										style={{
											width: "100%",
											padding: "1rem",
											borderRadius: "12px",
											border: "1px solid #e2e8f0",
											background: "#f8fafc",
										}}>
										<option value="">Select Time</option>
										{timeSlots.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										fontWeight: "600",
										color: "#475569",
									}}>
									<Info
										size={18}
										style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
									/>
									Description / Topic
								</label>
								<textarea
									name="description"
									rows="4"
									placeholder="What would you like to discuss?"
									value={formData.description}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "1rem",
										borderRadius: "12px",
										border: "1px solid #e2e8f0",
										background: "#f8fafc",
										resize: "none",
									}}
								/>
							</div>
						</div>

						<div
							style={{
								marginTop: "3rem",
								display: "flex",
								justifyContent: "space-between",
							}}>
							<button
								type="button"
								onClick={handlePrevStep}
								style={{
									padding: "1rem 2rem",
									background: "white",
									border: "1px solid #e2e8f0",
									borderRadius: "12px",
									fontWeight: "600",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
								}}>
								<CaretLeft size={20} /> Back
							</button>
							<button
								type="submit"
								disabled={loading}
								style={{
									padding: "1rem 2.5rem",
									background: "#0066cc",
									color: "white",
									border: "none",
									borderRadius: "12px",
									fontWeight: "700",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
									opacity: loading ? 0.7 : 1,
								}}>
								{loading ? "Please wait..." : "Proceed to Payment"}{" "}
								<CaretRight size={20} />
							</button>
						</div>
					</form>
				)}

				{/* Step 3: Payment */}
				{currentStep === 3 && (
					<div style={{ textAlign: "center" }}>
						<div
							style={{
								width: "80px",
								height: "80px",
								background: "#eff6ff",
								borderRadius: "20px",
								display: "flex",
								alignItems: "center",
								justify: "center",
								margin: "0 auto 1.5rem",
								color: "#0066cc",
							}}>
							<CreditCard size={40} weight="fill" />
						</div>
						<h2
							style={{
								fontSize: "1.8rem",
								fontWeight: "800",
								color: "#1e293b",
								marginBottom: "1rem",
							}}>
							Complete Payment
						</h2>

						<div
							style={{
								background: "#f8fafc",
								padding: "2rem",
								borderRadius: "20px",
								marginBottom: "2rem",
								textAlign: "left",
							}}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "1rem",
									paddingBottom: "1rem",
									borderBottom: "1px solid #e2e8f0",
								}}>
								<span style={{ color: "#64748b" }}>Service</span>
								<span style={{ fontWeight: "700" }}>
									{appointmentData?.service}
								</span>
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "1rem",
									paddingBottom: "1rem",
									borderBottom: "1px solid #e2e8f0",
								}}>
								<span style={{ color: "#64748b" }}>Scheduled For</span>
								<span style={{ fontWeight: "700" }}>
									{new Date(
										appointmentData?.appointmentDate,
									).toLocaleDateString()}{" "}
									at {appointmentData?.timeSlot}
								</span>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<span style={{ color: "#64748b", fontSize: "1.2rem" }}>
									Total Amount
								</span>
								<span
									style={{
										fontSize: "1.5rem",
										fontWeight: "900",
										color: "#0066cc",
									}}>
									₦
									{(
										services.find((s) => s.name === appointmentData?.service)
											?.price * 1500 || 0
									).toLocaleString()}
								</span>
							</div>
						</div>

						{cardError && (
							<div
								style={{
									color: "#dc2626",
									marginBottom: "1.5rem",
									background: "#fef2f2",
									padding: "1rem",
									borderRadius: "12px",
								}}>
								{cardError}
							</div>
						)}

						<button
							onClick={handlePayment}
							disabled={loading}
							style={{
								width: "100%",
								padding: "1.25rem",
								background: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
								color: "white",
								border: "none",
								borderRadius: "12px",
								fontWeight: "800",
								fontSize: "1.1rem",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "0.75rem",
								boxShadow: "0 10px 25px rgba(0, 102, 204, 0.3)",
								opacity: loading ? 0.7 : 1,
							}}>
							{loading
								? "Initializing Paystack..."
								: "Secure Checkout with Paystack"}
						</button>

						<p
							style={{
								marginTop: "1.5rem",
								color: "#64748b",
								fontSize: "0.85rem",
							}}>
							Secure payment powered by Paystack. Your session is protected.
						</p>
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

export default MakeAppointment;
