import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOwnerAuth } from "../../../../context/ownerAuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { getImageUrl, getFirstImage } from "../../../../utils/imageUtils";
import ImageGallery from "./components/ImageGallery";

const OwnerDashboard = () => {
  const [boardingPlaces, setBoardingPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("places");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const { token, owner, logout } = useOwnerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check owner approval status
  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!owner?.ownerId) return;
      
      try {
        const response = await axios.get(`http://localhost:5001/api/owner/status/${owner.ownerId}`);
        const status = response.data.status;
        
        if (status !== 'active') {
          // Redirect to pending approval page
          navigate('/owner/pending-approval');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
        // If there's an error, still redirect to pending approval for safety
        navigate('/owner/pending-approval');
      }
    };

    checkApprovalStatus();
  }, [owner?.ownerId, navigate]);

  const fetchBoardingPlaces = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5001/api/boarding-places/owner/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBoardingPlaces(res.data);
    } catch (err) {
      // Silently handle errors - don't show error messages for new owners
      console.log("Error loading boarding places:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!token || !owner?.ownerId) return;

    setBookingsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5001/api/boarding-bookings/owner/${owner.ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data);
    } catch (err) {
      // Silently handle errors - don't show error messages for new owners
      console.log("Error loading bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Load places when token/refreshKey changes
  useEffect(() => {
    if (!token) return;
    fetchBoardingPlaces();
  }, [token, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load bookings when token/owner/refreshKey changes
  useEffect(() => {
    if (!token || !owner?.ownerId) return;
    fetchBookings();
  }, [token, owner?.ownerId, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Force refresh when component mounts (in case of navigation from create page)
  useEffect(() => {
    const shouldRefresh = sessionStorage.getItem("refreshDashboard");
    if (shouldRefresh) {
      setRefreshKey((prev) => prev + 1);
      sessionStorage.removeItem("refreshDashboard");
    }
  }, []);

  // Check if we need to refresh data after navigation
  useEffect(() => {
    if (location.state?.refresh) {
      setRefreshKey((prev) => prev + 1);
      // Clear the refresh state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleEdit = (placeId) => {
    // Navigate to edit page with the place ID
    navigate(`/edit-boarding-place/${placeId}`);
  };

  const handleImageGallery = (place) => {
    setSelectedPlace(place);
    setShowImageGallery(true);
  };

  const handleImageUpdate = (updatedImages) => {
    setBoardingPlaces(prev => 
      prev.map(place => 
        place._id === selectedPlace._id 
          ? { ...place, images: updatedImages }
          : place
      )
    );
  };

  const handleCloseImageGallery = () => {
    setShowImageGallery(false);
    setSelectedPlace(null);
  };

  const handleDelete = async (placeId) => {
    if (window.confirm("Are you sure you want to delete this boarding place?")) {
      try {
        await axios.delete(
          `http://localhost:5001/api/boarding-places/${placeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Boarding place deleted successfully!");
        fetchBoardingPlaces(); // Refresh the list
      } catch (err) {
        toast.error("Failed to delete boarding place");
      }
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      let payload = { status };
      if (status === 'cancelled') {
        const input = window.prompt('Please enter a reason for rejecting this booking (required):');
        const reason = (input || '').trim();
        if (!reason || reason.length < 3) {
          toast.error('Cancellation reason is required (min 3 characters).');
          return;
        }
        payload = { status, cancellationReason: reason };
      }
      await axios.put(
        `http://localhost:5001/api/boarding-bookings/${bookingId}/status`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Booking ${status} successfully!`);
      fetchBookings(); // Refresh the bookings list
    } catch (err) {
      toast.error(`Failed to ${status} booking`);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Delete this booking permanently? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5001/api/boarding-bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (err) {
        toast.error('Failed to delete booking');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const hasListings = boardingPlaces.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Left side - Welcome message and owner info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Welcome back, <span className="text-orange-600">{owner?.fullName || 'Owner'}</span>! 👋
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-base">Manage your boarding places and bookings</p>
                </div>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate("/create-boarding-place")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create New Listing
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          <button
            onClick={() => setActiveTab("places")}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === "places"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Places ({boardingPlaces.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === "bookings"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Bookings ({bookings.filter(b => b.boardingPlaceId?.title && b.boardingPlaceId.title.trim().length > 0).length})
          </button>
        </div>
        {activeTab === "places" ? (
          <>
            {loading ? (
              <div className="text-center mt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
                <p className="text-gray-600 text-lg">
                  Loading your boarding places...
                </p>
              </div>
            ) : !hasListings ? (
              <div className="text-center mt-20 bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-12 h-12 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to Your Dashboard! 🎉
                  </h2>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Ready to get started?
                  </h3>
                  <p className="text-gray-600 mb-2 text-lg">
                    Create your first boarding place listing to begin attracting students.
                  </p>
                  <p className="text-gray-500 mb-8">
                    It's quick and easy - let's get you set up!
                  </p>
                  <button
                    onClick={() => navigate("/create-boarding-place")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-3 mx-auto"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Get Started - Create Listing
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {boardingPlaces.map((place) => {
                  const availableFromDate = place?.availableFrom
                    ? new Date(place.availableFrom)
                    : null;

                  return (
                    <div
                      key={place._id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                    >
                      <div className="relative">
                        <img
                          src={getImageUrl(getFirstImage(place.images))}
                          alt={place.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x300?text=No+Image";
                          }}
                        />
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            place.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            place.status === 'approved' ? 'bg-green-100 text-green-800' :
                            place.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            place.status === 'removed' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {place.status === 'pending' ? 'Pending Review' :
                             place.status === 'approved' ? 'Approved' :
                             place.status === 'rejected' ? 'Rejected' :
                             place.status === 'removed' ? 'Removed' :
                             'Unknown'}
                          </span>
                        </div>
                        
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => handleImageGallery(place)}
                            className="bg-white/90 hover:bg-blue-500 text-gray-700 hover:text-white p-2 rounded-lg shadow-md transition-all duration-200"
                            title="Manage Images"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(place._id)}
                            className="bg-white/90 hover:bg-white text-gray-700 hover:text-orange-600 p-2 rounded-lg shadow-md transition-all duration-200"
                            title="Edit"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(place._id)}
                            className="bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white p-2 rounded-lg shadow-md transition-all duration-200"
                            title="Delete"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-bold text-2xl">
                              Rs. {place.price}
                            </p>
                            {place.images && place.images.length > 0 && (
                              <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{place.images.length}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {place.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {place.description}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <p className="text-gray-700 font-medium">
                            {place.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8"
                            />
                          </svg>
                          <p className="text-gray-700">
                            Available from:{" "}
                            {availableFromDate
                              ? availableFromDate.toLocaleDateString()
                              : "—"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <p className="text-gray-700">{place.contactNumber}</p>
                        </div>

                        {place.amenities && place.amenities.length > 0 && (
                          <div className="border-t pt-4 mb-4">
                            <p className="text-sm font-semibold text-gray-900 mb-2">
                              Amenities:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {place.amenities.slice(0, 3).map((amenity, index) => (
                                <span
                                  key={index}
                                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {place.amenities.length > 3 && (
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                  +{place.amenities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Admin Review Information */}
                        {place.adminReview && (place.status === 'rejected' || place.status === 'removed') && (
                          <div className="border-t pt-4 mb-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <p className="text-sm font-semibold text-red-800">
                                  {place.status === 'rejected' ? 'Rejection Reason' : 'Removal Reason'}
                                </p>
                              </div>
                              <p className="text-sm text-red-700">
                                {place.adminReview.rejectionReason || place.adminReview.removalReason}
                              </p>
                              {place.adminReview.reviewedAt && (
                                <p className="text-xs text-red-600 mt-2">
                                  Reviewed on: {new Date(place.adminReview.reviewedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {bookingsLoading ? (
              <div className="text-center mt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
                <p className="text-gray-600 text-lg">Loading bookings...</p>
              </div>
            ) : bookings.filter(b => b.boardingPlaceId?.title && b.boardingPlaceId.title.trim().length > 0).length === 0 ? (
              <div className="text-center mt-20 bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No bookings yet 📋
                </h3>
                <p className="text-gray-600">
                  Once you create listings, students will be able to book your places and you'll see their requests here.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setBookingFilter("all")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        bookingFilter === "all"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All ({bookings.filter(b => b.boardingPlaceId?.title && b.boardingPlaceId.title.trim().length > 0).length})
                    </button>
                    <button
                      onClick={() => setBookingFilter("pending")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        bookingFilter === "pending"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Pending (
                      {bookings.filter((b) => b.status === "pending" && b.boardingPlaceId?.title && b.boardingPlaceId.title.trim().length > 0).length})
                    </button>
                    <button
                      onClick={() => setBookingFilter("completed")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        bookingFilter === "completed"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Completed (
                      {bookings.filter((b) => b.status === "completed" && b.boardingPlaceId?.title && b.boardingPlaceId.title.trim().length > 0).length})
                    </button>
                    <button
                      onClick={() => setBookingFilter("cancelled")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        bookingFilter === "cancelled"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Cancelled (
                      {
                        bookings.filter(
                          (b) => (b.status === "cancelled" || b.status === "canceled") && b.boardingPlaceId?.title && b.boardingPlaceId.title.trim().length > 0
                        ).length
                      }
                      )
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                {bookings
                    .filter((b) => b.boardingPlaceId?.title && b.boardingPlaceId.title.trim().length > 0)
                    .filter((b) =>
                      bookingFilter === "all"
                        ? true
                        : bookingFilter === "cancelled"
                        ? b.status === "cancelled" || b.status === "canceled"
                        : b.status === bookingFilter
                    )
                    .map((booking) => {
                      const checkIn = booking?.checkInDate
                        ? new Date(booking.checkInDate)
                        : null;
                      const bookedOn = booking?.bookingDate
                        ? new Date(booking.bookingDate)
                        : null;
                      const statusLabel = booking?.status
                        ? booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)
                        : "Unknown";

                      return (
                        <div
                          key={booking._id}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Property Image */}
                              <div className="lg:w-1/3">
                                <img
                                  src={getImageUrl(getFirstImage(booking.boardingPlaceId?.images))}
                                  alt={booking.boardingPlaceId?.title || "Boarding Place"}
                                  className="w-full h-48 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/300x200?text=No+Image";
                                  }}
                                />
                              </div>

                              {/* Booking Details */}
                              <div className="lg:w-2/3">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                      {booking.boardingPlaceId?.title || "Untitled place"}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                      📍 {booking.boardingPlaceId?.location || "—"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Booked by:{" "}
                                      <span className="font-medium">
                                        {booking.studentName || "—"}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        booking.status
                                      )}`}
                                    >
                                      {statusLabel}
                                    </span>
                                    {/* Payment display removed */}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Student Contact
                                    </p>
                                    <p className="font-semibold">
                                      {booking.studentPhone || "—"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {booking.studentEmail || ""}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">University</p>
                                    <p className="font-semibold">
                                      {booking.studentUniversity || "—"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {booking.studentCourse || ""}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Check-in Date
                                    </p>
                                    <p className="font-semibold">
                                      {checkIn ? checkIn.toLocaleDateString() : "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="font-semibold">
                                      {booking.duration} month(s)
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Total Amount
                                    </p>
                                    <p className="font-semibold text-orange-600">
                                      Rs. {booking.totalAmount}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      Booking Date
                                    </p>
                                    <p className="font-semibold">
                                      {bookedOn ? bookedOn.toLocaleDateString() : "—"}
                                    </p>
                                  </div>
                                </div>

                                {booking.selectedServices &&
                                  booking.selectedServices.length > 0 && (
                                    <div className="mb-4">
                                      <p className="text-sm text-gray-600">
                                        Additional Services
                                      </p>
                                      <div className="space-y-1">
                                        {booking.selectedServices.map(
                                          (service, index) => (
                                            <div
                                              key={index}
                                              className="flex justify-between text-sm"
                                            >
                                              <span>• {service.name}</span>
                                              <span className="text-orange-600">
                                                Rs. {service.price}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {booking.specialRequests && (
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                      Special Requests
                                    </p>
                                    <p className="text-gray-800">
                                      {booking.specialRequests}
                                    </p>
                                  </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                  {booking.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleBookingStatusUpdate(
                                            booking._id,
                                            "completed"
                                          )
                                        }
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                        Approve Booking
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleBookingStatusUpdate(
                                            booking._id,
                                            "cancelled"
                                          )
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                        Reject Booking
                                      </button>
                                    </>
                                  )}


                                  {booking.status === "completed" && (
                                    <button
                                      onClick={() => handleDeleteBooking(booking._id)}
                                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Delete
                                    </button>
                                  )}

                                  {booking.status === "cancelled" && (
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

                                  {/* Contact Student button removed as requested */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Image Gallery Modal */}
      {showImageGallery && selectedPlace && (
        <ImageGallery
          place={selectedPlace}
          onUpdate={handleImageUpdate}
          onClose={handleCloseImageGallery}
          token={token}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
