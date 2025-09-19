import mongoose from "mongoose";

const materialRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Request title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Request description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true
  },
  campus: {
    type: String,
    required: [true, "Campus is required"],
    enum: ["Malabe", "Kandy", "Matara", "Jaffna"]
  },
  course: {
    type: String,
    required: [true, "Course is required"],
    trim: true
  },
  year: {
    type: String,
    required: [true, "Year is required"],
    enum: ["1", "2", "3", "4"]
  },
  semester: {
    type: String,
    required: [true, "Semester is required"],
    enum: ["1", "2"]
  },
  urgency: {
    type: String,
    required: [true, "Urgency level is required"],
    enum: ["low", "normal", "high", "urgent"],
    default: "normal"
  },
  status: {
    type: String,
    enum: ["pending", "fulfilled", "expired"],
    default: "pending"
  },
  requestedBy: {
    type: String,
    required: [true, "Requester ID is required"],
    trim: true
  },
  fulfilledBy: {
    type: String,
    trim: true
  },
  fulfilledMaterial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyMaterial"
  },
  fulfilledAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Set expiration to 30 days from creation
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  }
}, { 
  timestamps: true 
});

// Indexes for efficient querying
materialRequestSchema.index({ status: 1, createdAt: -1 });
materialRequestSchema.index({ campus: 1, course: 1, subject: 1 });
materialRequestSchema.index({ urgency: 1, createdAt: -1 });
materialRequestSchema.index({ requestedBy: 1 });
materialRequestSchema.index({ fulfilledBy: 1 });
materialRequestSchema.index({ expiresAt: 1 });

// Virtual for checking if request is expired
materialRequestSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Pre-save middleware to check expiration
materialRequestSchema.pre('save', function(next) {
  if (this.isExpired && this.status === 'pending') {
    this.status = 'expired';
  }
  next();
});

export const MaterialRequest = mongoose.model("MaterialRequest", materialRequestSchema);
