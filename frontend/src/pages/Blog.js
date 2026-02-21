import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { blogAPI } from "../services/api";
import Newsletter from "../components/Newsletter";
import { AuthContext } from "../context/AuthContext";
import {
	DesktopTower,
	TrendUp,
	ArrowClockwise,
	MagnifyingGlass,
	Users,
	Gear,
	Plus,
} from "phosphor-react";

const iconsMap = {
	DesktopTower,
	TrendUp,
	ArrowClockwise,
	MagnifyingGlass,
	Users,
	Gear,
};

const Blog = () => {
	const { user } = useContext(AuthContext);
	const isDashboard = !!user;
	const [blogs, setBlogs] = useState([
		{
			_id: "1",
			title: "The Future of Digital Transformation",
			excerpt:
				"Explore how digital transformation is reshaping industries and what businesses need to know to stay competitive.",
			category: "Digital Strategy",
			author: { name: "Sarah Johnson" },
			createdAt: "2024-01-20",
			slug: "digital-transformation-future",
			featuredImage:
				"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
			color: "#0066cc",
			icon: DesktopTower,
		},
		{
			_id: "2",
			title: "Strategic Planning for Growth",
			excerpt:
				"Learn essential strategies for planning and executing sustainable business growth in competitive markets.",
			category: "Strategy",
			author: { name: "Michael Chen" },
			createdAt: "2024-01-18",
			slug: "strategic-planning-growth",
			featuredImage:
				"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
			color: "#00b4d8",
			icon: TrendUp,
		},
		{
			_id: "3",
			title: "Change Management Best Practices",
			excerpt:
				"Discover proven methodologies for managing organizational change and ensuring successful implementation.",
			category: "Management",
			author: { name: "Emma Williams" },
			createdAt: "2024-01-15",
			slug: "change-management-best-practices",
			featuredImage:
				"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
			color: "#0096c7",
			icon: ArrowClockwise,
		},
		{
			_id: "4",
			title: "Market Analysis and Competitive Intelligence",
			excerpt:
				"Understand how to conduct effective market analysis and leverage competitive intelligence for strategic advantage.",
			category: "Market Research",
			author: { name: "David Martinez" },
			createdAt: "2024-01-12",
			slug: "market-analysis-competitive-intelligence",
			featuredImage:
				"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
			color: "#0077b6",
			icon: MagnifyingGlass,
		},
		{
			_id: "5",
			title: "Building High-Performance Teams",
			excerpt:
				"Strategies for recruiting, developing, and retaining top talent to build competitive teams.",
			category: "Team Development",
			author: { name: "Lisa Anderson" },
			createdAt: "2024-01-10",
			slug: "building-high-performance-teams",
			featuredImage:
				"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
			color: "#00b4d8",
			icon: Users,
		},
		{
			_id: "6",
			title: "Operational Excellence Framework",
			excerpt:
				"Implement an operational excellence framework to improve efficiency and reduce costs across your organization.",
			category: "Operations",
			author: { name: "James Wilson" },
			createdAt: "2024-01-08",
			slug: "operational-excellence-framework",
			featuredImage:
				"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
			color: "#0066cc",
			icon: Gear,
		},
	]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState("All");

	const categories = [
		"All",
		"Digital Strategy",
		"Strategy",
		"Management",
		"Market Research",
		"Team Development",
		"Operations",
	];

	const filteredBlogs =
		selectedCategory === "All"
			? blogs
			: blogs.filter((blog) => blog.category === selectedCategory);

	const fetchBlogs = useCallback(async () => {
		try {
			setLoading(true);
			const response = await blogAPI.getAllBlogs(page, 9);
			setBlogs(response.data.blogs);
		} catch (error) {
			console.error("Error fetching blogs:", error);
			// Keep placeholder data on error
		} finally {
			setLoading(false);
		}
	}, [page]);

	useEffect(() => {
		// Fetch blogs from API
		fetchBlogs();
	}, [fetchBlogs]);

	if (loading) {
		return <div className="container mt-4">Loading blogs...</div>;
	}

	return (
		<div>
			{/* Hero Section */}
			{isDashboard ? (
				<div
					style={{
						background: "white",
						borderRadius: "20px",
						padding: "2.5rem",
						marginBottom: "2.5rem",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						borderLeft: "8px solid #7c3aed",
					}}>
					<div>
						<h1
							style={{
								margin: 0,
								fontSize: "2.2rem",
								color: "#1e293b",
								fontWeight: "800",
							}}>
							PositiveHills Blog ✍️
						</h1>
						<p
							style={{
								margin: "0.5rem 0 0 0",
								color: "#64748b",
								fontSize: "1.1rem",
							}}>
							Insights, strategies, and best practices for business success.
						</p>
					</div>
					{user?.isAdmin && (
						<Link
							to="/admin/blog"
							style={{
								padding: "0.75rem 1.5rem",
								background: "#7c3aed",
								color: "white",
								borderRadius: "12px",
								textDecoration: "none",
								fontWeight: "600",
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
								boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
								transition: "all 0.3s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = "translateY(-2px)";
								e.currentTarget.style.boxShadow =
									"0 6px 16px rgba(124, 58, 237, 0.4)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow =
									"0 4px 12px rgba(124, 58, 237, 0.3)";
							}}>
							<Plus size={20} weight="bold" />
							Manage Posts
						</Link>
					)}
				</div>
			) : (
				<section
					style={{
						backgroundImage:
							'linear-gradient(135deg, rgba(0, 102, 204, 0.85) 0%, rgba(0, 82, 163, 0.85) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop")',
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundAttachment: "fixed",
						color: "white",
						padding: "8rem 0",
						textAlign: "center",
						minHeight: "600px",
						display: "flex",
						alignItems: "center",
					}}>
					<div className="container">
						<h1
							style={{
								fontSize: "4rem",
								marginBottom: "1rem",
								fontWeight: "bold",
								letterSpacing: "1px",
							}}>
							PositiveHills Blog
						</h1>
						<p
							style={{
								fontSize: "1.4rem",
								marginBottom: "2rem",
								fontWeight: "300",
							}}>
							Insights, strategies, and best practices for business success
						</p>
						<p style={{ fontSize: "1.1rem", opacity: "0.95" }}>
							Expert articles on consulting, strategy, and organizational
							excellence
						</p>
					</div>
				</section>
			)}

			{/* Blog Section */}
			<section style={{ backgroundColor: "#f8f9fa", padding: "5rem 0" }}>
				<div className="container">
					<div style={{ textAlign: "center", marginBottom: "3rem" }}>
						<h2
							style={{
								color: "#0066cc",
								marginBottom: "1rem",
								fontSize: "2.5rem",
							}}>
							Latest Insights
						</h2>
						<p style={{ fontSize: "1.1rem", color: "#666" }}>
							Stay informed with our expert articles and thought leadership
						</p>
					</div>

					{/* Category Filter */}
					<div
						style={{
							display: "flex",
							gap: "1rem",
							justifyContent: "center",
							flexWrap: "wrap",
							marginBottom: "3rem",
						}}>
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setSelectedCategory(cat)}
								style={{
									padding: "0.7rem 1.5rem",
									borderRadius: "25px",
									border: selectedCategory === cat ? "none" : "2px solid #ddd",
									background: selectedCategory === cat ? "#0066cc" : "white",
									color: selectedCategory === cat ? "white" : "#666",
									fontWeight: "600",
									cursor: "pointer",
									transition: "all 0.3s ease",
									fontSize: "0.95rem",
								}}
								onMouseEnter={(e) => {
									if (selectedCategory !== cat) {
										e.target.style.borderColor = "#0066cc";
										e.target.style.color = "#0066cc";
									}
								}}
								onMouseLeave={(e) => {
									if (selectedCategory !== cat) {
										e.target.style.borderColor = "#ddd";
										e.target.style.color = "#666";
									}
								}}>
								{cat}
							</button>
						))}
					</div>

					{/* Blog Grid */}
					{filteredBlogs.length === 0 ? (
						<div
							style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
							<p style={{ fontSize: "1.1rem" }}>
								No blog posts available for this category.
							</p>
						</div>
					) : (
						<>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
									gap: "2.5rem",
								}}>
								{filteredBlogs.map((blog) => (
									<Link
										key={blog._id}
										to={`/blog/${blog.slug}`}
										style={{ textDecoration: "none", color: "inherit" }}>
										<div
											style={{
												background: "white",
												borderRadius: "12px",
												overflow: "hidden",
												boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
												transition: "all 0.3s ease",
												cursor: "pointer",
												height: "100%",
												display: "flex",
												flexDirection: "column",
												borderLeft: `5px solid ${blog.color || "#0066cc"}`,
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = "translateY(-8px)";
												e.currentTarget.style.boxShadow =
													"0 12px 24px rgba(0, 0, 0, 0.15)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = "translateY(0)";
												e.currentTarget.style.boxShadow =
													"0 4px 12px rgba(0, 0, 0, 0.08)";
											}}>
											{/* Featured Image */}
											<div
												style={{
													position: "relative",
													overflow: "hidden",
													height: "220px",
												}}>
												<img
													src={
														blog.featuredImage ||
														"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
													}
													alt={blog.title}
													style={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
														transition: "transform 0.3s ease",
													}}
													onMouseEnter={(e) => {
														e.target.style.transform = "scale(1.05)";
													}}
													onMouseLeave={(e) => {
														e.target.style.transform = "scale(1)";
													}}
												/>
												<div
													style={{
														position: "absolute",
														top: "1rem",
														right: "1rem",
														background: blog.color || "#0066cc",
														color: "white",
														padding: "0.5rem 1rem",
														borderRadius: "20px",
														fontSize: "0.85rem",
														fontWeight: "600",
													}}>
													{blog.category}
												</div>
											</div>

											{/* Content */}
											<div
												style={{
													padding: "2rem",
													flex: "1",
													display: "flex",
													flexDirection: "column",
												}}>
												<div
													style={{
														fontSize: "2.5rem",
														marginBottom: "0.75rem",
														color: blog.color || "#0066cc",
													}}>
													{(() => {
														const iconValue = blog.icon;
														let IconComp =
															typeof iconValue === "string"
																? iconsMap[iconValue]
																: iconValue;
														if (!IconComp) {
															IconComp = TrendUp; // safe fallback
														}

														// Ensure IconComp is a valid component before creating it
														if (
															typeof IconComp === "function" ||
															(typeof IconComp === "object" &&
																IconComp !== null)
														) {
															return React.createElement(IconComp, {
																size: 40,
																weight: "bold",
															});
														}

														// Fallback UI if something unexpected is present
														return (
															<div
																style={{ fontSize: "1.8rem", lineHeight: "1" }}>
																🔖
															</div>
														);
													})()}
												</div>
												<h3
													style={{
														color: blog.color || "#0066cc",
														marginBottom: "0.75rem",
														fontSize: "1.3rem",
														lineHeight: "1.4",
													}}>
													{blog.title}
												</h3>
												<p
													style={{
														color: "#666",
														lineHeight: "1.7",
														marginBottom: "1rem",
														flex: "1",
													}}>
													{blog.excerpt}
												</p>

												{/* Footer */}
												<div
													style={{
														borderTop: "1px solid #eee",
														paddingTop: "1rem",
													}}>
													<div
														style={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
														}}>
														<small style={{ color: "#999" }}>
															By <strong>{blog.author?.name || "Admin"}</strong>
														</small>
														<small style={{ color: "#999" }}>
															{new Date(blog.createdAt).toLocaleDateString()}
														</small>
													</div>
													<div style={{ marginTop: "0.75rem" }}>
														<span
															style={{
																color: blog.color || "#0066cc",
																fontWeight: "600",
																fontSize: "0.9rem",
																display: "flex",
																alignItems: "center",
															}}>
															Read More →
														</span>
													</div>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>

							{/* Pagination */}
							<div style={{ textAlign: "center", marginTop: "3rem" }}>
								{page > 1 && (
									<button
										onClick={() => setPage(page - 1)}
										style={{
											padding: "0.75rem 1.5rem",
											marginRight: "1rem",
											background: "white",
											border: "2px solid #0066cc",
											color: "#0066cc",
											fontWeight: "600",
											borderRadius: "6px",
											cursor: "pointer",
											transition: "all 0.3s ease",
										}}
										onMouseEnter={(e) => {
											e.target.style.background = "#0066cc";
											e.target.style.color = "white";
										}}
										onMouseLeave={(e) => {
											e.target.style.background = "white";
											e.target.style.color = "#0066cc";
										}}>
										← Previous
									</button>
								)}
								<span
									style={{
										color: "#666",
										fontWeight: "600",
										margin: "0 1rem",
									}}>
									Page {page}
								</span>
								{filteredBlogs.length === 9 && (
									<button
										onClick={() => setPage(page + 1)}
										style={{
											padding: "0.75rem 1.5rem",
											marginLeft: "1rem",
											background: "#0066cc",
											border: "none",
											color: "white",
											fontWeight: "600",
											borderRadius: "6px",
											cursor: "pointer",
											transition: "all 0.3s ease",
										}}
										onMouseEnter={(e) => {
											e.target.style.transform = "translateY(-2px)";
											e.target.style.boxShadow =
												"0 4px 12px rgba(0, 102, 204, 0.3)";
										}}
										onMouseLeave={(e) => {
											e.target.style.transform = "translateY(0)";
											e.target.style.boxShadow = "none";
										}}>
										Next →
									</button>
								)}
							</div>
						</>
					)}
				</div>
			</section>

			{/* Blog Resources Section */}
			<section style={{ backgroundColor: "white", padding: "5rem 0" }}>
				<div className="container">
					<div style={{ textAlign: "center", marginBottom: "3rem" }}>
						<h2
							style={{
								color: "#0066cc",
								marginBottom: "1rem",
								fontSize: "2.5rem",
							}}>
							Why Read Our Blog?
						</h2>
						<p style={{ fontSize: "1.1rem", color: "#666" }}>
							Gain valuable insights from industry experts and thought leaders
						</p>
					</div>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
							gap: "2rem",
						}}>
						{[
							{
								icon: "🎯",
								title: "Actionable Insights",
								description:
									"Practical strategies you can implement immediately",
							},
							{
								icon: "👨‍💼",
								title: "Expert Perspectives",
								description: "Learn from experienced consulting professionals",
							},
							{
								icon: "📊",
								title: "Data-Driven Content",
								description:
									"Research-backed articles with proven methodologies",
							},
							{
								icon: "💡",
								title: "Innovation Focus",
								description: "Stay ahead with cutting-edge business trends",
							},
							{
								icon: "🔗",
								title: "Industry Best Practices",
								description: "Discover what top companies are doing",
							},
							{
								icon: "📈",
								title: "Measurable Results",
								description: "Apply lessons learned from real case studies",
							},
						].map((item, idx) => (
							<div
								key={idx}
								style={{
									background: "#f8f9fa",
									borderRadius: "12px",
									padding: "2rem",
									textAlign: "center",
									borderTop: "4px solid #0066cc",
									transition: "all 0.3s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-5px)";
									e.currentTarget.style.boxShadow =
										"0 8px 20px rgba(0, 0, 0, 0.1)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow = "none";
								}}>
								<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
									{item.icon}
								</div>
								<h4 style={{ color: "#0066cc", marginBottom: "0.75rem" }}>
									{item.title}
								</h4>
								<p
									style={{
										color: "#666",
										lineHeight: "1.6",
										fontSize: "0.95rem",
									}}>
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section
				style={{
					background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
					color: "white",
					padding: "2rem 2rem",
					textAlign: "center",
					position: "relative",
					overflow: "hidden",
					borderTop: "2px solid rgba(255, 255, 255, 0.1)",
					borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
				}}>
				{/* Background decorative elements */}
				<div
					style={{
						position: "absolute",
						top: "-100px",
						right: "-80px",
						width: "500px",
						height: "500px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
						pointerEvents: "none",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "-150px",
						left: "-100px",
						width: "450px",
						height: "450px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
						pointerEvents: "none",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: "20%",
						left: "10%",
						width: "120px",
						height: "120px",
						borderRadius: "50%",
						border: "2px solid rgba(255, 255, 255, 0.1)",
						pointerEvents: "none",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "15%",
						right: "8%",
						width: "80px",
						height: "80px",
						borderRadius: "50%",
						border: "2px solid rgba(255, 255, 255, 0.1)",
						pointerEvents: "none",
					}}
				/>

				<div
					className="container"
					style={{ position: "relative", zIndex: "1" }}>
					<div style={{ maxWidth: "1000px", margin: "0 auto" }}>
						{/* Newsletter Header */}
						<div style={{ marginBottom: "2rem" }}>
							<div
								style={{
									fontSize: "3rem",
									marginBottom: "0.75rem",
									animation: "float 3s ease-in-out infinite",
								}}>
								📧
							</div>
							<h2
								style={{
									marginBottom: "0.5rem",
									fontSize: "2.2rem",
									fontWeight: "bold",
									letterSpacing: "-0.5px",
									textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
								}}>
								Stay Connected
							</h2>
							<p
								style={{
									fontSize: "1rem",
									marginBottom: "0.4rem",
									opacity: "0.98",
									fontWeight: "300",
								}}>
								Get exclusive insights and strategies delivered to your inbox
							</p>
							<p style={{ fontSize: "1rem", opacity: "0.9" }}>
								Join thousands of business leaders getting weekly tips and
								industry updates
							</p>
						</div>

						{/* Newsletter Form */}
						<div
							style={{
								background: "rgba(255, 255, 255, 0.97)",
								borderRadius: "16px",
								padding: "1.5rem 2rem",
								boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
								border: "1px solid rgba(255, 255, 255, 0.2)",
								backdropFilter: "blur(10px)",
								transition: "all 0.3s ease",
							}}>
							<Newsletter />
						</div>

						{/* Benefits */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
								gap: "1rem",
								marginTop: "1.5rem",
								textAlign: "center",
							}}>
							{[
								{ icon: "✓", text: "No spam" },
								{ icon: "📬", text: "Weekly updates" },
								{ icon: "🎁", text: "Exclusive tips" },
								{ icon: "📚", text: "Expert insights" },
							].map((benefit, idx) => (
								<div
									key={idx}
									style={{
										opacity: "1",
										padding: "1.5rem",
										borderRadius: "12px",
										background: "rgba(255, 255, 255, 0.08)",
										border: "1px solid rgba(255, 255, 255, 0.15)",
										transition: "all 0.3s ease",
										cursor: "default",
									}}>
									<div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
										{benefit.icon}
									</div>
									<p
										style={{
											fontSize: "0.95rem",
											margin: "0",
											fontWeight: "500",
										}}>
										{benefit.text}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Blog;
