import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Comment cannot exceed 1000 characters"]
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, "Likes cannot be negative"]
  },
  dislikes: {
    type: Number,
    default: 0,
    min: [0, "Dislikes cannot be negative"]
  },
  likedBy: [{
    type: String,
    trim: true
  }],
  dislikedBy: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"]
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true
  },
  campus: {
    type: String,
    required: [true, "Campus is required"],
    trim: true
  },
  course: {
    type: String,
    required: [true, "Course is required"],
    trim: true
  },
  year: {
    type: String,
    required: [true, "Year is required"],
    trim: true
  },
  semester: {
    type: String,
    required: [true, "Semester is required"],
    trim: true
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0,
    min: [0, "Likes cannot be negative"]
  },
  dislikes: {
    type: Number,
    default: 0,
    min: [0, "Dislikes cannot be negative"]
  },
  likedBy: [{
    type: String,
    trim: true
  }],
  dislikedBy: [{
    type: String,
    trim: true
  }],
  comments: [commentSchema],
  commentCount: {
    type: Number,
    default: 0,
    min: [0, "Comment count cannot be negative"]
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
forumPostSchema.index({ title: 'text', description: 'text', tags: 'text' });
forumPostSchema.index({ campus: 1, course: 1, year: 1, semester: 1, subject: 1 });
forumPostSchema.index({ likes: -1, commentCount: -1, createdAt: -1 });
forumPostSchema.index({ author: 1 });

// Virtual for total engagement
forumPostSchema.virtual('totalEngagement').get(function() {
  return this.likes + this.dislikes + this.commentCount;
});

export const ForumPost = mongoose.model("ForumPost", forumPostSchema);
