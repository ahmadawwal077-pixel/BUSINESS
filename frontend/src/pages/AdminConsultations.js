import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { consultationAPI } from "../services/api";
import alertService from "../utils/alertService";

const STATUS_COLORS = {
	new: { bg: "#dbeafe", color: "#1e40af", label: "🆕 New" },
	reviewed: { bg: "#fef9c3", color: "#92400e", label: "👀 Reviewed" },
	contacted: { bg: "#e0e7ff", color: "#3730a3", label: "📞 Contacted" },
	completed: { bg: "#d1fae5", color: "#065f46", label: "✅ Completed" },
	closed: { bg: "#f3f4f6", color: "#374151", label: "🔒 Closed" },
};

const SERVICE_LABELS = {
	general: "General Consultation",
	business: "Business Strategy",
	technical: "Technical Assessment",
	training: "Training & Development",
	implementation: "Implementation Support",
	other: "Other",
};

const AdminConsultations = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [consultations, setConsultations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [message, setMessage] = useState({ type: "", text: "" });
	const [selected, setSelected] = useState(null); // for detail drawer

	useEffect(() => {
		if (user && !user.isAdmin) navigate("/dashboard");
	}, [user, navigate]);

	const showMsg = (type, text) => {
		setMessage({ type, text });
		setTimeout(() => setMessage({ type: "", text: "" }), 4000);
	};

	const fetchConsultations = async () => {
		try {
			setLoading(true);
			const res = await consultationAPI.getAllConsultationRequests();
			setConsultations(res.data || []);
		} catch (e) {
			showMsg("error", "Failed to load consultation requests.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchConsultations();
	}, []);

	const handleStatusChange = async (id, status) => {
		try {
			await consultationAPI.updateConsultationStatus(id, { status });
			showMsg("success", "Status updated!");
			fetchConsultations();
			if (selected && selected.id === id)
				setSelected((prev) => ({ ...prev, status }));
		} catch (e) {
			showMsg("error", "Failed to update status.");
		}
	};

	const handleDelete = async (id) => {
		const result = await alertService.confirm(
			"Delete Request?",
			"Are you sure you want to delete this consultation request?",
			"Yes, Delete It",
		);
		if (!result.isConfirmed) return;
		try {
			await consultationAPI.deleteConsultationRequest(id);
			showMsg("success", "Request deleted.");
			setSelected(null);
			fetchConsultations();
		} catch (e) {
			showMsg("error", "Failed to delete request.");
		}
	};

	const filtered =
		filter === "all"
			? consultations
			: consultations.filter((c) => c.status === filter);

	const counts = Object.keys(STATUS_COLORS).reduce((acc, k) => {
		acc[k] = consultations.filter((c) => c.status === k).length;
		return acc;
	}, {});

	return (
		<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
			{/* Header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "2rem",
					flexWrap: "wrap",
					gap: "1rem",
				}}>
				<div>
					<h1
						style={{
							margin: 0,
							fontSize: "2rem",
							fontWeight: "800",
							color: "#1e293b",
						}}>
						📅 Consultation Requests
					</h1>
					<p style={{ margin: "4px 0 0", color: "#64748b" }}>
						Manage and track all scheduled consultation requests
					</p>
				</div>
				<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					<span
						style={{
							background: "#0066cc",
							color: "white",
							borderRadius: "20px",
							padding: "4px 12px",
							fontSize: "0.85rem",
							fontWeight: "700",
						}}>
						{consultations.length} Total
					</span>
					<span
						style={{
							background: STATUS_COLORS.new.bg,
							color: STATUS_COLORS.new.color,
							borderRadius: "20px",
							padding: "4px 12px",
							fontSize: "0.85rem",
							fontWeight: "700",
						}}>
						{counts.new} New
					</span>
				</div>
			</div>

			{/* Message Toast */}
			{message.text && (
				<div
					style={{
						padding: "1rem 1.5rem",
						background: message.type === "success" ? "#d1fae5" : "#fee2e2",
						color: message.type === "success" ? "#065f46" : "#991b1b",
						borderRadius: "10px",
						marginBottom: "1.5rem",
						fontWeight: "600",
						border: `1.5px solid ${message.type === "success" ? "#6ee7b7" : "#fca5a5"}`,
					}}>
					{message.type === "success" ? "✅" : "❌"} {message.text}
				</div>
			)}

			{/* Filter Tabs */}
			<div
				style={{
					display: "flex",
					gap: "0.5rem",
					marginBottom: "1.5rem",
					flexWrap: "wrap",
				}}>
				{[
					["all", "All"],
					...Object.entries(STATUS_COLORS).map(([k, v]) => [k, v.label]),
				].map(([key, label]) => (
					<button
						key={key}
						onClick={() => setFilter(key)}
						style={{
							padding: "0.5rem 1.2rem",
							borderRadius: "20px",
							border: "none",
							cursor: "pointer",
							fontWeight: "600",
							fontSize: "0.85rem",
							background: filter === key ? "#0066cc" : "#f1f5f9",
							color: filter === key ? "white" : "#475569",
							transition: "all 0.2s ease",
						}}>
						{label} {key !== "all" && `(${counts[key] ?? 0})`}
					</button>
				))}
			</div>

			{/* Main content */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: selected ? "1fr 380px" : "1fr",
					gap: "1.5rem",
					alignItems: "start",
				}}>
				{/* Table */}
				<div
					style={{
						background: "white",
						borderRadius: "16px",
						boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
						overflow: "hidden",
					}}>
					{loading ? (
						<div
							style={{
								padding: "3rem",
								textAlign: "center",
								color: "#64748b",
							}}>
							Loading...
						</div>
					) : filtered.length === 0 ? (
						<div
							style={{
								padding: "3rem",
								textAlign: "center",
								color: "#94a3b8",
							}}>
							<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
							<p>
								No consultation requests{" "}
								{filter !== "all" ? `with status "${filter}"` : "yet"}.
							</p>
						</div>
					) : (
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								fontSize: "0.9rem",
							}}>
							<thead>
								<tr
									style={{
										background: "#f8fafc",
										borderBottom: "2px solid #e2e8f0",
									}}>
									{[
										"Client",
										"Service",
										"Preferred Date",
										"Status",
										"Submitted",
										"Actions",
									].map((h) => (
										<th
											key={h}
											style={{
												padding: "1rem",
												textAlign: "left",
												color: "#475569",
												fontWeight: "700",
												fontSize: "0.8rem",
												textTransform: "uppercase",
												letterSpacing: "0.5px",
											}}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{filtered.map((c, idx) => {
									const st = STATUS_COLORS[c.status] || STATUS_COLORS.new;
									return (
										<tr
											key={c.id}
											onClick={() => setSelected(c)}
											style={{
												borderBottom: "1px solid #f1f5f9",
												cursor: "pointer",
												background:
													selected?.id === c.id
														? "#eff6ff"
														: idx % 2 === 0
															? "white"
															: "#fafafa",
												transition: "background 0.2s ease",
											}}
											onMouseEnter={(e) => {
												if (selected?.id !== c.id)
													e.currentTarget.style.background = "#f0f9ff";
											}}
											onMouseLeave={(e) => {
												if (selected?.id !== c.id)
													e.currentTarget.style.background =
														idx % 2 === 0 ? "white" : "#fafafa";
											}}>
											<td style={{ padding: "1rem" }}>
												<div style={{ fontWeight: "700", color: "#1e293b" }}>
													{c.fullName}
												</div>
												<div style={{ fontSize: "0.8rem", color: "#64748b" }}>
													{c.email}
												</div>
											</td>
											<td style={{ padding: "1rem", color: "#475569" }}>
												{SERVICE_LABELS[c.serviceType] || c.serviceType}
											</td>
											<td style={{ padding: "1rem", color: "#475569" }}>
												{c.preferredDate || "—"} {c.preferredTime || ""}
											</td>
											<td style={{ padding: "1rem" }}>
												<span
													style={{
														background: st.bg,
														color: st.color,
														padding: "4px 10px",
														borderRadius: "20px",
														fontSize: "0.8rem",
														fontWeight: "700",
														whiteSpace: "nowrap",
													}}>
													{st.label}
												</span>
											</td>
											<td
												style={{
													padding: "1rem",
													color: "#94a3b8",
													fontSize: "0.82rem",
												}}>
												{c.created_at
													? new Date(c.created_at).toLocaleDateString()
													: "—"}
											</td>
											<td style={{ padding: "1rem" }}>
												<select
													value={c.status}
													onChange={(e) => {
														e.stopPropagation();
														handleStatusChange(c.id, e.target.value);
													}}
													onClick={(e) => e.stopPropagation()}
													style={{
														padding: "0.4rem 0.6rem",
														borderRadius: "8px",
														border: "1.5px solid #e2e8f0",
														fontSize: "0.82rem",
														cursor: "pointer",
														fontFamily: "inherit",
													}}>
													{Object.keys(STATUS_COLORS).map((s) => (
														<option key={s} value={s}>
															{s.charAt(0).toUpperCase() + s.slice(1)}
														</option>
													))}
												</select>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>

				{/* Detail Drawer */}
				{selected && (
					<div
						style={{
							background: "white",
							borderRadius: "16px",
							boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
							padding: "1.5rem",
							position: "sticky",
							top: "1rem",
						}}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "1.5rem",
							}}>
							<h3 style={{ margin: 0, color: "#1e293b", fontWeight: "800" }}>
								Request Details
							</h3>
							<button
								onClick={() => setSelected(null)}
								style={{
									background: "none",
									border: "none",
									fontSize: "1.2rem",
									cursor: "pointer",
									color: "#94a3b8",
								}}>
								✕
							</button>
						</div>

						{/* Avatar */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "1rem",
								marginBottom: "1.5rem",
								padding: "1rem",
								background: "#f8fafc",
								borderRadius: "12px",
							}}>
							<div
								style={{
									width: "50px",
									height: "50px",
									borderRadius: "50%",
									background: "linear-gradient(135deg, #0066cc, #00b4d8)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontWeight: "800",
									fontSize: "1.2rem",
								}}>
								{selected.fullName?.[0]?.toUpperCase()}
							</div>
							<div>
								<div style={{ fontWeight: "700", color: "#1e293b" }}>
									{selected.fullName}
								</div>
								<div style={{ fontSize: "0.85rem", color: "#64748b" }}>
									{selected.email}
								</div>
							</div>
						</div>

						{/* Details grid */}
						{[
							["📞 Phone", selected.phone],
							["🏢 Company", selected.company || "—"],
							[
								"🛠 Service",
								SERVICE_LABELS[selected.serviceType] || selected.serviceType,
							],
							["📅 Preferred Date", selected.preferredDate || "—"],
							["⏰ Preferred Time", selected.preferredTime || "—"],
							[
								"📬 Status",
								STATUS_COLORS[selected.status]?.label || selected.status,
							],
							[
								"📤 Submitted",
								selected.created_at
									? new Date(selected.created_at).toLocaleString()
									: "—",
							],
						].map(([label, val]) => (
							<div
								key={label}
								style={{
									display: "flex",
									gap: "0.75rem",
									marginBottom: "0.75rem",
									padding: "0.6rem 0",
									borderBottom: "1px solid #f1f5f9",
								}}>
								<span
									style={{
										fontSize: "0.82rem",
										color: "#94a3b8",
										width: "140px",
										flexShrink: 0,
									}}>
									{label}
								</span>
								<span
									style={{
										fontSize: "0.9rem",
										color: "#1e293b",
										fontWeight: "600",
									}}>
									{val}
								</span>
							</div>
						))}

						{selected.message && (
							<div style={{ marginTop: "1rem" }}>
								<p
									style={{
										fontSize: "0.82rem",
										color: "#94a3b8",
										marginBottom: "0.5rem",
									}}>
									💬 Message
								</p>
								<div
									style={{
										background: "#f8fafc",
										borderRadius: "10px",
										padding: "1rem",
										fontSize: "0.9rem",
										color: "#475569",
										lineHeight: "1.6",
										borderLeft: "3px solid #0066cc",
									}}>
									{selected.message}
								</div>
							</div>
						)}

						{/* Actions */}
						<div
							style={{
								display: "flex",
								gap: "0.75rem",
								marginTop: "1.5rem",
								flexWrap: "wrap",
							}}>
							<a
								href={`mailto:${selected.email}?subject=Re: Your Consultation Request`}
								style={{
									flex: 1,
									padding: "0.75rem",
									background: "linear-gradient(135deg, #0066cc, #00b4d8)",
									color: "white",
									borderRadius: "10px",
									textAlign: "center",
									textDecoration: "none",
									fontWeight: "700",
									fontSize: "0.85rem",
								}}>
								✉️ Reply
							</a>
							<button
								onClick={() => handleDelete(selected.id)}
								style={{
									flex: 1,
									padding: "0.75rem",
									background: "#fee2e2",
									color: "#991b1b",
									border: "none",
									borderRadius: "10px",
									cursor: "pointer",
									fontWeight: "700",
									fontSize: "0.85rem",
								}}>
								🗑 Delete
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminConsultations;
