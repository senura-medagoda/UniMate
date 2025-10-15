// SM - Semester Model
import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 8
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

// Index for better performance (semester already has unique index)
semesterSchema.index({ isActive: 1 });

export default mongoose.model('Semester', semesterSchema);
