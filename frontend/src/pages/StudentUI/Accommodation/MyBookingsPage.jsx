import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl, getFirstImage } from '../../../utils/imageUtils';
import AccommodationNavbar from './components/AccommodationNavbar';

const MyBookingsPage = ({ user, setUser }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Debug: Check user data
  console.log('MyBookingsPage - User data:', user);
  console.log('MyBookingsPage - User name:', user?.name);
  console.log('MyBookingsPage - User fname:', user?.fname);

  // Use actual user ID instead of mock
  const studentId = user?.id || user?._id || '64b0f0c0c0c0c0c0c0c0c0c0';
  
  // Debug: Check student ID
  console.log('MyBookingsPage - Student ID:', studentId);
  console.log('MyBookingsPage - User ID field:', user?.id);
  console.log('MyBookingsPage - User _ID field:', user?._id);

  useEffect(() => {
    if (user && (user.id || user._id)) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Use actual student ID from user session
      const res = await axios.get(`http://localhost:5001/api/boarding-bookings/student/${studentId}`);
      setBookings(res.data);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`http://localhost:5001/api/boarding-bookings/${bookingId}/cancel`, {
          cancellationReason: 'Cancelled by student'
        });
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Delete this booking permanently? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5001/api/boarding-bookings/${bookingId}`);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to delete booking');
        console.error('Error deleting booking:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const validBookings = bookings.filter(booking => booking.boardingPlaceId?.title && booking.boardingPlaceId.title.trim().length > 0);
  
  const filteredBookings = validBookings.filter(booking => {
    if (filter === 'all') return booking.status !== 'cancelled';
    return booking.status === filter;
  });

  const cancelledCount = validBookings.filter(b => b.status === 'cancelled').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AccommodationNavbar user={user} setUser={setUser} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccommodationNavbar user={user} setUser={setUser} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600 text-lg">
                Manage and track your accommodation bookings
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">{validBookings.filter(b => b.status !== 'cancelled').length}</p>
              <p className="text-gray-600">Total Bookings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {cancelledCount > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <span>You have {cancelledCount} cancelled {cancelledCount === 1 ? 'booking' : 'bookings'}.</span>
            </div>
            <button
              onClick={() => setFilter('cancelled')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              View Cancelled
            </button>
          </div>
        )}
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({validBookings.filter(b => b.status !== 'cancelled').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'pending'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({validBookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'cancelled'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({validBookings.filter(b => b.status === 'cancelled').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'completed'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({validBookings.filter(b => b.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start exploring boarding places!"
                : `No ${filter} bookings found.`
              }
            </p>
            {filter === 'all' && (
              <a
                href="/student/accommodation/boarding-places"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-block"
              >
                Explore Boarding Places
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Property Image */}
                    <div className="lg:w-1/3">
                      <img
                        src={getImageUrl(getFirstImage(booking.boardingPlaceId?.images))}
                        alt={booking.boardingPlaceId?.title}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="lg:w-2/3">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {booking.boardingPlaceId?.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            📍 {booking.boardingPlaceId?.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          {/* Payment display removed */}
                        </div>
                      </div>

                      {booking.status === 'cancelled' && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
                          <p className="font-semibold">Booking cancelled by owner</p>
                          {booking.cancelledDate && (
                            <p className="text-xs opacity-80">On {new Date(booking.cancelledDate).toLocaleDateString()}</p>
                          )}
                          {booking.cancellationReason && (
                            <p className="mt-1 text-sm">Reason: {booking.cancellationReason}</p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Check-in Date</p>
                          <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Check-out Date</p>
                          <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-semibold">{booking.duration} month(s)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-semibold text-orange-600">Rs. {booking.totalAmount}</p>
                        </div>
                      </div>

                      {booking.selectedServices && booking.selectedServices.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Additional Services</p>
                          <div className="space-y-1">
                            {booking.selectedServices.map((service, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>• {service.name}</span>
                                <span className="text-orange-600">Rs. {service.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {booking.specialRequests && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Special Requests</p>
                          <p className="text-gray-800">{booking.specialRequests}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => setSelectedBooking(booking)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Booking
                          </button>
                        )}

                        {booking.status === 'cancelled' && (
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h10" />
                            </svg>
                            Delete
                          </button>
                        )}

                        {/*{booking.status === 'confirmed' && (
                          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Contact Owner
                          </button>
                        )} */}

                        {booking.status === 'completed' && (
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                            title="Delete completed booking"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={getImageUrl(getFirstImage(selectedBooking.boardingPlaceId?.images))}
                    alt={selectedBooking.boardingPlaceId?.title}
                    className="w-full h-56 object-cover rounded-lg"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                  />
                  <h3 className="text-xl font-bold text-gray-900 mt-4">{selectedBooking.boardingPlaceId?.title}</h3>
                  <p className="text-gray-600">📍 {selectedBooking.boardingPlaceId?.location}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-semibold">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-semibold">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{selectedBooking.duration} month(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-semibold">Rs. {selectedBooking.monthlyRent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-semibold">Rs. {selectedBooking.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold text-orange-600">Rs. {selectedBooking.totalAmount}</span>
                  </div>

                  {selectedBooking.status === 'cancelled' && (
                    <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
                      <p className="font-semibold">Booking cancelled by owner</p>
                      {selectedBooking.cancelledDate && (
                        <p className="text-xs opacity-80">On {new Date(selectedBooking.cancelledDate).toLocaleDateString()}</p>
                      )}
                      {selectedBooking.cancellationReason && (
                        <p className="mt-1 text-sm">Reason: {selectedBooking.cancellationReason}</p>
                      )}
                    </div>
                  )}

                  {selectedBooking.selectedServices && selectedBooking.selectedServices.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Additional Services</p>
                      <div className="space-y-1 text-sm">
                        {selectedBooking.selectedServices.map((s, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{s.name}</span>
                            <span className="text-orange-600">Rs. {s.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBooking.specialRequests && (
                    <div className="border-t pt-3">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Special Requests</p>
                      <p className="text-gray-800">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={() => setSelectedBooking(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

