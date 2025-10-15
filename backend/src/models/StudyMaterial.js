import mongoose from "mongoose";

// SM - Study Material Model
const studyMaterialSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: { 
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"]
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
    keywords: [{ 
      type: String,
      trim: true
    }],
    fileUrl: { 
      type: String,
      trim: true
    },
    fileUrls: [{
      type: String,
      trim: true
    }],
    uploadedBy: { 
      type: String,
      required: [true, "Uploader ID is required"],
      trim: true
    },
    fulfilledRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialRequest"
    },
    rating: { 
      type: Number, 
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"]
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: [0, "Download count cannot be negative"]
    },
    likeCount: {
      type: Number,
      default: 0,
      min: [0, "Like count cannot be negative"]
    },
    unlikeCount: {
      type: Number,
      default: 0,
      min: [0, "Unlike count cannot be negative"]
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"]
    },
    likedBy: [{
      type: String, // user IDs who liked
      trim: true
    }],
    unlikedBy: [{
      type: String, // user IDs who unliked
      trim: true
    }],
    reviewedBy: [{
      userId: {
        type: String,
        trim: true
      },
      rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"]
      },
      review: {
        type: String,
        trim: true,
        maxlength: [500, "Review cannot exceed 500 characters"]
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for average rating calculation
studyMaterialSchema.virtual('averageRating').get(function() {
  if (this.reviewedBy && this.reviewedBy.length > 0) {
    const totalRating = this.reviewedBy.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / this.reviewedBy.length;
  }
  return 0;
});

// Pre-save middleware to update rating field with average
studyMaterialSchema.pre('save', function(next) {
  if (this.reviewedBy && this.reviewedBy.length > 0) {
    const totalRating = this.reviewedBy.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviewedBy.length;
  } else {
    this.rating = 0;
  }
  next();
});

// Index for better search performance
studyMaterialSchema.index({ title: 'text', description: 'text', keywords: 'text' });
studyMaterialSchema.index({ campus: 1, course: 1, year: 1, semester: 1 });
studyMaterialSchema.index({ rating: -1, reviewCount: -1 }); // For sorting by rating

export const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);
