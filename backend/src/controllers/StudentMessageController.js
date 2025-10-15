// SM - Student Message Controller
import StudentMessage from '../models/StudentMessage.js';
import Student from '../models/Student.js';

// Send a message to admin (student)
export const sendMessageToAdmin = async (req, res) => {
  try {
    const { subject, message, priority } = req.body;
    const { _id: userId } = req.std;

    if (!subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subject and message are required' 
      });
    }

    // Get student details
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Create the message
    const newMessage = new StudentMessage({
      studentId: userId,
      studentName: `${student.s_fname} ${student.s_lname}`,
      studentEmail: student.s_email,
      subject,
      message,
      priority: priority || 'normal'
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent to admin successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message to admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message' 
    });
  }
};

// Get all messages (admin)
export const getAllMessages = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const messages = await StudentMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudentMessage.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages' 
    });
  }
};

// Get messages by student (student)
export const getStudentMessages = async (req, res) => {
  try {
    const { _id: userId } = req.std;
    
    const messages = await StudentMessage.find({ studentId: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching student messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages' 
    });
  }
};

// Get single message
export const getMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await StudentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch message' 
    });
  }
};

// Mark message as read (admin)
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await StudentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to mark message as read' 
    });
  }
};

// Reply to message (admin)
export const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reply } = req.body;
    // Admin user ID - for now using a default admin ID
    const userId = 'admin';

    if (!reply) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reply content is required' 
      });
    }

    const message = await StudentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    message.adminReply = reply;
    message.repliedAt = new Date();
    message.repliedBy = userId;
    message.status = 'replied';
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send reply' 
    });
  }
};

// Delete message (student)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { _id: userId } = req.std;

    const message = await StudentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    // Check if user is the sender
    if (message.studentId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own messages' 
      });
    }

    await StudentMessage.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete message' 
    });
  }
};

// Update message status (admin)
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    if (!['pending', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const message = await StudentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    message.status = status;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status' 
    });
  }
};

// Accept message (admin)
export const acceptMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const adminName = req.admin?.email || 'Study Material Admin';

    const message = await StudentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    message.status = 'accepted';
    message.adminAction = 'accept';
    message.actionAt = new Date();
    message.repliedBy = adminName;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message accepted successfully',
      data: message
    });
  } catch (error) {
    console.error('Error accepting message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to accept message' 
    });
  }
};

// Reject message (admin)
export const rejectMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const adminName = req.admin?.email || 'Study Material Admin';

    const message = await StudentMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    message.status = 'rejected';
    message.adminAction = 'reject';
    message.actionAt = new Date();
    message.repliedBy = adminName;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message rejected successfully',
      data: message
    });
  } catch (error) {
    console.error('Error rejecting message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject message' 
    });
  }
};
