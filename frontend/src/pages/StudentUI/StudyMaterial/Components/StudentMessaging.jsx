// SM - Student Messaging Component
import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaTrash, FaEdit, FaCheck, FaTimes, FaEnvelope, FaUser, FaCalendar, FaExclamationTriangle } from 'react-icons/fa';
import api from '/src/lib/axios.js';

const StudentMessaging = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  // Fetch student messages
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      console.log('Fetching messages with token:', token ? 'Present' : 'Missing');
      
      const response = await api.get('/student-messages/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Messages response:', response.data);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      console.error('Error details:', error.response?.data);
      setMessages([]);
    }
  };

  // Send message to admin
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('studentToken');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Sending message:', formData);
      
      const response = await api.post('/student-messages/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Response:', response.data);
      setMessages(prev => [response.data.data, ...(prev || [])]);
      setFormData({ subject: '', message: '', priority: 'normal' });
      setShowForm(false);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/student-messages/${messageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });

      setMessages(prev => (prev || []).filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  // Start editing message
  const startEdit = (message) => {
    setEditingMessage(message._id);
    setFormData({
      subject: message.subject,
      message: message.message,
      priority: message.priority
    });
    setShowForm(true);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingMessage(null);
    setFormData({ subject: '', message: '', priority: 'normal' });
    setShowForm(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'resolved': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <FaEnvelope className="mr-2 text-orange-500" />
          Send Message to Admin
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <FaPaperPlane className="mr-2" />
          {showForm ? 'Cancel' : 'New Message'}
        </button>
      </div>

      {/* Message Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">
            {editingMessage ? 'Edit Message' : 'Send Message to Admin'}
          </h4>
          <form onSubmit={sendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter message subject..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32"
                placeholder="Enter your message..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center"
              >
                <FaPaperPlane className="mr-2" />
                {loading ? 'Sending...' : (editingMessage ? 'Update' : 'Send')}
              </button>
              {editingMessage && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaEnvelope className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>No messages sent yet.</p>
            <p className="text-sm">Click "New Message" to send your first message to admin.</p>
          </div>
        ) : (
          (messages || []).map((message) => (
            <div key={message._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{message.subject}</h4>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                      {message.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                      {message.status.toUpperCase()}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <FaCalendar className="mr-1" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(message)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit message"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{message.message}</p>

              {message.adminReply && (
                <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                  <h5 className="font-medium text-green-800 mb-2 flex items-center">
                    <FaUser className="mr-2" />
                    Admin Reply:
                  </h5>
                  <p className="text-green-700">{message.adminReply}</p>
                  <p className="text-xs text-green-600 mt-2">
                    Replied on {new Date(message.repliedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentMessaging;
