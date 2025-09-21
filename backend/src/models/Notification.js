import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  type: {
    type: String,
    enum: ['listing_approved', 'listing_rejected', 'listing_removed'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  boardingPlaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardingPlace'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notifications', notificationSchema);

export default Notification;








