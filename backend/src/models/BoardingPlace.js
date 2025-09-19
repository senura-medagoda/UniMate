import mongoose from "mongoose";

const boardingPlaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    availableFrom: {
      type: Date,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String, 
    },
    // Admin approval fields
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'removed'],
      default: 'pending'
    },
    adminReview: {
      reviewedBy: {
        type: String,
        default: 'admin'
      },
      reviewedAt: {
        type: Date
      },
      rejectionReason: {
        type: String
      },
      removalReason: {
        type: String
      }
    },
    additionalServices: [
      {
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],
    // Admin-only visibility control (hidden from admin dashboard lists)
    adminHidden: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const BoardingPlace = mongoose.model("BoardingPlace", boardingPlaceSchema);

export default BoardingPlace;
