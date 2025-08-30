

export const protect = (req, res, next) => {
  // mock user for testing
  req.user = { id: "123456789", role: "boardingOwner" };
  next();
};

export const isBoardingOwner = (req, res, next) => {
  if (req.user.role === "boardingOwner") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};
