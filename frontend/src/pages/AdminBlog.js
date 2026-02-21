import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { blogAPI } from "../services/api";
import alertService from "../utils/alertService";
import {
	Plus,
	PencilSimple,
	Trash,
	Eye,
	CheckCircle,
	FileText,
	Clock,
	Warning,
	Lock,
	MagnifyingGlass,
	ArrowLeft,
	Image as ImageIcon,
	DesktopTower,
	TrendUp,
	ArrowClockwise,
	Users,
	Gear,
} from "phosphor-react";

// Map string icon names to actual Phosphor components
const iconsMap = {
	DesktopTower,
	TrendUp,
	ArrowClockwise,
	MagnifyingGlass,
	Users,
	Gear,
};

const AdminBlog = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("list"); // 'list' or 'editor'
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);
	const [blogs, setBlogs] = useState([]);
	const [message, setMessage] = useState({ type: "", text: "" });
	const [editingId, setEditingId] = useState(null);

	const [formData, setFormData] = useState({
		title: "",
		excerpt: "",
		content: "",
		category: "Strategy",
		author: user?.name || "",
		slug: "",
		featuredImage: "",
		color: "#0066cc",
		icon: "TrendUp",
		published: true,
	});

	const categories = [
		"Digital Strategy",
		"Strategy",
		"Management",
		"Market Research",
		"Team Development",
		"Operations",
	];

	// Helper: format a blog date safely (handles both created_at and createdAt)
	const formatDate = (blog) => {
		const raw = blog?.created_at || blog?.createdAt;
		if (!raw) return "";
		const d = new Date(raw);
		if (isNaN(d)) return "";
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Helper: get author name (handles string or {name} object)
	const getAuthor = (blog) => {
		if (!blog?.author) return "Admin";
		if (typeof blog.author === "string") return blog.author;
		return blog.author?.name || "Admin";
	};

	const iconOptions = [
		{ value: "DesktopTower", label: "Technology" },
		{ value: "TrendUp", label: "Growth" },
		{ value: "ArrowClockwise", label: "Change" },
		{ value: "MagnifyingGlass", label: "Research" },
		{ value: "Users", label: "Team" },
		{ value: "Gear", label: "Operations" },
	];

	const colorOptions = [
		{ value: "#0066cc", label: "Blue", secondary: "#e0f2fe" },
		{ value: "#00b4d8", label: "Cyan", secondary: "#ecfeff" },
		{ value: "#0096c7", label: "Teal", secondary: "#f0fdfa" },
		{ value: "#0077b6", label: "Dark Blue", secondary: "#eff6ff" },
		{ value: "#7c3aed", label: "Purple", secondary: "#f5f3ff" },
	];

	const loadBlogs = useCallback(async () => {
		try {
			setLoading(true);
			const response = await blogAPI.getAllBlogs(1, 100);
			setBlogs(response.data.blogs || []);
		} catch (error) {
			console.error("Error loading blogs:", error);
			setMessage({ type: "error", text: "Failed to load blog posts" });
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (user?.isAdmin) {
			loadBlogs();
		}
	}, [user, loadBlogs]);

	const handleChange = (e) => {
		const { name, value, type, checked, files } = e.target;

		if (type === "file" && files.length > 0) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				setFormData((prev) => ({
					...prev,
					featuredImage: event.target.result,
				}));
			};
			reader.readAsDataURL(file);
		} else if (type === "checkbox") {
			setFormData((prev) => ({ ...prev, [name]: checked }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));

			if (name === "title" && !editingId) {
				const slug = value
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, "");
				setFormData((prev) => ({ ...prev, slug: slug }));
			}
		}
	};

	const handleEdit = (blog) => {
		setEditingId(blog._id);
		setFormData({
			title: blog.title || "",
			excerpt: blog.excerpt || "",
			content: blog.content || "",
			category: blog.category || "Strategy",
			author: getAuthor(blog) || user?.name || "",
			slug: blog.slug || "",
			featuredImage: blog.featuredImage || "",
			color: blog.color || "#0066cc",
			icon: blog.icon || "TrendUp",
			published: blog.published !== undefined ? blog.published : true,
		});
		setActiveTab("editor");
		window.scrollTo(0, 0);
	};

	const handleDelete = async (blogId) => {
		const result = await alertService.confirm(
			"Delete Article?",
			"Are you sure you want to delete this blog post? This action cannot be undone.",
			"Yes, Delete It",
		);

		if (!result.isConfirmed) return;

		try {
			setActionLoading(true);
			await blogAPI.deleteBlog(blogId);
			setBlogs(blogs.filter((b) => b._id !== blogId));
			setMessage({ type: "success", text: "Blog post deleted successfully" });
			setTimeout(() => setMessage({ type: "", text: "" }), 3000);
		} catch (error) {
			setMessage({ type: "error", text: "Failed to delete post" });
		} finally {
			setActionLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setActionLoading(true);
		setMessage({ type: "", text: "" });

		try {
			const blogData = {
				...formData,
				author: formData.author.trim(),
			};

			if (editingId) {
				await blogAPI.updateBlog(editingId, blogData);
				setMessage({
					type: "success",
					text: "Blog post updated successfully!",
				});
			} else {
				await blogAPI.createBlog(blogData);
				setMessage({
					type: "success",
					text: "Blog post created successfully!",
				});
			}

			// Clean up and refresh
			setTimeout(() => {
				setActiveTab("list");
				setEditingId(null);
				setFormData({
					title: "",
					excerpt: "",
					content: "",
					category: "Strategy",
					author: user?.name || "",
					slug: "",
					featuredImage: "",
					color: "#0066cc",
					icon: "TrendUp",
					published: true,
				});
				loadBlogs();
				setMessage({ type: "", text: "" });
			}, 1500);
		} catch (error) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Operation failed",
			});
		} finally {
			setActionLoading(false);
		}
	};

	const stats = [
		{
			label: "Total Posts",
			value: blogs.length,
			icon: <FileText size={24} />,
			color: "#0066cc",
			bg: "#eff6ff",
		},
		{
			label: "Published",
			value: blogs.filter((b) => b.published).length,
			icon: <CheckCircle size={24} />,
			color: "#10b981",
			bg: "#ecfdf5",
		},
		{
			label: "Drafts",
			value: blogs.filter((b) => !b.published).length,
			icon: <Clock size={24} />,
			color: "#f59e0b",
			bg: "#fffbeb",
		},
	];

	if (!user?.isAdmin) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "2rem",
					background: "#f8fafc",
				}}>
				<div
					style={{
						maxWidth: "450px",
						textAlign: "center",
						background: "white",
						padding: "3rem",
						borderRadius: "24px",
						boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
					}}>
					<div
						style={{
							width: "80px",
							height: "80px",
							background: "#fee2e2",
							color: "#ef4444",
							borderRadius: "50%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto 1.5rem",
						}}>
						<Lock size={40} weight="bold" />
					</div>
					<h1
						style={{
							fontSize: "1.75rem",
							fontWeight: "800",
							color: "#1e293b",
							marginBottom: "1rem",
						}}>
						Access Restricted
					</h1>
					<p
						style={{
							color: "#64748b",
							lineHeight: "1.6",
							marginBottom: "2rem",
						}}>
						Only administrators can access the blog management dashboard. Please
						contact IT support if you believe this is an error.
					</p>
					<button
						onClick={() => navigate("/blog")}
						style={{
							width: "100%",
							padding: "1rem",
							background: "#1e293b",
							color: "white",
							borderRadius: "12px",
							border: "none",
							fontWeight: "600",
							cursor: "pointer",
						}}>
						Return to Public Blog
					</button>
				</div>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
			{/* Dashboard Header */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "2.5rem",
				}}>
				<div>
					<h1
						style={{
							fontSize: "2.25rem",
							fontWeight: "800",
							color: "#1e293b",
							margin: 0,
							display: "flex",
							alignItems: "center",
							gap: "0.75rem",
						}}>
						Blog Management <span style={{ fontSize: "1.5rem" }}>✍️</span>
					</h1>
					<p style={{ color: "#64748b", margin: "0.5rem 0 0 0" }}>
						Create, edit, and manage your thought leadership content.
					</p>
				</div>
				<button
					onClick={() => {
						setEditingId(null);
						setFormData({
							title: "",
							excerpt: "",
							content: "",
							category: "Strategy",
							author: user?.name,
							slug: "",
							featuredImage: "",
							color: "#0066cc",
							icon: "TrendUp",
							published: true,
						});
						setActiveTab(activeTab === "editor" ? "list" : "editor");
					}}
					style={{
						padding: "0.8rem 1.5rem",
						background: activeTab === "editor" ? "#f1f5f9" : "#1e293b",
						color: activeTab === "editor" ? "#1e293b" : "white",
						borderRadius: "12px",
						border: "none",
						fontWeight: "700",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "0.6rem",
						transition: "all 0.2s ease",
						boxShadow:
							activeTab === "editor" ? "none" : "0 4px 12px rgba(0,0,0,0.1)",
					}}>
					{activeTab === "editor" ? (
						<>
							<ArrowLeft size={18} weight="bold" /> Back to Dashboard
						</>
					) : (
						<>
							<Plus size={18} weight="bold" /> Create New Post
						</>
					)}
				</button>
			</div>

			{/* Alert Message */}
			{message.text && (
				<div
					style={{
						padding: "1rem 1.5rem",
						borderRadius: "16px",
						background: message.type === "success" ? "#ecfdf5" : "#fef2f2",
						color: message.type === "success" ? "#065f46" : "#991b1b",
						border: `1px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`,
						marginBottom: "2rem",
						display: "flex",
						alignItems: "center",
						gap: "0.75rem",
						fontWeight: "600",
						boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
					}}>
					{message.type === "success" ? (
						<CheckCircle size={22} weight="fill" />
					) : (
						<Warning size={22} weight="fill" />
					)}
					{message.text}
				</div>
			)}

			{activeTab === "list" ? (
				<>
					{/* Stats Grid */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
							gap: "1.5rem",
							marginBottom: "2.5rem",
						}}>
						{stats.map((stat, idx) => (
							<div
								key={idx}
								style={{
									background: "white",
									padding: "1.5rem",
									borderRadius: "20px",
									boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
									display: "flex",
									alignItems: "center",
									gap: "1.25rem",
									border: "1px solid #f1f5f9",
								}}>
								<div
									style={{
										width: "56px",
										height: "56px",
										borderRadius: "16px",
										background: stat.bg,
										color: stat.color,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									{stat.icon}
								</div>
								<div>
									<p
										style={{
											margin: 0,
											color: "#64748b",
											fontSize: "0.875rem",
											fontWeight: "600",
										}}>
										{stat.label}
									</p>
									<p
										style={{
											margin: 0,
											color: "#1e293b",
											fontSize: "1.5rem",
											fontWeight: "800",
										}}>
										{stat.value}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Post Management Table */}
					<div
						style={{
							background: "white",
							borderRadius: "24px",
							overflow: "hidden",
							boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
							border: "1px solid #f1f5f9",
						}}>
						<div
							style={{
								padding: "1.5rem 2rem",
								borderBottom: "1px solid #f1f5f9",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<h3
								style={{
									margin: 0,
									fontSize: "1.1rem",
									fontWeight: "700",
									color: "#1e293b",
								}}>
								All Articles
							</h3>
							<div style={{ position: "relative" }}>
								<MagnifyingGlass
									size={18}
									style={{
										position: "absolute",
										left: "12px",
										top: "50%",
										transform: "translateY(-50%)",
										color: "#94a3b8",
									}}
								/>
								<input
									type="text"
									placeholder="Search posts..."
									style={{
										padding: "0.6rem 1rem 0.6rem 2.5rem",
										borderRadius: "10px",
										border: "1px solid #e2e8f0",
										fontSize: "0.9rem",
										width: "250px",
									}}
								/>
							</div>
						</div>

						{loading ? (
							<div
								style={{
									padding: "4rem",
									textAlign: "center",
									color: "#64748b",
								}}>
								Loading your articles...
							</div>
						) : blogs.length === 0 ? (
							<div style={{ padding: "5rem", textAlign: "center" }}>
								<div
									style={{
										width: "60px",
										height: "60px",
										background: "#f1f5f9",
										borderRadius: "50%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										margin: "0 auto 1rem",
										color: "#94a3b8",
									}}>
									<FileText size={30} />
								</div>
								<h4 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>
									No articles found
								</h4>
								<p
									style={{
										color: "#64748b",
										maxWidth: "300px",
										margin: "0 auto",
									}}>
									You haven't created any blog posts yet. Start by clicking
									"Create New Post".
								</p>
							</div>
						) : (
							<div style={{ overflowX: "auto" }}>
								<table
									style={{
										width: "100%",
										borderCollapse: "collapse",
										textAlign: "left",
									}}>
									<thead>
										<tr
											style={{
												background: "#f8fafc",
												borderBottom: "1px solid #f1f5f9",
											}}>
											<th
												style={{
													padding: "1rem 2rem",
													fontSize: "0.75rem",
													textTransform: "uppercase",
													color: "#64748b",
													fontWeight: "700",
												}}>
												Article
											</th>
											<th
												style={{
													padding: "1rem 2rem",
													fontSize: "0.75rem",
													textTransform: "uppercase",
													color: "#64748b",
													fontWeight: "700",
												}}>
												Category
											</th>
											<th
												style={{
													padding: "1rem 2rem",
													fontSize: "0.75rem",
													textTransform: "uppercase",
													color: "#64748b",
													fontWeight: "700",
												}}>
												Status
											</th>
											<th
												style={{
													padding: "1rem 2rem",
													fontSize: "0.75rem",
													textTransform: "uppercase",
													color: "#64748b",
													fontWeight: "700",
												}}>
												Date
											</th>
											<th
												style={{
													padding: "1rem 2rem",
													fontSize: "0.75rem",
													textTransform: "uppercase",
													color: "#64748b",
													fontWeight: "700",
													textAlign: "right",
												}}>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{blogs.map((blog) => (
											<tr
												key={blog._id}
												style={{
													borderBottom: "1px solid #f1f5f9",
													transition: "background 0.2s ease",
												}}
												onMouseEnter={(e) =>
													(e.currentTarget.style.background = "#fcfdfe")
												}
												onMouseLeave={(e) =>
													(e.currentTarget.style.background = "transparent")
												}>
												<td style={{ padding: "1.25rem 2rem" }}>
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "1rem",
														}}>
														<div
															style={{
																width: "50px",
																height: "50px",
																borderRadius: "10px",
																overflow: "hidden",
																flexShrink: 0,
																background: "#f1f5f9",
															}}>
															<img
																src={
																	blog.featuredImage ||
																	"https://images.unsplash.com/photo-1552664730-d307ca884978?w=100"
																}
																style={{
																	width: "100%",
																	height: "100%",
																	objectFit: "cover",
																}}
																alt={blog.title}
															/>
														</div>
														<div style={{ maxWidth: "300px" }}>
															<p
																style={{
																	margin: 0,
																	fontWeight: "700",
																	color: "#1e293b",
																	fontSize: "0.95rem",
																	whiteSpace: "nowrap",
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																}}>
																{blog.title}
															</p>
															<p
																style={{
																	margin: 0,
																	fontSize: "0.8rem",
																	color: "#94a3b8",
																}}>
																By {getAuthor(blog)}
															</p>
														</div>
													</div>
												</td>
												<td style={{ padding: "1.25rem 2rem" }}>
													<span
														style={{
															padding: "0.3rem 0.75rem",
															borderRadius: "8px",
															background: "#f1f5f9",
															color: "#475569",
															fontSize: "0.8rem",
															fontWeight: "600",
														}}>
														{blog.category}
													</span>
												</td>
												<td style={{ padding: "1.25rem 2rem" }}>
													<span
														style={{
															display: "inline-flex",
															alignItems: "center",
															gap: "0.4rem",
															padding: "0.3rem 0.75rem",
															borderRadius: "8px",
															background: blog.published
																? "#ecfdf5"
																: "#fffbeb",
															color: blog.published ? "#059669" : "#d97706",
															fontSize: "0.8rem",
															fontWeight: "700",
														}}>
														<span
															style={{
																width: "6px",
																height: "6px",
																borderRadius: "50%",
																background: "currentColor",
															}}
														/>
														{blog.published ? "Published" : "Draft"}
													</span>
												</td>
												<td
													style={{
														padding: "1.25rem 2rem",
														color: "#64748b",
														fontSize: "0.875rem",
													}}>
													{formatDate(blog)}
												</td>
												<td
													style={{
														padding: "1.25rem 2rem",
														textAlign: "right",
													}}>
													<div
														style={{
															display: "flex",
															gap: "0.5rem",
															justifyContent: "flex-end",
														}}>
														<button
															onClick={() => navigate(`/blog/${blog.slug}`)}
															title="View Publicly"
															style={{
																padding: "0.5rem",
																borderRadius: "8px",
																border: "1px solid #e2e8f0",
																background: "white",
																color: "#64748b",
																cursor: "pointer",
															}}>
															<Eye size={18} />
														</button>
														<button
															onClick={() => handleEdit(blog)}
															title="Edit Article"
															style={{
																padding: "0.5rem",
																borderRadius: "8px",
																border: "1px solid #e2e8f0",
																background: "white",
																color: "#0066cc",
																cursor: "pointer",
															}}>
															<PencilSimple size={18} />
														</button>
														<button
															onClick={() => handleDelete(blog._id)}
															disabled={actionLoading}
															title="Delete Article"
															style={{
																padding: "0.5rem",
																borderRadius: "8px",
																border: "1px solid #fee2e2",
																background: "white",
																color: "#ef4444",
																cursor: "pointer",
															}}>
															<Trash size={18} />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</>
			) : (
				/* Editor Form View */
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 350px",
						gap: "2rem",
					}}>
					<div
						style={{
							background: "white",
							padding: "2.5rem",
							borderRadius: "24px",
							boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
							border: "1px solid #f1f5f9",
						}}>
						<form onSubmit={handleSubmit}>
							{/* Form Title Section */}
							<div style={{ marginBottom: "2.5rem" }}>
								<label
									style={{
										display: "block",
										fontSize: "0.9rem",
										fontWeight: "700",
										color: "#64748b",
										marginBottom: "0.75rem",
										textTransform: "uppercase",
										letterSpacing: "0.5px",
									}}>
									Post Content
								</label>
								<input
									type="text"
									name="title"
									value={formData.title}
									onChange={handleChange}
									placeholder="Give your article a compelling title..."
									required
									style={{
										width: "100%",
										padding: "1rem 0",
										border: "none",
										borderBottom: "2px solid #f1f5f9",
										fontSize: "2rem",
										fontWeight: "800",
										color: "#1e293b",
										outline: "none",
										marginBottom: "1.5rem",
										transition: "border-color 0.2s ease",
									}}
								/>

								<textarea
									name="excerpt"
									value={formData.excerpt}
									onChange={handleChange}
									placeholder="Write a brief, engaging summary (excerpt)..."
									required
									rows="2"
									style={{
										width: "100%",
										padding: "1rem",
										background: "#f8fafc",
										borderRadius: "12px",
										border: "1px solid #f1f5f9",
										fontSize: "1.05rem",
										color: "#475569",
										lineHeight: "1.6",
										resize: "none",
										marginBottom: "2rem",
									}}
								/>

								<div style={{ minHeight: "400px" }}>
									<textarea
										name="content"
										value={formData.content}
										onChange={handleChange}
										placeholder="Start writing your thoughts here..."
										required
										style={{
											width: "100%",
											minHeight: "500px",
											padding: "1.5rem",
											border: "1px solid #f1f5f9",
											borderRadius: "16px",
											fontSize: "1.1rem",
											lineHeight: "1.8",
											color: "#334155",
											fontFamily: "inherit",
											outline: "none",
										}}
									/>
								</div>
							</div>

							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									gap: "1rem",
									paddingTop: "2rem",
									borderTop: "1px solid #f1f5f9",
								}}>
								<button
									type="button"
									onClick={() => setActiveTab("list")}
									style={{
										padding: "0.8rem 2rem",
										background: "white",
										color: "#64748b",
										borderRadius: "12px",
										border: "1px solid #e2e8f0",
										fontWeight: "700",
										cursor: "pointer",
									}}>
									Cancel
								</button>
								<button
									type="submit"
									disabled={actionLoading}
									style={{
										padding: "0.8rem 2.5rem",
										background: "#1e293b",
										color: "white",
										borderRadius: "12px",
										border: "none",
										fontWeight: "700",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										gap: "0.6rem",
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
									}}>
									{actionLoading ? (
										"Processing..."
									) : (
										<>
											{editingId ? (
												<ArrowClockwise size={20} />
											) : (
												<Plus size={20} />
											)}
											{editingId ? "Update Article" : "Publish Article"}
										</>
									)}
								</button>
							</div>
						</form>
					</div>

					{/* Sidebar Settings */}
					<div
						style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
						{/* Status Card */}
						<div
							style={{
								background: "white",
								padding: "1.5rem",
								borderRadius: "20px",
								border: "1px solid #f1f5f9",
								boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
							}}>
							<h4
								style={{
									margin: "0 0 1.25rem 0",
									fontSize: "0.9rem",
									fontWeight: "700",
								}}>
								Visibility & Status
							</h4>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "1rem",
									background: formData.published ? "#ecfdf5" : "#f8fafc",
									borderRadius: "12px",
									transition: "all 0.2s ease",
								}}>
								<span
									style={{
										fontWeight: "700",
										fontSize: "0.9rem",
										color: formData.published ? "#065f46" : "#475569",
									}}>
									{formData.published ? "Active Publicly" : "Private Draft"}
								</span>
								<div
									onClick={() =>
										setFormData((prev) => ({
											...prev,
											published: !prev.published,
										}))
									}
									style={{
										width: "44px",
										height: "24px",
										background: formData.published ? "#10b981" : "#cbd5e1",
										borderRadius: "20px",
										padding: "2px",
										cursor: "pointer",
										position: "relative",
										transition: "background 0.3s ease",
									}}>
									<div
										style={{
											width: "20px",
											height: "20px",
											background: "white",
											borderRadius: "50%",
											position: "absolute",
											left: formData.published ? "22px" : "2px",
											transition:
												"left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
											boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
										}}
									/>
								</div>
							</div>
						</div>

						{/* Identity Card */}
						<div
							style={{
								background: "white",
								padding: "1.5rem",
								borderRadius: "20px",
								border: "1px solid #f1f5f9",
								boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
							}}>
							<h4
								style={{
									margin: "0 0 1.25rem 0",
									fontSize: "0.9rem",
									fontWeight: "700",
								}}>
								Identity & Meta
							</h4>
							<div style={{ marginBottom: "1rem" }}>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										color: "#64748b",
										marginBottom: "0.4rem",
										fontWeight: "600",
									}}>
									Author Name
								</label>
								<input
									type="text"
									name="author"
									value={formData.author}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "0.75rem",
										borderRadius: "10px",
										border: "1px solid #e2e8f0",
										fontSize: "0.9rem",
									}}
								/>
							</div>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										color: "#64748b",
										marginBottom: "0.4rem",
										fontWeight: "600",
									}}>
									Category
								</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "0.75rem",
										borderRadius: "10px",
										border: "1px solid #e2e8f0",
										fontSize: "0.9rem",
										background: "white",
									}}>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Image Card */}
						<div
							style={{
								background: "white",
								padding: "1.5rem",
								borderRadius: "20px",
								border: "1px solid #f1f5f9",
								boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
							}}>
							<h4
								style={{
									margin: "0 0 1.25rem 0",
									fontSize: "0.9rem",
									fontWeight: "700",
								}}>
								Featured Image
							</h4>
							<div
								style={{
									width: "100%",
									aspectRatio: "16/9",
									background: "#f8fafc",
									borderRadius: "12px",
									border: "2px dashed #e2e8f0",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									overflow: "hidden",
									position: "relative",
									cursor: "pointer",
								}}
								onClick={() => document.getElementById("imageInput").click()}>
								{formData.featuredImage ? (
									<img
										src={formData.featuredImage}
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
										alt="Preview"
									/>
								) : (
									<div style={{ textAlign: "center", color: "#94a3b8" }}>
										<ImageIcon size={32} />
										<p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem" }}>
											Click to upload
										</p>
									</div>
								)}
								<input
									id="imageInput"
									type="file"
									accept="image/*"
									onChange={handleChange}
									style={{ display: "none" }}
								/>
							</div>
						</div>

						{/* Style Card */}
						<div
							style={{
								background: "white",
								padding: "1.5rem",
								borderRadius: "20px",
								border: "1px solid #f1f5f9",
								boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
							}}>
							<h4
								style={{
									margin: "0 0 1.25rem 0",
									fontSize: "0.9rem",
									fontWeight: "700",
								}}>
								Theme & Branding
							</h4>
							<div style={{ marginBottom: "1rem" }}>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										color: "#64748b",
										marginBottom: "0.4rem",
										fontWeight: "600",
									}}>
									Card Primary Color
								</label>
								<div style={{ display: "flex", gap: "0.5rem" }}>
									{colorOptions.map((opt) => (
										<div
											key={opt.value}
											onClick={() =>
												setFormData((prev) => ({ ...prev, color: opt.value }))
											}
											style={{
												width: "32px",
												height: "32px",
												borderRadius: "8px",
												background: opt.value,
												cursor: "pointer",
												border:
													formData.color === opt.value
														? "3px solid #1e293b"
														: "2px solid transparent",
												boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
											}}
										/>
									))}
								</div>
							</div>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										color: "#64748b",
										marginBottom: "0.4rem",
										fontWeight: "600",
									}}>
									Representation Icon
								</label>
								<select
									name="icon"
									value={formData.icon}
									onChange={handleChange}
									style={{
										width: "100%",
										padding: "0.75rem",
										borderRadius: "10px",
										border: "1px solid #e2e8f0",
										fontSize: "0.9rem",
										background: "white",
									}}>
									{iconOptions.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminBlog;
