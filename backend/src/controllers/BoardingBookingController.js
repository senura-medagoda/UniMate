import BoardingBooking from '../models/BoardingBooking.js';
import BoardingPlace from '../models/BoardingPlace.js';

// @desc    Create a new booking
// @route   POST /api/boarding-bookings
// @access  Private (Student)
export const createBooking = async (req, res) => {
  try {
    console.log("Creating booking:", req.body);
    
    const {
      boardingPlaceId,
      studentName,
      studentEmail,
      studentPhone,
      studentUniversity,
      studentCourse,
      checkInDate,
      duration,
      specialRequests,
      notes,
      selectedServices = []
    } = req.body;

    // Get boarding place details
    const boardingPlace = await BoardingPlace.findById(boardingPlaceId);
    if (!boardingPlace) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }

    // Calculate amounts
    const monthlyRent = boardingPlace.price;
    const baseAmount = monthlyRent * duration;
    const securityDeposit = monthlyRent; // One month rent as security deposit
    
    // Calculate services total
    const servicesTotal = selectedServices.reduce((total, service) => total + service.price, 0);
    const totalAmount = baseAmount + servicesTotal;

    // Calculate check-out date based on duration
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setMonth(checkOutDate.getMonth() + duration);

    const booking = new BoardingBooking({
      studentId: req.student?._id || req.body.studentId || 'mock-student-id', // For now, we'll use mock student ID
      boardingPlaceId,
      ownerId: boardingPlace.ownerId,
      studentName,
      studentEmail,
      studentPhone,
      studentUniversity,
      studentCourse,
      checkInDate: new Date(checkInDate),
      checkOutDate,
      duration,
      totalAmount,
      monthlyRent,
      securityDeposit,
      selectedServices,
      servicesTotal,
      specialRequests,
      notes
    });

    const savedBooking = await booking.save();
    console.log("Booking created successfully:", savedBooking._id);
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// @desc    Get all bookings for a student
// @route   GET /api/boarding-bookings/student/:studentId
// @access  Private (Student)
export const getStudentBookings = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Fetching bookings for student:", studentId);
    
    const bookings = await BoardingBooking.find({ studentId })
      .populate('boardingPlaceId', 'title location price images amenities')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });
    
    console.log("Found", bookings.length, "bookings for student");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching student bookings:", error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// @desc    Get all bookings for an owner
// @route   GET /api/boarding-bookings/owner/:ownerId
// @access  Private (Owner)
export const getOwnerBookings = async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log("Fetching bookings for owner:", ownerId);
    
    const bookings = await BoardingBooking.find({ ownerId })
      .populate('boardingPlaceId', 'title location price images amenities')
      .populate('studentId', 'name email phone university')
      .sort({ createdAt: -1 });
    
    console.log("Found", bookings.length, "bookings for owner");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/boarding-bookings/:id
// @access  Private (Student/Owner)
export const getBookingById = async (req, res) => {
  try {
    const booking = await BoardingBooking.findById(req.params.id)
      .populate('boardingPlaceId', 'title location price images amenities contactNumber')
      .populate('ownerId', 'name email phone')
      .populate('studentId', 'name email phone university');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/boarding-bookings/:id/status
// @access  Private (Owner)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    console.log("Updating booking status:", id, "to", status);
    
    const updateData = { status };
    
    if (status === 'completed') {
      updateData.completedDate = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledDate = new Date();
      updateData.cancellationReason = req.body.cancellationReason || '';
    }
    
    const booking = await BoardingBooking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('boardingPlaceId', 'title location')
     .populate('studentId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log("Booking status updated successfully");
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/boarding-bookings/:id/cancel
// @access  Private (Student)
export const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const { id } = req.params;
    
    console.log("Cancelling booking:", id);
    
    const booking = await BoardingBooking.findByIdAndUpdate(
      id,
      {
        status: 'cancelled',
        cancelledDate: new Date(),
        cancellationReason
      },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log("Booking cancelled successfully");
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

// @desc    Permanently delete a booking (only if cancelled)
// @route   DELETE /api/boarding-bookings/:id
// @access  Private (Student)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BoardingBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'cancelled' && booking.status !== 'completed') {
      return res.status(400).json({ message: 'Only cancelled or completed bookings can be deleted permanently' });
    }

    await BoardingBooking.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
};

// @desc    Get booking statistics for owner
// @route   GET /api/boarding-bookings/owner/:ownerId/stats
// @access  Private (Owner)
export const getOwnerBookingStats = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const stats = await BoardingBooking.aggregate([
      { $match: { ownerId: mongoose.Types.ObjectId(ownerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalBookings = await BoardingBooking.countDocuments({ ownerId });
    const totalRevenue = await BoardingBooking.aggregate([
      { $match: { ownerId: mongoose.Types.ObjectId(ownerId), status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.status(200).json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({ message: 'Failed to fetch booking statistics', error: error.message });
  }
};
