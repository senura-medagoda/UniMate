import multer from "multer";

// Store file in memory (RAM) instead of disk (Vercel filesystem is read-only)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Optional: allow only images
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export default upload;
