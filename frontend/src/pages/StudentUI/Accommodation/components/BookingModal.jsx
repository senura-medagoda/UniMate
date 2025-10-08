import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingModal = ({ place, onClose, onSuccess, user }) => {
  // Use actual user ID instead of mock
  const studentId = user?.id || user?._id || '64b0f0c0c0c0c0c0c0c0c0c0';
  
  // Debug: Check user data
  console.log('BookingModal - User data:', user);
  console.log('BookingModal - Student ID:', studentId);

  const [formData, setFormData] = useState({
    studentName: user?.name || user?.fname || '',
    studentEmail: user?.email || '',
    studentPhone: user?.s_phone || '',
    studentUniversity: user?.s_uni || '',
    studentCourse: '', // This field is not in the Student model, so leave empty
    checkInDate: '',
    duration: 1,
    specialRequests: '',
    notes: ''
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const baseAmount = place.price * formData.duration;
    const securityDeposit = place.price;
    return baseAmount + securityDeposit;
  };

  const handleServiceToggle = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.studentName || !formData.studentEmail || !formData.studentPhone || 
          !formData.studentUniversity || !formData.studentCourse || !formData.checkInDate) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.studentEmail)) {
        toast.error('Please enter a valid email address');
        setSubmitting(false);
        return;
      }

      // Validate check-in date
      const checkInDate = new Date(formData.checkInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        toast.error('Check-in date cannot be in the past');
        setSubmitting(false);
        return;
      }

      const bookingData = {
        ...formData,
        boardingPlaceId: place._id,
        checkInDate: checkInDate,
        duration: parseInt(formData.duration),
        selectedServices: [],
        studentId: studentId // Use actual logged-in user's ID
      };

      console.log('Submitting booking data:', bookingData);
      
      const response = await axios.post('http://localhost:5001/api/boarding-bookings', bookingData);
      
      console.log('Booking response:', response.data);
      toast.success('Booking request submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error('Booking error:', error);
      
      if (error.response) {
        // Server responded with an error
        const errorMessage = error.response.data?.message || 'Failed to submit booking request';
        toast.error(errorMessage);
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        toast.error('Unable to connect to server. Please check your internet connection.');
        console.error('Network error:', error.request);
      } else {
        // Something else happened
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book This Place</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Place Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={place.images && place.images[0] ? place.images[0] : "https://via.placeholder.com/100x100?text=No+Image"}
                alt={place.title}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{place.title}</h3>
                <p className="text-gray-600 text-sm">{place.location}</p>
                <p className="text-orange-600 font-semibold">Rs. {place.price}/month</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                <input
                  type="text"
                  name="studentUniversity"
                  value={formData.studentUniversity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course of Study *</label>
                <input
                  type="text"
                  name="studentCourse"
                  value={formData.studentCourse}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science, Engineering"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months) *</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>
            </div>

            {/* Additional Services hidden */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                placeholder="Any special requirements or requests..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Any additional information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Cost Summary */}
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly Rent:</span>
                  <span>Rs. {place.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{formData.duration} month(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span>Rs. {place.price}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>Total Amount:</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Booking Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
