<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    // Get all published blogs
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);
        $blogs = Blog::with('author:id,name,email')
            ->where('published', true)
            ->latest()
            ->paginate($limit);

        return response()->json([
            'blogs' => $blogs->items(),
            'pagination' => [
                'total' => $blogs->total(),
                'page' => $blogs->currentPage(),
                'pages' => $blogs->lastPage(),
            ],
        ]);
    }

    // Get single blog by slug
    public function show($slug)
    {
        $blog = Blog::with('author:id,name,email')
            ->where('slug', $slug)
            ->where('published', true)
            ->first();

        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        return response()->json($blog);
    }

    // Create blog (Admin only)
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Only admin users can create blog posts'], 403);
        }

        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'excerpt' => 'required|string',
        ]);

        $slug = Str::slug($request->title);

        if (Blog::where('slug', $slug)->exists()) {
            return response()->json(['message' => 'A blog with this title already exists'], 400);
        }

        $blog = Blog::create(array_merge($request->all(), [
            'slug' => $slug,
            'author_id' => $request->user()->id,
            'category' => $request->category ?: 'General',
            'featuredImage' => $request->featuredImage ?: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
            'published' => $request->published ?? true,
        ]));

        return response()->json(['message' => 'Blog created successfully', 'blog' => $blog], 201);
    }

    // Update blog (Admin only)
    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Only admin users can update blog posts'], 403);
        }

        $blog = Blog::find($id);
        if (!$blog) return response()->json(['message' => 'Blog not found'], 404);

        $blog->update($request->all());

        return response()->json(['message' => 'Blog updated', 'blog' => $blog]);
    }

    // Delete blog (Admin only)
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin) {
            return response()->json(['message' => 'Only admin users can delete blog posts'], 403);
        }

        $blog = Blog::find($id);
        if (!$blog) return response()->json(['message' => 'Blog not found'], 404);

        $blog->delete();

        return response()->json(['message' => 'Blog deleted']);
    }
}
