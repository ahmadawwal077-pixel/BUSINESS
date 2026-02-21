import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
	const { register } = useContext(AuthContext);
	const location = useLocation();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);

		try {
			await register(formData.name, formData.email, formData.password);
			setSuccess(
				"Account created successfully! Please check your email to verify your account.",
			);
			setFormData({
				name: "",
				email: "",
				password: "",
				confirmPassword: "",
			});
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					padding: "2rem",
				}}>
				<div
					style={{
						background: "white",
						padding: "3rem",
						borderRadius: "20px",
						textAlign: "center",
						boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
						maxWidth: "500px",
						width: "100%",
					}}>
					<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📧</div>
					<h2
						style={{
							color: "#10b981",
							marginBottom: "1rem",
							fontSize: "1.8rem",
						}}>
						Verify Your Email
					</h2>
					<p
						style={{
							color: "#6b7280",
							marginBottom: "2rem",
							fontSize: "1rem",
						}}>
						{success}
					</p>
					<p
						style={{
							color: "#6b7280",
							marginBottom: "2rem",
							fontSize: "0.95rem",
						}}>
						Check your inbox (and spam folder) for a verification link. Click
						the link to activate your account.
					</p>
					<div
						style={{
							display: "flex",
							gap: "1rem",
							justifyContent: "center",
							flexWrap: "wrap",
						}}>
						<Link
							to="/login"
							state={{ from: location.state?.from }}
							style={{
								display: "inline-block",
								background: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
								color: "white",
								padding: "0.9rem 2rem",
								borderRadius: "10px",
								textDecoration: "none",
								fontWeight: "600",
								transition: "transform 0.3s ease, box-shadow 0.3s ease",
								cursor: "pointer",
								border: "none",
								fontSize: "1rem",
							}}
							onMouseEnter={(e) => {
								e.target.style.transform = "translateY(-2px)";
								e.target.style.boxShadow = "0 10px 20px rgba(0, 102, 204, 0.3)";
							}}
							onMouseLeave={(e) => {
								e.target.style.transform = "translateY(0)";
								e.target.style.boxShadow = "none";
							}}>
							Go to Login
						</Link>
						<button
							onClick={() => {
								setSuccess("");
								setFormData({
									name: "",
									email: "",
									password: "",
									confirmPassword: "",
								});
							}}
							style={{
								display: "inline-block",
								background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
								color: "white",
								padding: "0.9rem 2rem",
								borderRadius: "10px",
								fontWeight: "600",
								transition: "transform 0.3s ease, box-shadow 0.3s ease",
								cursor: "pointer",
								border: "none",
								fontSize: "1rem",
							}}
							onMouseEnter={(e) => {
								e.target.style.transform = "translateY(-2px)";
								e.target.style.boxShadow =
									"0 10px 20px rgba(107, 114, 128, 0.3)";
							}}
							onMouseLeave={(e) => {
								e.target.style.transform = "translateY(0)";
								e.target.style.boxShadow = "none";
							}}>
							Create Another Account
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				padding: "2rem",
				position: "relative",
				overflow: "hidden",
			}}>
			{/* Background decorative elements */}
			<div
				style={{
					position: "absolute",
					top: "-100px",
					right: "-100px",
					width: "300px",
					height: "300px",
					borderRadius: "50%",
					background: "rgba(255, 255, 255, 0.1)",
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "-50px",
					left: "-50px",
					width: "250px",
					height: "250px",
					borderRadius: "50%",
					background: "rgba(255, 255, 255, 0.05)",
					pointerEvents: "none",
				}}
			/>

			<div
				style={{
					width: "100%",
					maxWidth: "500px",
					position: "relative",
					zIndex: 1,
				}}>
				{/* Card Container */}
				<div
					style={{
						background: "white",
						borderRadius: "20px",
						boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
						overflow: "hidden",
					}}>
					{/* Header */}
					<div
						style={{
							background: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
							padding: "3rem 2rem",
							textAlign: "center",
							color: "white",
						}}>
						<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
						<h1
							style={{
								margin: "0 0 0.5rem 0",
								fontSize: "2rem",
								fontWeight: "bold",
							}}>
							Create Account
						</h1>
						<p style={{ margin: 0, opacity: 0.95, fontSize: "0.95rem" }}>
							Join our community today
						</p>
					</div>

					{/* Form Container */}
					<div style={{ padding: "3rem 2rem" }}>
						{error && (
							<div
								style={{
									background:
										"linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
									color: "white",
									padding: "1rem",
									borderRadius: "12px",
									marginBottom: "1.5rem",
									fontSize: "0.9rem",
									fontWeight: "500",
									border: "1px solid rgba(255, 255, 255, 0.2)",
								}}>
								❌ {error}
							</div>
						)}

						<form onSubmit={handleSubmit}>
							{/* Full Name Field */}
							<div style={{ marginBottom: "1.5rem" }}>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										fontWeight: "600",
										color: "#1f2937",
										fontSize: "0.95rem",
									}}>
									Full Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="John Doe"
									required
									style={{
										width: "100%",
										padding: "0.9rem 1rem",
										border: "2px solid #e5e7eb",
										borderRadius: "10px",
										fontSize: "0.95rem",
										transition: "all 0.3s ease",
										boxSizing: "border-box",
										fontFamily: "inherit",
									}}
									onFocus={(e) => {
										e.target.style.borderColor = "#0066cc";
										e.target.style.boxShadow =
											"0 0 0 3px rgba(0, 102, 204, 0.1)";
									}}
									onBlur={(e) => {
										e.target.style.borderColor = "#e5e7eb";
										e.target.style.boxShadow = "none";
									}}
								/>
							</div>

							{/* Email Field */}
							<div style={{ marginBottom: "1.5rem" }}>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										fontWeight: "600",
										color: "#1f2937",
										fontSize: "0.95rem",
									}}>
									Email Address
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="you@example.com"
									required
									style={{
										width: "100%",
										padding: "0.9rem 1rem",
										border: "2px solid #e5e7eb",
										borderRadius: "10px",
										fontSize: "0.95rem",
										transition: "all 0.3s ease",
										boxSizing: "border-box",
										fontFamily: "inherit",
									}}
									onFocus={(e) => {
										e.target.style.borderColor = "#0066cc";
										e.target.style.boxShadow =
											"0 0 0 3px rgba(0, 102, 204, 0.1)";
									}}
									onBlur={(e) => {
										e.target.style.borderColor = "#e5e7eb";
										e.target.style.boxShadow = "none";
									}}
								/>
							</div>

							{/* Password Field */}
							<div style={{ marginBottom: "1.5rem" }}>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										fontWeight: "600",
										color: "#1f2937",
										fontSize: "0.95rem",
									}}>
									Password
								</label>
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="••••••••"
									required
									style={{
										width: "100%",
										padding: "0.9rem 1rem",
										border: "2px solid #e5e7eb",
										borderRadius: "10px",
										fontSize: "0.95rem",
										transition: "all 0.3s ease",
										boxSizing: "border-box",
										fontFamily: "inherit",
									}}
									onFocus={(e) => {
										e.target.style.borderColor = "#0066cc";
										e.target.style.boxShadow =
											"0 0 0 3px rgba(0, 102, 204, 0.1)";
									}}
									onBlur={(e) => {
										e.target.style.borderColor = "#e5e7eb";
										e.target.style.boxShadow = "none";
									}}
								/>
							</div>

							{/* Confirm Password Field */}
							<div style={{ marginBottom: "2rem" }}>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										fontWeight: "600",
										color: "#1f2937",
										fontSize: "0.95rem",
									}}>
									Confirm Password
								</label>
								<input
									type="password"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder="••••••••"
									required
									style={{
										width: "100%",
										padding: "0.9rem 1rem",
										border: "2px solid #e5e7eb",
										borderRadius: "10px",
										fontSize: "0.95rem",
										transition: "all 0.3s ease",
										boxSizing: "border-box",
										fontFamily: "inherit",
									}}
									onFocus={(e) => {
										e.target.style.borderColor = "#0066cc";
										e.target.style.boxShadow =
											"0 0 0 3px rgba(0, 102, 204, 0.1)";
									}}
									onBlur={(e) => {
										e.target.style.borderColor = "#e5e7eb";
										e.target.style.boxShadow = "none";
									}}
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loading}
								style={{
									width: "100%",
									padding: "0.95rem",
									background: loading
										? "#cbd5e1"
										: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
									color: "white",
									border: "none",
									borderRadius: "10px",
									fontSize: "1rem",
									fontWeight: "600",
									cursor: loading ? "not-allowed" : "pointer",
									transition: "all 0.3s ease",
									marginBottom: "1rem",
								}}
								onMouseEnter={(e) => {
									if (!loading) {
										e.target.style.transform = "translateY(-2px)";
										e.target.style.boxShadow =
											"0 10px 20px rgba(0, 102, 204, 0.3)";
									}
								}}
								onMouseLeave={(e) => {
									if (!loading) {
										e.target.style.transform = "translateY(0)";
										e.target.style.boxShadow = "none";
									}
								}}>
								{loading ? "Creating account..." : "Create Account"}
							</button>

							{/* Divider */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									margin: "2rem 0",
									color: "#9ca3af",
									fontSize: "0.9rem",
								}}>
								<div
									style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
								/>
								<span style={{ padding: "0 1rem" }}>
									Already have an account?
								</span>
								<div
									style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
								/>
							</div>

							{/* Sign In Link */}
							<Link
								to="/login"
								state={{ from: location.state?.from }}
								style={{
									display: "block",
									textAlign: "center",
									padding: "0.95rem",
									border: "2px solid #0066cc",
									color: "#0066cc",
									textDecoration: "none",
									borderRadius: "10px",
									fontWeight: "600",
									transition: "all 0.3s ease",
									fontSize: "1rem",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = "rgba(0, 102, 204, 0.1)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = "transparent";
								}}>
								Sign In to Existing Account
							</Link>
						</form>
					</div>
				</div>

				{/* Footer Text */}
				<p
					style={{
						textAlign: "center",
						color: "rgba(255, 255, 255, 0.8)",
						marginTop: "2rem",
						fontSize: "0.9rem",
					}}>
					By creating an account, you agree to our Terms of Service and Privacy
					Policy
				</p>
			</div>
		</div>
	);
};

export default Register;
