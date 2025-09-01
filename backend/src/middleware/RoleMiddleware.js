export const isBoardingOwner = (req, res, next) => {
  if (req.user && req.user.role === 'boardingOwner') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as boarding owner' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'accommodationAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
