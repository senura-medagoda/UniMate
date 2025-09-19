import { ForumPost } from "../models/ForumPost.js";

// @desc Create a new forum post
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      campus,
      course,
      year,
      semester,
      subject,
      tags
    } = req.body;

    const newPost = new ForumPost({
      title,
      description,
      author: "student123", // TODO: Replace with actual user ID
      campus,
      course,
      year,
      semester,
      subject,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : []
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

// @desc Get all forum posts
export const getAllPosts = async (req, res) => {
  try {
    const { sort = "newest", campus, course, year, semester, subject, search } = req.query;
    
    let query = {};
    
    // Apply filters
    if (campus) query.campus = campus;
    if (course) query.course = course;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    
    // Apply search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Apply sorting
    let sortOption = {};
    switch (sort) {
      case "popular":
        sortOption = { likes: -1, commentCount: -1 };
        break;
      case "most_commented":
        sortOption = { commentCount: -1, likes: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default: // newest
        sortOption = { createdAt: -1 };
    }
    
    const posts = await ForumPost.find(query)
      .sort(sortOption)
      .limit(50);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// @desc Get a single forum post
export const getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error: error.message });
  }
};

// @desc Update a forum post
export const updatePost = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // TODO: Check if user is author or admin
    if (post.author !== "student123") {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }
    
    const updatedPost = await ForumPost.findByIdAndUpdate(
      req.params.id,
      { title, description, tags: tags ? tags.split(",").map(tag => tag.trim()) : [] },
      { new: true }
    );
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

// @desc Delete a forum post
export const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // TODO: Check if user is author or admin
    if (post.author !== "student123") {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// @desc Like a forum post
export const likePost = async (req, res) => {
  try {
    const { userId } = req.body; // TODO: Get from auth middleware
    const postId = req.params.id;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user already liked
    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Already liked this post" });
    }
    
    // Remove from disliked if previously disliked
    if (post.dislikedBy.includes(userId)) {
      post.dislikedBy = post.dislikedBy.filter(id => id !== userId);
      post.dislikes = Math.max(0, post.dislikes - 1);
    }
    
    // Add to liked
    post.likedBy.push(userId);
    post.likes += 1;
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to like post", error: error.message });
  }
};

// @desc Dislike a forum post
export const dislikePost = async (req, res) => {
  try {
    const { userId } = req.body; // TODO: Get from auth middleware
    const postId = req.params.id;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user already disliked
    if (post.dislikedBy.includes(userId)) {
      return res.status(400).json({ message: "Already disliked this post" });
    }
    
    // Remove from liked if previously liked
    if (post.likedBy.includes(userId)) {
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    }
    
    // Add to disliked
    post.dislikedBy.push(userId);
    post.dislikes += 1;
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike post", error: error.message });
  }
};

// @desc Add a comment to a forum post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = "student123"; // TODO: Get from auth middleware
    const postId = req.params.id;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.isLocked) {
      return res.status(400).json({ message: "Post is locked for comments" });
    }
    
    const newComment = {
      userId,
      text,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    };
    
    post.comments.push(newComment);
    post.commentCount += 1;
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

// @desc Update a comment
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = "student123"; // TODO: Get from auth middleware
    const { postId, commentId } = req.params;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user is comment author
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }
    
    comment.text = text;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment", error: error.message });
  }
};

// @desc Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const userId = "student123"; // TODO: Get from auth middleware
    const { postId, commentId } = req.params;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user is comment author or post author
    if (comment.userId !== userId && post.author !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }
    
    comment.remove();
    post.commentCount = Math.max(0, post.commentCount - 1);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};

// @desc Like a comment
export const likeComment = async (req, res) => {
  try {
    const { userId } = req.body; // TODO: Get from auth middleware
    const { postId, commentId } = req.params;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user already liked
    if (comment.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Already liked this comment" });
    }
    
    // Remove from disliked if previously disliked
    if (comment.dislikedBy.includes(userId)) {
      comment.dislikedBy = comment.dislikedBy.filter(id => id !== userId);
      comment.dislikes = Math.max(0, comment.dislikes - 1);
    }
    
    // Add to liked
    comment.likedBy.push(userId);
    comment.likes += 1;
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to like comment", error: error.message });
  }
};

// @desc Dislike a comment
export const dislikeComment = async (req, res) => {
  try {
    const { userId } = req.body; // TODO: Get from auth middleware
    const { postId, commentId } = req.params;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user already disliked
    if (comment.dislikedBy.includes(userId)) {
      return res.status(400).json({ message: "Already disliked this comment" });
    }
    
    // Remove from liked if previously liked
    if (comment.likedBy.includes(userId)) {
      comment.likedBy = comment.likedBy.filter(id => id !== userId);
      comment.likes = Math.max(0, comment.likes - 1);
    }
    
    // Add to disliked
    comment.dislikedBy.push(userId);
    comment.dislikes += 1;
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike comment", error: error.message });
  }
};

// @desc Get posts by author
export const getPostsByAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    const posts = await ForumPost.find({ author })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// @desc Search posts
export const searchPosts = async (req, res) => {
  try {
    const { q, sort = "relevance" } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "popular":
        sortOption = { likes: -1, commentCount: -1 };
        break;
      default: // relevance
        sortOption = { score: { $meta: "textScore" } };
    }
    
    const posts = await ForumPost.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort(sortOption)
      .limit(20);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
