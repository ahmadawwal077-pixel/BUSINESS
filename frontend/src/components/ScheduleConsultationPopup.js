import React, { useState } from "react";
import { consultationAPI } from "../services/api";

const ScheduleConsultationPopup = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		company: "",
		serviceType: "general",
		preferredDate: "",
		preferredTime: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.fullName || !formData.email || !formData.phone) {
			setError("Please fill in all required fields");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response =
				await consultationAPI.submitConsultationRequest(formData);

			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
				setFormData({
					fullName: "",
					email: "",
					phone: "",
					company: "",
					serviceType: "general",
					preferredDate: "",
					preferredTime: "",
					message: "",
				});
				onClose();
			}, 2000);
		} catch (err) {
			console.error("✗ Error:", err);
			const msg =
				err.response?.data?.message ||
				err.message ||
				"Failed to submit. Please try again.";
			setError(msg);
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	// Success screen
	if (success) {
		return (
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 10000,
				}}>
				<div
					style={{
						background: "white",
						borderRadius: "16px",
						padding: "40px",
						textAlign: "center",
						maxWidth: "400px",
						boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
						animation: "slideUp 0.3s ease-out",
					}}>
					<div
						style={{
							fontSize: "60px",
							marginBottom: "20px",
							animation: "scaleIn 0.5s ease-out",
						}}>
						✓
					</div>
					<h2
						style={{
							color: "#1f2937",
							marginBottom: "10px",
							fontSize: "24px",
							fontWeight: "700",
						}}>
						Success!
					</h2>
					<p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "0" }}>
						Thank you! Your consultation request has been received. We'll
						contact you shortly.
					</p>
					<style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
				</div>
			</div>
		);
	}

	// Form screen
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.6)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 10000,
				padding: "20px",
				backdropFilter: "blur(2px)",
			}}>
			<style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .form-container { animation: slideInUp 0.4s ease-out; }
        .form-input, .form-select, .form-textarea {
          transition: all 0.3s ease;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          background: white;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
          outline: none;
        }
        .form-label { font-weight: 600; color: #1f2937; font-size: 13px; letter-spacing: 0.5px; }
        .form-required { color: #ef4444; font-weight: 700; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

			<div
				className="form-container"
				style={{
					background: "white",
					borderRadius: "20px",
					width: "100%",
					maxWidth: "600px",
					maxHeight: "95vh",
					overflow: "auto",
					boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
				}}>
				{/* Header */}
				<div
					style={{
						background:
							"linear-gradient(135deg, #0066cc 0%, #0052a3 50%, #00b4d8 100%)",
						color: "white",
						padding: "40px 30px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						position: "relative",
						overflow: "hidden",
					}}>
					<div style={{ zIndex: 2 }}>
						<h2
							style={{
								margin: "0 0 8px 0",
								fontSize: "28px",
								fontWeight: "800",
								letterSpacing: "-0.5px",
							}}>
							Schedule a Consultation
						</h2>
						<p
							style={{
								margin: 0,
								opacity: 0.9,
								fontSize: "14px",
								fontWeight: "500",
							}}>
							Get expert guidance tailored to your needs
						</p>
					</div>
					<button
						onClick={onClose}
						style={{
							background: "rgba(255, 255, 255, 0.15)",
							border: "none",
							color: "white",
							fontSize: "28px",
							cursor: "pointer",
							width: "40px",
							height: "40px",
							borderRadius: "8px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transition: "all 0.2s ease",
							zIndex: 3,
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
							e.currentTarget.style.transform = "scale(1.1)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
							e.currentTarget.style.transform = "scale(1)";
						}}>
						×
					</button>
					<div
						style={{
							position: "absolute",
							top: "-50%",
							right: "-10%",
							width: "300px",
							height: "300px",
							background: "rgba(255, 255, 255, 0.1)",
							borderRadius: "50%",
							zIndex: 1,
						}}
					/>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} style={{ padding: "40px" }}>
					{/* Error Message */}
					{error && (
						<div
							className={error ? "error-shake" : ""}
							style={{
								background: "#fef2f2",
								border: "1.5px solid #fca5a5",
								borderLeft: "4px solid #ef4444",
								color: "#991b1b",
								padding: "14px 16px",
								borderRadius: "10px",
								marginBottom: "28px",
								fontSize: "14px",
								fontWeight: "500",
								display: "flex",
								alignItems: "center",
								gap: "10px",
							}}>
							<span style={{ fontSize: "18px" }}>⚠️</span>
							{error}
						</div>
					)}

					{/* Row 1: Name & Email */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "20px",
							marginBottom: "24px",
						}}>
						<div>
							<label
								className="form-label"
								style={{ display: "block", marginBottom: "8px" }}>
								Full Name <span className="form-required">*</span>
							</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								placeholder="John Doe"
								className="form-input"
								style={{
									width: "100%",
									padding: "12px 14px",
									borderRadius: "10px",
									fontSize: "14px",
									boxSizing: "border-box",
									fontFamily: "inherit",
								}}
							/>
						</div>
						<div>
							<label
								className="form-label"
								style={{ display: "block", marginBottom: "8px" }}>
								Email Address <span className="form-required">*</span>
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="john@company.com"
								className="form-input"
								style={{
									width: "100%",
									padding: "12px 14px",
									borderRadius: "10px",
									fontSize: "14px",
									boxSizing: "border-box",
									fontFamily: "inherit",
								}}
							/>
						</div>
					</div>

					{/* Row 2: Phone & Company */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "20px",
							marginBottom: "24px",
						}}>
						<div>
							<label
								className="form-label"
								style={{ display: "block", marginBottom: "8px" }}>
								Phone Number <span className="form-required">*</span>
							</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								placeholder="+1 (555) 123-4567"
								className="form-input"
								style={{
									width: "100%",
									padding: "12px 14px",
									borderRadius: "10px",
									fontSize: "14px",
									boxSizing: "border-box",
									fontFamily: "inherit",
								}}
							/>
						</div>
						<div>
							<label
								className="form-label"
								style={{ display: "block", marginBottom: "8px" }}>
								Company Name
							</label>
							<input
								type="text"
								name="company"
								value={formData.company}
								onChange={handleChange}
								placeholder="Your Company"
								className="form-input"
								style={{
									width: "100%",
									padding: "12px 14px",
									borderRadius: "10px",
									fontSize: "14px",
									boxSizing: "border-box",
									fontFamily: "inherit",
								}}
							/>
						</div>
					</div>

					{/* Row 3: Service Type */}
					<div style={{ marginBottom: "24px" }}>
						<label
							className="form-label"
							style={{ display: "block", marginBottom: "8px" }}>
							Service Type <span className="form-required">*</span>
						</label>
						<select
							name="serviceType"
							value={formData.serviceType}
							onChange={handleChange}
							className="form-select"
							style={{
								width: "100%",
								padding: "12px 14px",
								borderRadius: "10px",
								fontSize: "14px",
								boxSizing: "border-box",
								fontFamily: "inherit",
								backgroundColor: "#f9fafb",
							}}>
							<option value="general">General Consultation</option>
							<option value="business">Business Strategy</option>
							<option value="technical">Technical Assessment</option>
							<option value="training">Training & Development</option>
							<option value="implementation">Implementation Support</option>
							<option value="other">Other</option>
						</select>
					</div>

					{/* Row 4: Date & Time */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "20px",
							marginBottom: "24px",
						}}>
						<div>
							<label
								className="form-label"
								style={{ display: "block", marginBottom: "8px" }}>
								Preferred Date
							</label>
							<input
								type="date"
								name="preferredDate"
								value={formData.preferredDate}
								onChange={handleChange}
								className="form-input"
								style={{
									width: "100%",
									padding: "12px 14px",
									borderRadius: "10px",
									fontSize: "14px",
									boxSizing: "border-box",
									fontFamily: "inherit",
								}}
							/>
						</div>
						<div>
							<label
								className="form-label"
								style={{ display: "block", marginBottom: "8px" }}>
								Preferred Time
							</label>
							<input
								type="time"
								name="preferredTime"
								value={formData.preferredTime}
								onChange={handleChange}
								className="form-input"
								style={{
									width: "100%",
									padding: "12px 14px",
									borderRadius: "10px",
									fontSize: "14px",
									boxSizing: "border-box",
									fontFamily: "inherit",
								}}
							/>
						</div>
					</div>

					{/* Message */}
					<div style={{ marginBottom: "24px" }}>
						<label
							className="form-label"
							style={{ display: "block", marginBottom: "8px" }}>
							Tell us about your needs
						</label>
						<textarea
							name="message"
							value={formData.message}
							onChange={handleChange}
							placeholder="Describe your project goals, challenges, and requirements..."
							rows="4"
							className="form-textarea"
							style={{
								width: "100%",
								padding: "12px 14px",
								borderRadius: "10px",
								fontSize: "14px",
								boxSizing: "border-box",
								fontFamily: "inherit",
								resize: "vertical",
								minHeight: "100px",
							}}
						/>
					</div>

					{/* Info Box */}
					<div
						style={{
							background:
								"linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(0, 180, 216, 0.05) 100%)",
							borderLeft: "3px solid #0066cc",
							borderRadius: "10px",
							padding: "14px 16px",
							marginBottom: "28px",
							fontSize: "13px",
							fontWeight: "500",
							color: "#1f2937",
						}}>
						<p
							style={{
								margin: 0,
								display: "flex",
								alignItems: "center",
								gap: "8px",
							}}>
							<span style={{ fontSize: "16px" }}>ℹ️</span>
							We'll review your request and contact you within 24 hours to
							confirm your consultation.
						</p>
					</div>

					{/* Buttons */}
					<div style={{ display: "flex", gap: "12px" }}>
						<button
							type="submit"
							disabled={loading}
							style={{
								flex: 1,
								padding: "14px 20px",
								background: loading
									? "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)"
									: "linear-gradient(135deg, #0066cc 0%, #0052a3 50%, #00b4d8 100%)",
								color: "white",
								border: "none",
								borderRadius: "10px",
								fontWeight: "700",
								fontSize: "15px",
								cursor: loading ? "not-allowed" : "pointer",
								transition: "all 0.3s ease",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
								letterSpacing: "0.3px",
								boxShadow: loading
									? "none"
									: "0 4px 15px rgba(0, 102, 204, 0.3)",
							}}
							onMouseEnter={(e) => {
								if (!loading) {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow =
										"0 8px 25px rgba(0, 102, 204, 0.4)";
								}
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow =
									"0 4px 15px rgba(0, 102, 204, 0.3)";
							}}>
							{loading ? (
								<>
									<span
										style={{
											display: "inline-block",
											width: "14px",
											height: "14px",
											border: "2px solid rgba(255, 255, 255, 0.3)",
											borderTop: "2px solid white",
											borderRadius: "50%",
											animation: "spin 0.8s linear infinite",
										}}
									/>
									Submitting...
								</>
							) : (
								<>
									<span>✓</span> Schedule Consultation
								</>
							)}
						</button>
						<button
							type="button"
							onClick={onClose}
							style={{
								padding: "14px 24px",
								background: "#f3f4f6",
								color: "#374151",
								border: "1.5px solid #e5e7eb",
								borderRadius: "10px",
								fontWeight: "600",
								fontSize: "15px",
								cursor: "pointer",
								transition: "all 0.3s ease",
								letterSpacing: "0.3px",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = "#e5e7eb";
								e.currentTarget.style.transform = "translateY(-1px)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "#f3f4f6";
								e.currentTarget.style.transform = "translateY(0)";
							}}>
							Cancel
						</button>
					</div>

					<style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
				</form>
			</div>
		</div>
	);
};

export default ScheduleConsultationPopup;
