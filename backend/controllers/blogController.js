const Blog = require('../models/Blog');
const User = require('../models/User');

// Get all published blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ published: true })
      .populate('author', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments({ published: true });

    res.json({
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true })
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create blog (Admin only)
exports.createBlog = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Only admin users can create blog posts' });
    }

    const { title, content, excerpt, category, featuredImage, author, published = true } = req.body;

    // Validate required fields
    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: 'Title, content, and excerpt are required' });
    }

    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ message: 'A blog with this title already exists' });
    }

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      category: category || 'General',
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      published,
      author: req.userId,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Only admin users can update blog posts' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog updated', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Only admin users can delete blog posts' });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
