import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    enum: ["student", "admin", "moderator"],
    default: "student"
  },
  status: {
    type: String,
    enum: ["active", "suspended", "banned"],
    default: "active"
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
  profilePicture: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, "Bio cannot exceed 500 characters"]
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  suspensionReason: {
    type: String,
    trim: true
  },
  suspendedUntil: {
    type: Date
  },
  banReason: {
    type: String,
    trim: true
  },
  bannedAt: {
    type: Date
  },
  bannedBy: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Indexes for efficient querying
userSchema.index({ role: 1, status: 1 });
userSchema.index({ campus: 1, course: 1 });
userSchema.index({ status: 1, createdAt: -1 });

// Virtual for user statistics
userSchema.virtual('materialsCount', {
  ref: 'StudyMaterial',
  localField: '_id',
  foreignField: 'uploadedBy',
  count: true
});

userSchema.virtual('postsCount', {
  ref: 'ForumPost',
  localField: '_id',
  foreignField: 'author',
  count: true
});

userSchema.virtual('averageRating', {
  ref: 'StudyMaterial',
  localField: '_id',
  foreignField: 'uploadedBy',
  pipeline: [
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]
});

export const User = mongoose.model("User", userSchema);
