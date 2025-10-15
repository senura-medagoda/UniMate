// SM - Subject Model
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, unique: true, trim: true, uppercase: true },
  category: { type: String, trim: true }, // e.g., "Mathematics", "Science", "Engineering"
  isActive: { type: Boolean, default: true },
  description: { type: String, trim: true }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
