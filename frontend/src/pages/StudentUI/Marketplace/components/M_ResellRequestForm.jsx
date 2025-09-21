import React, { useState, useContext } from "react";
import { ShopContext } from "../context/M_ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const M_ResellRequestForm = ({ onClose, onSuccess }) => {
  const { token } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    condition: "",
    contactNumber: "",
  });
  const [images, setImages] = useState([]);

  const categories = [
    "Electronics", "Furniture", "Clothing & Fashion", "Books & Stationery", 
    "Hostel & Dorm Essentials", "Sports & Fitness", "Transportation", 
    "Entertainment", "Health & Wellness", "Academic Supplies"
  ];
  const subCategories = {
    "Electronics": [
      "Laptops", "Desktop Computers", "Mobile Phones", "Tablets", "Headphones & Audio", 
      "Chargers & Cables", "Computer Accessories", "Gaming Equipment", "Cameras", "Smart Watches"
    ],
    "Furniture": [
      "Study Tables", "Office Chairs", "Beds & Mattresses", "Wardrobes", "Bookshelves", 
      "Storage Units", "Desk Lamps", "Bean Bags", "Folding Chairs", "Bedside Tables"
    ],
    "Clothing & Fashion": [
      "Casual Wear", "Formal Wear", "Sports Wear", "Winter Clothing", "Summer Clothing", 
      "Footwear", "Accessories", "Bags & Backpacks", "Jewelry", "Watches"
    ],
    "Books & Stationery": [
      "Textbooks", "Reference Books", "Novels & Fiction", "Academic Papers", "Notebooks", 
      "Pens & Pencils", "Art Supplies", "Calculators", "Study Guides", "Exam Materials"
    ],
    "Hostel & Dorm Essentials": [
      "Kitchen Items", "Bedding & Linens", "Toiletries", "Cleaning Supplies", "Storage Boxes", 
      "Laundry Items", "Room Decor", "Study Lamps", "Extension Cords", "Mirrors"
    ],
    "Sports & Fitness": [
      "Gym Equipment", "Sports Clothing", "Balls & Equipment", "Fitness Accessories", 
      "Outdoor Gear", "Water Bottles", "Sports Shoes", "Yoga Mats", "Resistance Bands", "Dumbbells"
    ],
    "Transportation": [
      "Bicycles", "Scooters", "Motorcycles", "Car Accessories", "Helmets", 
      "Locks & Security", "Repair Tools", "Bike Lights", "Reflectors", "Bike Bags"
    ],
    "Entertainment": [
      "Board Games", "Video Games", "Musical Instruments", "Speakers", "Gaming Consoles", 
      "Movies & DVDs", "Books & Magazines", "Art & Crafts", "Puzzles", "Party Supplies"
    ],
    "Health & Wellness": [
      "First Aid", "Supplements", "Fitness Trackers", "Massage Tools", "Meditation Items", 
      "Health Monitors", "Personal Care", "Sleep Aids", "Stress Relief", "Wellness Books"
    ],
    "Academic Supplies": [
      "Lab Equipment", "Scientific Calculators", "Graphing Tools", "Protractors", "Compasses", 
      "Lab Coats", "Safety Equipment", "Research Materials", "Presentation Tools", "Academic Software"
    ]
  };
  const conditions = ["New", "Like New", "Good", "Fair"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("🔐 Please login to submit a resell request");
      return;
    }

    if (
      !formData.itemName ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.subCategory ||
      !formData.condition ||
      !formData.contactNumber
    ) {
      toast.error("⚠️ Please fill all required fields");
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error("💰 Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      images.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image);
      });

      const userResponse = await axios.post(
        "http://localhost:5001/api/user/M_getUser",
        {},
        { headers: { token } }
      );

      if (!userResponse.data.success) {
        throw new Error("Failed to get user details");
      }

      const user = userResponse.data.user;
      formDataToSend.append("userId", user._id);
      formDataToSend.append("userName", user.name);
      formDataToSend.append("userEmail", user.email);

      const response = await axios.post(
        "http://localhost:5001/api/resell/submit-request",
        formDataToSend,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("🎉 Resell request submitted successfully! We'll review it soon.");
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(`❌ Submission failed: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting resell request:", error);
      toast.error(`❌ Network error: ${error.response?.data?.message || "Failed to submit request. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Submit Resell Request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left side */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Item Name *
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Price (Rs) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Sub Category *
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                disabled={!formData.category}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select sub category</option>
                {formData.category &&
                  subCategories[formData.category]?.map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Images (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              {images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons - full width bottom */}
          <div className="col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default M_ResellRequestForm;
