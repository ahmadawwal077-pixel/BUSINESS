import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
	House,
	BookOpen,
	Calendar,
	CreditCard,
	User as UserIcon,
	SignOut,
	Notebook,
	Gear,
	List,
	CaretLeft,
	GraduationCap,
} from "phosphor-react";
import Logo from "./Logo";

const DashboardLayout = ({ children }) => {
	const { user, logout } = useContext(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const navItems = [
		{ icon: <House size={24} />, label: "Dashboard", path: "/dashboard" },
		{ icon: <BookOpen size={24} />, label: "All Courses", path: "/courses" },
		{
			icon: <Calendar size={24} />,
			label: "Appointments",
			path: "/appointments",
		},
		{ icon: <CreditCard size={24} />, label: "Payments", path: "/payments" },
		{ icon: <Notebook size={24} />, label: "Blog", path: "/blog" },
		{ icon: <UserIcon size={24} />, label: "Profile", path: "/profile" },
	];

	if (user?.isAdmin) {
		navItems.push({
			icon: <Gear size={24} />,
			label: "Admin Panel",
			path: "/admin/dashboard",
		});
	}

	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
			{/* Sidebar */}
			<aside
				style={{
					width: isCollapsed ? "80px" : "260px",
					background: "white",
					borderRight: "1px solid #e2e8f0",
					transition: "all 0.3s ease",
					display: "flex",
					flexDirection: "column",
					position: "sticky",
					top: 0,
					height: "100vh",
					zIndex: 100,
					boxShadow: "4px 0 10px rgba(0,0,0,0.02)",
				}}>
				{/* Sidebar Header */}
				<div
					style={{
						padding: "1.5rem",
						display: "flex",
						alignItems: "center",
						justifyContent: isCollapsed ? "center" : "space-between",
						borderBottom: "1px solid #f1f5f9",
						height: "80px",
					}}>
					{!isCollapsed && (
						<Link to="/" style={{ textDecoration: "none" }}>
							<Logo />
						</Link>
					)}
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						style={{
							background: "#f1f5f9",
							border: "none",
							borderRadius: "8px",
							padding: "0.5rem",
							cursor: "pointer",
							display: "flex",
							color: "#64748b",
						}}>
						{isCollapsed ? <List size={20} /> : <CaretLeft size={20} />}
					</button>
				</div>

				{/* Navigation Items */}
				<nav
					style={{
						flex: 1,
						padding: "1.5rem 0.75rem",
						display: "flex",
						flexDirection: "column",
						gap: "0.4rem",
					}}>
					{navItems.map((item) => {
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								style={{
									display: "flex",
									alignItems: "center",
									padding: "0.75rem 1rem",
									textDecoration: "none",
									borderRadius: "12px",
									color: isActive ? "#0066cc" : "#64748b",
									background: isActive ? "#eff6ff" : "transparent",
									transition: "all 0.2s ease",
									justifyContent: isCollapsed ? "center" : "flex-start",
									fontWeight: isActive ? "600" : "500",
									gap: "1rem",
								}}
								onMouseEnter={(e) => {
									if (!isActive) e.currentTarget.style.background = "#f8fafc";
								}}
								onMouseLeave={(e) => {
									if (!isActive)
										e.currentTarget.style.background = "transparent";
								}}>
								<span
									style={{
										display: "flex",
										color: isActive ? "#0066cc" : "#94a3b8",
									}}>
									{item.icon}
								</span>
								{!isCollapsed && <span>{item.label}</span>}
							</Link>
						);
					})}
				</nav>

				{/* Sidebar Footer */}
				<div
					style={{ padding: "1.5rem 0.75rem", borderTop: "1px solid #f1f5f9" }}>
					<button
						onClick={handleLogout}
						style={{
							display: "flex",
							alignItems: "center",
							width: "100%",
							padding: "0.75rem 1rem",
							border: "none",
							background: "transparent",
							borderRadius: "12px",
							color: "#dc2626",
							cursor: "pointer",
							transition: "all 0.2s ease",
							justifyContent: isCollapsed ? "center" : "flex-start",
							fontWeight: "600",
							gap: "1rem",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
						onMouseLeave={(e) =>
							(e.currentTarget.style.background = "transparent")
						}>
						<span style={{ display: "flex" }}>
							<SignOut size={24} />
						</span>
						{!isCollapsed && <span>Logout</span>}
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					maxWidth: "100%",
				}}>
				{/* Top Header */}
				<header
					style={{
						height: "80px",
						background: "white",
						borderBottom: "1px solid #e2e8f0",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "0 2rem",
						position: "sticky",
						top: 0,
						zIndex: 90,
					}}>
					<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "bold",
								color: "#1e293b",
								margin: 0,
							}}>
							{navItems.find((i) => i.path === location.pathname)?.label ||
								"Overview"}
						</h2>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
						{/* Simple User Profile */}
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
							<div
								style={{
									textAlign: "right",
									display: isCollapsed ? "none" : "block",
								}}>
								<p
									style={{
										margin: 0,
										fontWeight: "600",
										color: "#1e293b",
										fontSize: "0.9rem",
									}}>
									{user?.name}
								</p>
								<p style={{ margin: 0, color: "#64748b", fontSize: "0.75rem" }}>
									{user?.isAdmin ? "Administrator" : "Student"}
								</p>
							</div>
							<div
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "12px",
									background:
										"linear-gradient(135deg, #0066cc 0%, #00b4d8 100%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontWeight: "bold",
									boxShadow: "0 4px 10px rgba(0, 102, 204, 0.2)",
								}}>
								{user?.name?.charAt(0).toUpperCase()}
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main style={{ padding: "2rem", flex: 1, position: "relative" }}>
					{children}
				</main>
			</div>

			<style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
		</div>
	);
};

export default DashboardLayout;
