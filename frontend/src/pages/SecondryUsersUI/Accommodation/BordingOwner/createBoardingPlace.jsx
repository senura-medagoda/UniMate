import React, { useState } from "react";
import { uploadImageToCloudinary } from "../../../../utils/cloudinary";
import axios from "axios";
import toast from "react-hot-toast";

const CreateBoardingPlace = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    amenities: "",
    availableFrom: "",
    contactNumber: "",
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (image) {
        toast.loading("Uploading image...");
        imageUrl = await uploadImageToCloudinary(image);
        toast.dismiss();
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        amenities: formData.amenities.split(",").map((item) => item.trim()),
        images: imageUrl ? [imageUrl] : [],
        ownerId: "64fe1eaa12ab345678901234", // example ownerId
        createdBy: "owner",
      };

      const res = await axios.post("http://localhost:5001/api/boarding-places", payload);
      toast.success("Boarding place created!");
      console.log("Created:", res.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        price: "",
        amenities: "",
        availableFrom: "",
        contactNumber: "",
      });
      setImage(null);
      setPreviewUrl("");

    } catch (err) {
      console.error(err);
      toast.error("Failed to create boarding place");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto space-y-4">
      <input type="text" name="title" placeholder="Title" className="input input-bordered w-full" onChange={handleChange} value={formData.title} required />
      <textarea name="description" placeholder="Description" className="textarea textarea-bordered w-full" onChange={handleChange} value={formData.description} required />
      <input type="text" name="location" placeholder="Location" className="input input-bordered w-full" onChange={handleChange} value={formData.location} required />
      <input type="number" name="price" placeholder="Price" className="input input-bordered w-full" onChange={handleChange} value={formData.price} required />
      <input type="text" name="amenities" placeholder="Amenities (comma separated)" className="input input-bordered w-full" onChange={handleChange} value={formData.amenities} />
      <input type="date" name="availableFrom" className="input input-bordered w-full" onChange={handleChange} value={formData.availableFrom} required />
      <input type="text" name="contactNumber" placeholder="Contact Number" className="input input-bordered w-full" onChange={handleChange} value={formData.contactNumber} required />
      
      <input type="file" onChange={handleImageChange} className="file-input file-input-bordered w-full" accept="image/*" />

      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="w-full h-auto rounded" />
      )}

      <button type="submit" className="btn btn-success w-full">Submit</button>
    </form>
  );
};

export default CreateBoardingPlace;
