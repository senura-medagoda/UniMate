import BoardingPlace from '../models/BoardingPlace.js';

// @desc    Create new boarding place
// @route   POST /api/boarding-places
// @access  Private (Boarding Owner only)
export const createBoardingPlace = async (req, res) => {
  try {
    const newPlace = new BoardingPlace({
      ...req.body,
      image: req.file?.path,
      ownerId: req.body.ownerId, // assuming req.user is set after auth middleware
      createdBy: 'owner',
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create boarding place', error });
  }
};

// @desc    Get all boarding places
// @route   GET /api/boarding-places
// @access  Public
export const getAllBoardingPlaces = async (req, res) => {
  try {
    const places = await BoardingPlace.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch boarding places', error });
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
    const updatedPlace = await BoardingPlace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlace) {
      return res.status(404).json({ message: 'Boarding place not found' });
    }
    res.status(200).json(updatedPlace);
  } catch (error) {
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
    const { ownerId } = req.params;

    const places = await BoardingPlace.find({ ownerId });

    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching boarding places by owner:", error);
    res.status(500).json({ message: "Failed to fetch boarding places", error });
  }
};




