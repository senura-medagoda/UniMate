import mongoose from "mongoose";

const boardingBookingSchema = new mongoose.Schema(
  {
    boardingPlaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardingPlace",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const BoardingBooking = mongoose.model("BoardingBooking", boardingBookingSchema);

export default BoardingBooking;
