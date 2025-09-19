import mongoose from 'mongoose';

const boardingBookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  boardingPlaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardingPlace',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentPhone: {
    type: String,
    required: true
  },
  studentUniversity: {
    type: String,
    required: true
  },
  studentCourse: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'online'],
    default: 'online'
  },
  specialRequests: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  selectedServices: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  servicesTotal: {
    type: Number,
    default: 0
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  confirmedDate: {
    type: Date
  },
  cancelledDate: {
    type: Date
  },
  cancellationReason: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
boardingBookingSchema.index({ studentId: 1, status: 1 });
boardingBookingSchema.index({ ownerId: 1, status: 1 });
boardingBookingSchema.index({ boardingPlaceId: 1, status: 1 });

const BoardingBooking = mongoose.model('BoardingBooking', boardingBookingSchema);

export default BoardingBooking;