// SM - University Model
import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  code: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 10
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for better performance (name already has unique index)
universitySchema.index({ isActive: 1 });

export default mongoose.model('University', universitySchema);
