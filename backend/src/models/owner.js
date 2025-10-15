import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'inactive', 'removed'], 
    default: 'pending' 
  },
  adminReview: {
    reviewedBy: String,
    reviewedAt: Date,
    action: String
  }
});

export default mongoose.model('Owner', ownerSchema);
