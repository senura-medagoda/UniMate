import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Admin_Navbar from "../components/Admin_Navbar";
import M_SIdebar from "../components/M_SIdebar";
import M_login from "../components/M_login";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const M_List = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  // Edit popup states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
    subCategory: "Laptops",
    bestseller: false,
    sizes: []
  });
  const [editImages, setEditImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });

  // Category and subcategory mapping
  const categorySubcategories = {
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

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("adminToken", newToken);
    } else {
      localStorage.removeItem("adminToken");
      navigate("/A_login");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/product/M_list",
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError(response.data.message || "Failed to load products");
      }
    } catch (err) {
      setError(err.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axios.post(
        "http://localhost:5001/api/product/M_remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Product removed successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(response.data.message || "❌ Failed to remove product");
      }
    } catch (err) {
      toast.error("⚠️ Error: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock?.toString() || "0",
      category: product.category,
      subCategory: product.subCategory,
      bestseller: product.bestseller || false,
      sizes: product.sizes || []
    });
    setEditImages({
      image1: null,
      image2: null,
      image3: null,
      image4: null
    });
    setShowEditModal(true);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setEditFormData(prev => ({
      ...prev,
      category: newCategory,
      subCategory: categorySubcategories[newCategory][0]
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setEditFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e, imageKey) => {
    setEditImages(prev => ({
      ...prev,
      [imageKey]: e.target.files[0]
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("productId", editingProduct._id);
      formData.append("name", editFormData.name);
      formData.append("description", editFormData.description);
      formData.append("price", editFormData.price);
      formData.append("stock", editFormData.stock);
      formData.append("category", editFormData.category);
      formData.append("subCategory", editFormData.subCategory);
      formData.append("bestseller", editFormData.bestseller);
      formData.append("size", JSON.stringify(editFormData.sizes));

      // Only append images if they are selected
      if (editImages.image1) formData.append("image1", editImages.image1);
      if (editImages.image2) formData.append("image2", editImages.image2);
      if (editImages.image3) formData.append("image3", editImages.image3);
      if (editImages.image4) formData.append("image4", editImages.image4);

      const response = await axios.post(
        "http://localhost:5001/api/product/M_update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        setShowEditModal(false);
        fetchProducts(); // Refresh the products list
      } else {
        toast.error("❌ Failed: " + response.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("⚠️ Something went wrong!");
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "Electronics",
      subCategory: "Laptops",
      bestseller: false,
      sizes: []
    });
    setEditImages({
      image1: null,
      image2: null,
      image3: null,
      image4: null
    });
  };

  if (!token) {
    return <M_login setToken={handleSetToken} />;
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
    {/* Navbar at the very top */}
    <Admin_Navbar />

    <div className="flex">
      {/* Fixed Sidebar */}
      <M_SIdebar />

      {/* Main Content with left margin for fixed sidebar */}
      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-8">
          Product Management
        </h1>

        {/* Toast notifications */}
        <ToastContainer position="top-right" autoClose={2000} />

        {/* Search + Filter */}
        <div className="flex items-center gap-4 mb-8 bg-white shadow-md rounded-xl p-4 border border-gray-100">
          <input
            type="text"
            placeholder=" Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {Object.keys(categorySubcategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700">
                  <th className="px-6 py-4 text-left">Image</th>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-yellow-50/30"
                    } hover:bg-yellow-100/50 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={
                          product.image?.[0] ||
                          "https://via.placeholder.com/80"
                        }
                        alt={product.name}
                        className="h-14 w-14 object-cover rounded-lg border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Sizes: {product.sizes?.join(", ") || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 font-semibold text-orange-600">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-medium">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-yellow-600 hover:text-orange-600 transition-colors"
                      >
                         Edit
                      </button>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                         Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* Edit Product Modal */}
    {showEditModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-6">
              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (Optional - leave empty to keep current images)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['image1', 'image2', 'image3', 'image4'].map((imageKey, index) => (
                    <div key={imageKey} className="relative">
                      <label htmlFor={imageKey} className="cursor-pointer">
                        <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-orange-400 transition-colors">
                          {editImages[imageKey] ? (
                            <img
                              src={URL.createObjectURL(editImages[imageKey])}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span className="text-xs text-gray-500">Image {index + 1}</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id={imageKey}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, imageKey)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {Object.keys(categorySubcategories).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    name="subCategory"
                    value={editFormData.subCategory}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categorySubcategories[editFormData.category]?.map((subCat) => (
                      <option key={subCat} value={subCat}>{subCat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editFormData.stock}
                    onChange={handleEditInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              {/* Product Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {["S", "M", "L", "XL", "XXL", "Regular"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        editFormData.sizes.includes(size)
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bestseller Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={editFormData.bestseller}
                  onChange={handleEditInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Add to bestseller
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default M_List;
