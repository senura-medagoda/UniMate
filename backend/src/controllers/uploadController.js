import dotenv from "dotenv";
dotenv.config();



import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js"; // adjust path if needed



// ✅ Upload single image to Cloudinary only
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Ensure Cloudinary env vars exist
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary is not configured in environment variables",
      });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "unimate_uploads");

    return res.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      message: "Image uploaded to Cloudinary successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};
