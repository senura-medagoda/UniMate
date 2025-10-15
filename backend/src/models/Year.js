// SM - Year Model
import mongoose from 'mongoose';

const yearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 10
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Index for better performance (year already has unique index)
yearSchema.index({ isActive: 1 });

export default mongoose.model('Year', yearSchema);
