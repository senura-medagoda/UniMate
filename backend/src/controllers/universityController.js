// SM - University Controller
import University from '../models/University.js';

// Get all universities
export const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find({ isActive: true })
      .sort({ name: 1 })
      .select('-__v');
    
    res.status(200).json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create new university
export const createUniversity = async (req, res) => {
  try {
    const { name, code, location, description } = req.body;

    // Check if university already exists
    const existingUniversity = await University.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        ...(code ? [{ code: { $regex: new RegExp(`^${code}$`, 'i') } }] : [])
      ]
    });

    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        message: 'University with this name or code already exists'
      });
    }

    const university = new University({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : undefined,
      location: location ? location.trim() : undefined,
      description: description ? description.trim() : undefined
    });

    await university.save();

    res.status(201).json({
      success: true,
      message: 'University created successfully',
      data: university
    });
  } catch (error) {
    console.error('Error creating university:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update university
export const updateUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, location, description } = req.body;

    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    // Check if another university has the same name or code
    const existingUniversity = await University.findOne({
      _id: { $ne: id },
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        ...(code ? [{ code: { $regex: new RegExp(`^${code}$`, 'i') } }] : [])
      ]
    });

    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        message: 'Another university with this name or code already exists'
      });
    }

    university.name = name.trim();
    if (code) university.code = code.trim().toUpperCase();
    if (location) university.location = location.trim();
    if (description) university.description = description.trim();

    await university.save();

    res.status(200).json({
      success: true,
      message: 'University updated successfully',
      data: university
    });
  } catch (error) {
    console.error('Error updating university:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete university (soft delete)
export const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    // Soft delete by setting isActive to false
    university.isActive = false;
    await university.save();

    res.status(200).json({
      success: true,
      message: 'University deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting university:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get university by ID
export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findById(id).select('-__v');
    if (!university || !university.isActive) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    res.status(200).json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
