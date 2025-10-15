// SM - Campus Model
import mongoose from 'mongoose';

const campusSchema = new mongoose.Schema({
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
    maxlength: 200
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
campusSchema.index({ isActive: 1 });

export default mongoose.model('Campus', campusSchema);
