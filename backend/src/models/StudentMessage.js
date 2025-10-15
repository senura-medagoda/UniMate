// SM - Student Message Model
import mongoose from 'mongoose';

const studentMessageSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
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
  subject: { 
    type: String, 
    required: true, 
    trim: true 
  },
  message: { 
    type: String, 
    required: true, 
    trim: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'normal', 'high', 'urgent'], 
    default: 'normal' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'resolved'], 
    default: 'pending' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  readAt: { 
    type: Date 
  },
  adminReply: { 
    type: String, 
    trim: true 
  },
  repliedAt: { 
    type: Date 
  },
  repliedBy: { 
    type: String,
    trim: true
  },
  adminAction: {
    type: String,
    enum: ['accept', 'reject'],
    default: null
  },
  actionAt: {
    type: Date
  }
}, { timestamps: true });

const StudentMessage = mongoose.model('StudentMessage', studentMessageSchema);
export default StudentMessage;
