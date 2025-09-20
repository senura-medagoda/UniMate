import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Complaint title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Complaint description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  reportedBy: {
    type: String,
    required: [true, "Reporter ID is required"],
    trim: true
  },
  type: {
    type: String,
    required: [true, "Complaint type is required"],
    enum: ["material", "user", "forum_post", "comment", "other"],
    default: "other"
  },
  category: {
    type: String,
    required: [true, "Complaint category is required"],
    enum: ["inappropriate_content", "spam", "harassment", "copyright", "misinformation", "other"],
    default: "other"
  },
  againstUser: {
    type: String,
    trim: true
  },
  againstMaterial: {
    type: String,
    trim: true
  },
  againstPost: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "rejected"],
    default: "pending"
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, "Admin notes cannot exceed 500 characters"]
  },
  resolvedBy: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  }
}, { timestamps: true });

// Indexes for efficient querying
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ type: 1, category: 1 });
complaintSchema.index({ reportedBy: 1 });
complaintSchema.index({ againstUser: 1 });
complaintSchema.index({ againstMaterial: 1 });

export const Complaint = mongoose.model("Complaint", complaintSchema);
