import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { appointmentAPI } from "../services/api";
import alertService from "../utils/alertService";

const Appointments = () => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const response = await appointmentAPI.getUserAppointments();
			setAppointments(response.data);
		} catch (error) {
			console.error("Error fetching appointments:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = async (id) => {
		const result = await alertService.confirm(
			"Cancel Appointment?",
			"Are you sure you want to cancel this appointment?",
			"Yes, Cancel",
		);

		if (result.isConfirmed) {
			try {
				await appointmentAPI.cancelAppointment(id);
				setAppointments(
					appointments.map((apt) =>
						apt._id === id ? { ...apt, status: "cancelled" } : apt,
					),
				);
			} catch (error) {
				console.error("Error canceling appointment:", error);
			}
		}
	};

	const filteredAppointments = appointments.filter((apt) => {
		if (filter === "all") return true;
		return apt.status === filter;
	});

	const getStatusColor = (status) => {
		const colors = {
			confirmed: {
				bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
				text: "white",
				border: "#10b981",
				icon: "✅",
			},
			pending: {
				bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
				text: "white",
				border: "#f59e0b",
				icon: "⏳",
			},
			cancelled: {
				bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
				text: "white",
				border: "#ef4444",
				icon: "❌",
			},
		};
		return colors[status] || colors.pending;
	};

	if (loading) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				}}>
				<div
					style={{
						background: "white",
						padding: "3rem",
						borderRadius: "15px",
						textAlign: "center",
						boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
					}}>
					<p style={{ fontSize: "1.2rem", color: "#6b7280", margin: 0 }}>
						⏳ Loading your appointments...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				padding: "3rem 2rem",
			}}>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
				}}>
				{/* Header */}
				<div
					style={{
						background: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
						borderRadius: "20px",
						padding: "3rem 2rem",
						color: "white",
						marginBottom: "3rem",
						boxShadow: "0 10px 40px rgba(0, 102, 204, 0.2)",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "2rem",
					}}>
					<div>
						<h1
							style={{
								margin: "0 0 0.5rem 0",
								fontSize: "2.5rem",
								fontWeight: "bold",
							}}>
							📅 My Appointments
						</h1>
						<p
							style={{
								margin: 0,
								fontSize: "1.05rem",
								opacity: 0.95,
							}}>
							Manage and track all your scheduled consultations
						</p>
					</div>
					<Link
						to="/make-appointment"
						style={{
							padding: "0.9rem 1.8rem",
							background: "white",
							color: "#0066cc",
							textDecoration: "none",
							borderRadius: "10px",
							fontWeight: "600",
							transition: "all 0.3s ease",
							fontSize: "0.95rem",
							display: "inline-block",
						}}
						onMouseEnter={(e) => {
							e.target.style.transform = "translateY(-2px)";
							e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
						}}
						onMouseLeave={(e) => {
							e.target.style.transform = "translateY(0)";
							e.target.style.boxShadow = "none";
						}}>
						+ Book New Appointment
					</Link>
				</div>

				{appointments.length === 0 ? (
					<div
						style={{
							background: "white",
							borderRadius: "15px",
							padding: "3rem 2rem",
							textAlign: "center",
							boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
						}}>
						<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
						<h2 style={{ color: "#1f2937", marginBottom: "0.5rem" }}>
							No Appointments Yet
						</h2>
						<p
							style={{
								color: "#6b7280",
								marginBottom: "2rem",
								fontSize: "1rem",
							}}>
							You haven't booked any appointments yet. Schedule your first
							consultation now!
						</p>
						<Link
							to="/make-appointment"
							style={{
								display: "inline-block",
								padding: "0.95rem 2rem",
								background: "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
								color: "white",
								textDecoration: "none",
								borderRadius: "10px",
								fontWeight: "600",
								transition: "all 0.3s ease",
								boxShadow: "0 4px 15px rgba(0, 102, 204, 0.3)",
							}}
							onMouseEnter={(e) => {
								e.target.style.transform = "translateY(-2px)";
								e.target.style.boxShadow = "0 8px 25px rgba(0, 102, 204, 0.4)";
							}}
							onMouseLeave={(e) => {
								e.target.style.transform = "translateY(0)";
								e.target.style.boxShadow = "0 4px 15px rgba(0, 102, 204, 0.3)";
							}}>
							Book Your First Appointment
						</Link>
					</div>
				) : (
					<>
						{/* Filter Buttons */}
						<div
							style={{
								display: "flex",
								gap: "1rem",
								marginBottom: "2rem",
								flexWrap: "wrap",
							}}>
							{[
								{
									value: "all",
									label: "All Appointments",
									count: appointments.length,
								},
								{
									value: "confirmed",
									label: "Confirmed",
									count: appointments.filter((a) => a.status === "confirmed")
										.length,
								},
								{
									value: "pending",
									label: "Pending",
									count: appointments.filter((a) => a.status === "pending")
										.length,
								},
								{
									value: "cancelled",
									label: "Cancelled",
									count: appointments.filter((a) => a.status === "cancelled")
										.length,
								},
							].map((btn) => (
								<button
									key={btn.value}
									onClick={() => setFilter(btn.value)}
									style={{
										padding: "0.7rem 1.5rem",
										background:
											filter === btn.value
												? "linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)"
												: "white",
										color: filter === btn.value ? "white" : "#333",
										border: `2px solid ${filter === btn.value ? "#0066cc" : "#e5e7eb"}`,
										borderRadius: "10px",
										fontWeight: "600",
										cursor: "pointer",
										transition: "all 0.3s ease",
										fontSize: "0.9rem",
									}}
									onMouseEnter={(e) => {
										if (filter !== btn.value) {
											e.target.style.borderColor = "#0066cc";
											e.target.style.color = "#0066cc";
										}
									}}
									onMouseLeave={(e) => {
										if (filter !== btn.value) {
											e.target.style.borderColor = "#e5e7eb";
											e.target.style.color = "#333";
										}
									}}>
									{btn.label} ({btn.count})
								</button>
							))}
						</div>

						{/* Appointments Grid */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
								gap: "2rem",
							}}>
							{filteredAppointments.map((apt) => {
								const statusColor = getStatusColor(apt.status);
								return (
									<div
										key={apt._id}
										style={{
											background: "white",
											borderRadius: "16px",
											overflow: "hidden",
											boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
											transition: "all 0.3s ease",
											borderLeft: `5px solid ${statusColor.border}`,
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = "translateY(-8px)";
											e.currentTarget.style.boxShadow =
												"0 15px 40px rgba(0, 0, 0, 0.15)";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = "translateY(0)";
											e.currentTarget.style.boxShadow =
												"0 4px 20px rgba(0, 0, 0, 0.08)";
										}}>
										{/* Status Badge */}
										<div
											style={{
												background: statusColor.bg,
												color: statusColor.text,
												padding: "0.75rem",
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
											}}>
											<span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
												{statusColor.icon}{" "}
												{apt.status.charAt(0).toUpperCase() +
													apt.status.slice(1)}
											</span>
											{apt.status !== "cancelled" && (
												<button
													onClick={() => handleCancel(apt._id)}
													style={{
														background: "rgba(255, 255, 255, 0.2)",
														border: "1px solid rgba(255, 255, 255, 0.4)",
														color: statusColor.text,
														padding: "0.3rem 0.8rem",
														borderRadius: "5px",
														cursor: "pointer",
														fontSize: "0.75rem",
														fontWeight: "600",
														transition: "all 0.2s ease",
													}}
													onMouseEnter={(e) => {
														e.target.style.background =
															"rgba(255, 255, 255, 0.3)";
													}}
													onMouseLeave={(e) => {
														e.target.style.background =
															"rgba(255, 255, 255, 0.2)";
													}}>
													Cancel
												</button>
											)}
										</div>

										{/* Card Content */}
										<div style={{ padding: "2rem" }}>
											<h3
												style={{
													margin: "0 0 1.5rem 0",
													fontSize: "1.3rem",
													fontWeight: "700",
													color: "#1f2937",
												}}>
												{apt.service}
											</h3>

											<div
												style={{
													display: "grid",
													gap: "1rem",
													marginBottom: "1.5rem",
												}}>
												{/* Date */}
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.75rem",
														color: "#4b5563",
													}}>
													<span style={{ fontSize: "1.3rem" }}>📆</span>
													<div>
														<p
															style={{
																margin: "0.2rem 0",
																color: "#6b7280",
																fontSize: "0.85rem",
															}}>
															Date
														</p>
														<p
															style={{
																margin: "0.2rem 0",
																fontWeight: "600",
																color: "#1f2937",
															}}>
															{new Date(apt.appointmentDate).toLocaleDateString(
																"en-US",
																{
																	weekday: "long",
																	year: "numeric",
																	month: "long",
																	day: "numeric",
																},
															)}
														</p>
													</div>
												</div>

												{/* Time */}
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.75rem",
													}}>
													<span style={{ fontSize: "1.3rem" }}>🕐</span>
													<div>
														<p
															style={{
																margin: "0.2rem 0",
																color: "#6b7280",
																fontSize: "0.85rem",
															}}>
															Time
														</p>
														<p
															style={{
																margin: "0.2rem 0",
																fontWeight: "600",
																color: "#1f2937",
															}}>
															{apt.timeSlot}
														</p>
													</div>
												</div>
											</div>

											{/* Description */}
											{apt.description && (
												<div
													style={{
														background: "#f3f4f6",
														padding: "1rem",
														borderRadius: "8px",
														marginTop: "1.5rem",
													}}>
													<p
														style={{
															margin: "0 0 0.5rem 0",
															color: "#6b7280",
															fontSize: "0.85rem",
															fontWeight: "500",
														}}>
														Additional Notes
													</p>
													<p
														style={{
															margin: 0,
															color: "#1f2937",
															fontSize: "0.9rem",
															lineHeight: "1.6",
														}}>
														{apt.description}
													</p>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>

						{filteredAppointments.length === 0 && (
							<div
								style={{
									textAlign: "center",
									padding: "2rem",
									color: "#6b7280",
								}}>
								<p style={{ fontSize: "1.05rem" }}>
									No {filter !== "all" ? filter : ""} appointments found.
								</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Appointments;
