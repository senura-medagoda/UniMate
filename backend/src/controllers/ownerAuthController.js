import Owner from '../models/owner.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'pzUuguyJKW';

// Register new owner (optional)
export const registerOwner = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      phoneNumber, 
      address 
    } = req.body;

    const existing = await Owner.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Owner already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({ 
      fullName, 
      email, 
      password: hashedPassword,
      phoneNumber,
      address,
      joinedDate: new Date()
    });
    await newOwner.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register', error: err });
  }
};

// Login owner
export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Check owner status
    if (owner.status === 'removed') {
      return res.status(403).json({ message: 'Account has been removed' });
    }

    if (owner.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive. Please contact admin.' });
    }

    if (owner.status === 'pending') {
      return res.status(403).json({ 
        message: 'Account is pending approval. Please wait for admin approval before logging in.',
        status: 'pending'
      });
    }

    const token = jwt.sign(
      { id: owner._id, email: owner.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      ownerId: owner._id, 
      fullName: owner.fullName,
      status: owner.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};

// Admin: Get all owners
export const getAllOwnersForAdmin = async (req, res) => {
  try {
    const owners = await Owner.find({}).select('-password');
    res.status(200).json(owners);
  } catch (error) {
    console.error('Error fetching owners:', error);
    res.status(500).json({ message: 'Failed to fetch owners', error: error.message });
  }
};

// Admin: Activate owner
export const activateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    owner.status = 'active';
    owner.adminReview = {
      reviewedBy: 'Admin',
      reviewedAt: new Date(),
      action: 'activated'
    };
    
    await owner.save();
    
    res.status(200).json({ message: 'Owner activated successfully', owner });
  } catch (error) {
    console.error('Error activating owner:', error);
    res.status(500).json({ message: 'Failed to activate owner', error: error.message });
  }
};

// Admin: Deactivate owner
export const deactivateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    owner.status = 'inactive';
    owner.adminReview = {
      reviewedBy: 'Admin',
      reviewedAt: new Date(),
      action: 'deactivated'
    };
    
    await owner.save();
    
    res.status(200).json({ message: 'Owner deactivated successfully', owner });
  } catch (error) {
    console.error('Error deactivating owner:', error);
    res.status(500).json({ message: 'Failed to deactivate owner', error: error.message });
  }
};

// Admin: Remove owner
export const removeOwner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Import required models for cascading deletion
    const BoardingPlace = (await import('../models/BoardingPlace.js')).default;
    const BoardingBooking = (await import('../models/BoardingBooking.js')).default;

    // Delete all boarding places created by this owner
    const deletedPlaces = await BoardingPlace.deleteMany({ ownerId: id });
    console.log(`Deleted ${deletedPlaces.deletedCount} boarding places for owner ${id}`);

    // Delete all bookings related to this owner's places
    const deletedBookings = await BoardingBooking.deleteMany({ 
      'boardingPlaceId.ownerId': id 
    });
    console.log(`Deleted ${deletedBookings.deletedCount} bookings for owner ${id}`);

    // Update owner status to removed
    owner.status = 'removed';
    owner.adminReview = {
      reviewedBy: 'Admin',
      reviewedAt: new Date(),
      action: 'removed'
    };
    
    await owner.save();
    
    res.status(200).json({ 
      message: 'Owner and all related data removed successfully', 
      owner,
      deletedData: {
        places: deletedPlaces.deletedCount,
        bookings: deletedBookings.deletedCount
      }
    });
  } catch (error) {
    console.error('Error removing owner:', error);
    res.status(500).json({ message: 'Failed to remove owner', error: error.message });
  }
};

// Get owner status (for pending approval page)
export const getOwnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const owner = await Owner.findById(id).select('status fullName email');
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.status(200).json({ 
      status: owner.status,
      fullName: owner.fullName,
      email: owner.email
    });
  } catch (error) {
    console.error('Error getting owner status:', error);
    res.status(500).json({ message: 'Failed to get owner status', error: error.message });
  }
};

// Find owner by email (for pending users)
export const findOwnerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const owner = await Owner.findOne({ email }).select('_id fullName email status');
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.status(200).json(owner);
  } catch (error) {
    console.error('Error finding owner by email:', error);
    res.status(500).json({ message: 'Failed to find owner', error: error.message });
  }
};