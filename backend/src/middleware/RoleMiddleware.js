export const isBoardingOwner = (req, res, next) => {
  if (req.owner) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as boarding owner' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.owner && req.owner.role === 'accommodationAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Temporary admin bypass for testing - REMOVE IN PRODUCTION
export const isAdminTest = (req, res, next) => {
  // For testing purposes, allow any authenticated user to access admin routes
  if (req.owner) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized - please login first' });
  }
};
