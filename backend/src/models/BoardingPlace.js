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
      ref: "BoardingOwner",
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String, // 'student' or 'owner'
    },
  },
  { timestamps: true }
);

const BoardingPlace = mongoose.model("BoardingPlace", boardingPlaceSchema);

export default BoardingPlace;
