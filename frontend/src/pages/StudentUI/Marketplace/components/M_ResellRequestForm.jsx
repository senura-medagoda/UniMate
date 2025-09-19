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

  const categories = ["Electronics", "Furniture", "Clothing", "Books & Stationery", "Hostel & Essentials", "Sports & Fitness"];
  const subCategories = {
    "Electronics": ["Laptop", "Mobile Phones", "Tablets", "Accessories", "Gadgets"],
    "Furniture": ["Study Tables", "Chairs", "Beds / Mattresses", "Storage Units"],
    "Clothing": ["Topwear", "Bottomwear", "Footwear", "Accessories"],
    "Books & Stationery": ["Textbooks", "Notebooks", "Study Guides", "Stationery"],
    "Hostel & Essentials": ["Kitchen Items", "Bedding", "Toiletries"],
    "Sports & Fitness": ["Sportswear", "Balls, Rackets, Bats"]
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
      toast.error("Please login to submit a resell request");
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
      toast.error("Please fill all required fields");
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
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
        toast.success("Resell request submitted successfully!");
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting resell request:", error);
      toast.error(error.response?.data?.message || "Failed to submit request");
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
