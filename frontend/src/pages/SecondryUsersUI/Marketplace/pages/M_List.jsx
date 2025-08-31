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

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("adminToken", newToken);
    } else {
      localStorage.removeItem("adminToken");
      navigate("/A_login");
    }
  };

  // Fetch products
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

  // Remove product (toast only, no alert, no reload)
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

  // Edit product
  const handleEdit = (id) => {
    navigate(`/A_edit/${id}`);
  };

  if (!token) {
    return <M_login setToken={handleSetToken} />;
  }

  // Apply search + filter
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <M_SIdebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Admin_Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Product Management
          </h1>

          {/* Toast notifications */}
          <ToastContainer position="top-right" autoClose={2000} />

          {/* Search + Filter */}
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="All">All</option>
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
              <option value="Vitamin">Vitamin</option>
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
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-t">
                      <td className="px-4 py-3">
                        <img
                          src={
                            product.image?.[0] ||
                            "https://via.placeholder.com/80"
                          }
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Sizes: {product.sizes?.join(", ") || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">${product.price}</td>
                      <td className="px-4 py-3 text-green-600">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Remove
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
    </div>
  );
};

export default M_List;
