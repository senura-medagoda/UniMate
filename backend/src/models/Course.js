// SM - Course Model
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
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
  department: {
    type: String,
    trim: true,
    maxlength: 100
  },
  duration: {
    type: Number, // in years
    min: 1,
    max: 10
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
courseSchema.index({ isActive: 1 });

export default mongoose.model('Course', courseSchema);
