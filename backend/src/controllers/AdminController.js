import { StudyMaterial } from "../models/StudyMaterial.js";
import { ForumPost } from "../models/ForumPost.js";
import { Complaint } from "../models/Complaint.js";
import { User } from "../models/User.js";

// @desc Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMaterials,
      totalPosts,
      totalComplaints,
      pendingComplaints
    ] = await Promise.all([
      User.countDocuments(),
      StudyMaterial.countDocuments(),
      ForumPost.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "pending" })
    ]);

    res.json({
      totalUsers,
      totalMaterials,
      totalPosts,
      totalComplaints,
      pendingApprovals: pendingComplaints
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

// @desc Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const { status, type, category } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;
    
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

// @desc Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const { id } = req.params;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    
    complaint.status = status;
    if (adminNotes) complaint.adminNotes = adminNotes;
    if (status === "resolved" || status === "rejected") {
      complaint.resolvedBy = "admin"; // TODO: Get from auth middleware
      complaint.resolvedAt = new Date();
    }
    
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Failed to update complaint", error: error.message });
  }
};

// @desc Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { status, role, campus } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (role) query.role = role;
    if (campus) query.campus = campus;
    
    const users = await User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// @desc Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

// @desc Ban user
export const banUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.status = "banned";
    user.banReason = reason;
    user.bannedAt = new Date();
    user.bannedBy = "admin"; // TODO: Get from auth middleware
    
    await user.save();
    res.json({ message: "User banned successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to ban user", error: error.message });
  }
};

// @desc Suspend user
export const suspendUser = async (req, res) => {
  try {
    const { reason, duration } = req.body; // duration in days
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.status = "suspended";
    user.suspensionReason = reason;
    user.suspendedUntil = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    
    await user.save();
    res.json({ message: "User suspended successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to suspend user", error: error.message });
  }
};

// @desc Reactivate user
export const reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.status = "active";
    user.suspensionReason = undefined;
    user.suspendedUntil = undefined;
    user.banReason = undefined;
    user.bannedAt = undefined;
    user.bannedBy = undefined;
    
    await user.save();
    res.json({ message: "User reactivated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to reactivate user", error: error.message });
  }
};

// @desc Delete material (admin)
export const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    
    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    
    await StudyMaterial.findByIdAndDelete(materialId);
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete material", error: error.message });
  }
};

// @desc Delete forum post (admin)
export const deleteForumPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    await ForumPost.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// @desc Get analytics report
export const getAnalyticsReport = async (req, res) => {
  try {
    // Top materials by likes
    const topMaterials = await StudyMaterial.find()
      .sort({ likeCount: -1, downloadCount: -1 })
      .limit(10)
      .select('title subject likeCount downloadCount rating uploadedBy');

    // Top contributors
    const topContributors = await StudyMaterial.aggregate([
      {
        $group: {
          _id: "$uploadedBy",
          materialsCount: { $sum: 1 },
          totalLikes: { $sum: "$likeCount" },
          totalDownloads: { $sum: "$downloadCount" },
          averageRating: { $avg: "$rating" }
        }
      },
      { $sort: { materialsCount: -1 } },
      { $limit: 10 }
    ]);

    // Materials by campus
    const materialsByCampus = await StudyMaterial.aggregate([
      {
        $group: {
          _id: "$campus",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Materials by subject
    const materialsBySubject = await StudyMaterial.aggregate([
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Forum statistics
    const forumStats = await ForumPost.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalComments: { $sum: "$commentCount" },
          totalLikes: { $sum: "$likes" },
          totalDislikes: { $sum: "$dislikes" }
        }
      }
    ]);

    // Top forum contributors
    const topForumContributors = await ForumPost.aggregate([
      {
        $group: {
          _id: "$author",
          postsCount: { $sum: 1 },
          totalLikes: { $sum: "$likes" },
          totalComments: { $sum: "$commentCount" }
        }
      },
      { $sort: { postsCount: -1 } },
      { $limit: 10 }
    ]);

    // Complaint statistics
    const complaintStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity
    const recentMaterials = await StudyMaterial.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title uploadedBy createdAt');

    const recentPosts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title author createdAt');

    res.json({
      topMaterials,
      topContributors,
      materialsByCampus,
      materialsBySubject,
      forumStats: forumStats[0] || {},
      topForumContributors,
      complaintStats,
      recentActivity: {
        materials: recentMaterials,
        posts: recentPosts
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate analytics report", error: error.message });
  }
};

// @desc Create complaint
export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      againstUser,
      againstMaterial,
      againstPost
    } = req.body;

    const newComplaint = new Complaint({
      title,
      description,
      reportedBy: "student123", // TODO: Get from auth middleware
      type,
      category,
      againstUser,
      againstMaterial,
      againstPost
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: "Failed to create complaint", error: error.message });
  }
};
