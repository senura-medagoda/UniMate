import BoardingPlace from '../models/BoardingPlace.js';
import Notification from '../models/Notification.js';

// @desc    Create new boarding place
// @route   POST /api/boarding-places
// @access  Private (Boarding Owner only)
export const createBoardingPlace = async (req, res) => {
  try {
    const ownerId = req.owner?._id || req.body.ownerId;
    console.log("Creating boarding place for owner:", ownerId);
    console.log("Request body:", req.body);
    
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }
    
    const newPlace = new BoardingPlace({
      ...req.body,
      images: req.body.images || [],
      ownerId: ownerId, 
      createdBy: 'owner',
      status: 'pending' // New listings start as pending
    });

    const savedPlace = await newPlace.save();
    console.log("Boarding place created successfully:", savedPlace._id);
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error("Error creating boarding place:", error);
    res.status(500).json({ message: 'Failed to create boarding place', error });
  }
};

// @desc    Get all approved boarding places (for students)
// @route   GET /api/boarding-places
// @access  Public
export const getAllBoardingPlaces = async (req, res) => {
  try {
    const places = await BoardingPlace.find({ status: 'approved' });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch boarding places', error });
  }
};

// @desc    Get all boarding places for admin review
// @route   GET /api/boarding-places/admin/all
// @access  Private (Admin only)
export const getAllBoardingPlacesForAdmin = async (req, res) => {
  try {
    const places = await BoardingPlace.find({ adminHidden: { $ne: true } }).populate('ownerId', 'fullName email');
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch boarding places', error });
  }
};

// @desc    Get pending boarding places for admin review
// @route   GET /api/boarding-places/admin/pending
// @access  Private (Admin only)
export const getPendingBoardingPlaces = async (req, res) => {
  try {
    const places = await BoardingPlace.find({ status: 'pending', adminHidden: { $ne: true } }).populate('ownerId', 'fullName email');
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending boarding places', error });
  }
};

// @desc    Admin hide a boarding place from admin dashboard (does not affect public/owner views)
// @route   PUT /api/boarding-places/admin/:id/hide
// @access  Private (Admin only)
export const adminHideBoardingPlace = async (req, res) => {
  try {
    const place = await BoardingPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }

    place.adminHidden = true;
    await place.save();
    res.status(200).json({ message: 'Boarding place hidden from admin dashboard', placeId: place._id });
  } catch (error) {
    console.error('Error hiding boarding place:', error);
    res.status(500).json({ message: 'Failed to hide boarding place', error });
  }
};

// @desc    Approve a boarding place
// @route   PUT /api/boarding-places/admin/:id/approve
// @access  Private (Admin only)
export const approveBoardingPlace = async (req, res) => {
  try {
    const place = await BoardingPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }

    place.status = 'approved';
    place.adminReview.reviewedAt = new Date();
    place.adminReview.reviewedBy = 'admin';
    
    await place.save();

    // Create notification for owner
    const notification = new Notification({
      recipientId: place.ownerId,
      type: 'listing_approved',
      title: 'Listing Approved',
      message: `Your listing "${place.title}" has been approved and is now visible to students.`,
      boardingPlaceId: place._id
    });
    await notification.save();

    res.status(200).json({ message: 'Boarding place approved successfully', place });
  } catch (error) {
    console.error("Error approving boarding place:", error);
    res.status(500).json({ message: 'Failed to approve boarding place', error });
  }
};

// @desc    Reject a boarding place
// @route   PUT /api/boarding-places/admin/:id/reject
// @access  Private (Admin only)
export const rejectBoardingPlace = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason || rejectionReason.trim().length < 3) {
      return res.status(400).json({ message: 'Rejection reason is required (minimum 3 characters)' });
    }

    const place = await BoardingPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }

    place.status = 'rejected';
    place.adminReview.reviewedAt = new Date();
    place.adminReview.reviewedBy = 'admin';
    place.adminReview.rejectionReason = rejectionReason;
    
    await place.save();

    // Create notification for owner
    const notification = new Notification({
      recipientId: place.ownerId,
      type: 'listing_rejected',
      title: 'Listing Rejected',
      message: `Your listing "${place.title}" has been rejected. Reason: ${rejectionReason}`,
      boardingPlaceId: place._id
    });
    await notification.save();

    res.status(200).json({ message: 'Boarding place rejected successfully', place });
  } catch (error) {
    console.error("Error rejecting boarding place:", error);
    res.status(500).json({ message: 'Failed to reject boarding place', error });
  }
};

// @desc    Remove a boarding place
// @route   PUT /api/boarding-places/admin/:id/remove
// @access  Private (Admin only)
export const removeBoardingPlace = async (req, res) => {
  try {
    const { removalReason } = req.body;
    if (!removalReason || removalReason.trim().length < 3) {
      return res.status(400).json({ message: 'Removal reason is required (minimum 3 characters)' });
    }

    const place = await BoardingPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }

    place.status = 'removed';
    place.adminReview.reviewedAt = new Date();
    place.adminReview.reviewedBy = 'admin';
    place.adminReview.removalReason = removalReason;
    
    await place.save();

    // Create notification for owner
    const notification = new Notification({
      recipientId: place.ownerId,
      type: 'listing_removed',
      title: 'Listing Removed',
      message: `Your listing "${place.title}" has been removed. Reason: ${removalReason}`,
      boardingPlaceId: place._id
    });
    await notification.save();

    res.status(200).json({ message: 'Boarding place removed successfully', place });
  } catch (error) {
    console.error("Error removing boarding place:", error);
    res.status(500).json({ message: 'Failed to remove boarding place', error });
  }
};

// @desc    Get a single boarding place by ID
// @route   GET /api/boarding-places/:id
// @access  Public
export const getBoardingPlaceById = async (req, res) => {
  try {
    const place = await BoardingPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch boarding place', error });
  }
};

// @desc    Update a boarding place
// @route   PUT /api/boarding-places/:id
// @access  Private (Owner/Admin)
export const updateBoardingPlace = async (req, res) => {
  try {
    console.log("Updating boarding place:", req.params.id);
    console.log("Update data:", req.body);
    
    const updatedPlace = await BoardingPlace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlace) {
      console.log("Boarding place not found for ID:", req.params.id);
      return res.status(404).json({ message: 'Boarding place not found' });
    }
    console.log("Boarding place updated successfully:", updatedPlace._id);
    res.status(200).json(updatedPlace);
  } catch (error) {
    console.error("Error updating boarding place:", error);
    res.status(500).json({ message: 'Failed to update boarding place', error });
  }
};

// @desc    Delete a boarding place
// @route   DELETE /api/boarding-places/:id
// @access  Private (Owner/Admin)
export const deleteBoardingPlace = async (req, res) => {
  try {
    const deleted = await BoardingPlace.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }
    res.status(200).json({ message: 'Boarding place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete boarding place', error });
  }
};

export const getBoardingPlacesByOwner = async (req, res) => {
  try {
    const ownerId = req.owner._id; // This is set by the protect middleware
    console.log("Fetching boarding places for owner:", ownerId);
    const places = await BoardingPlace.find({ ownerId });
    console.log("Found", places.length, "boarding places for owner");
    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching boarding places:", error);
    res.status(500).json({ message: "Failed to fetch boarding places", error });
  }
};






