import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Admin_Navbar from "../components/Admin_Navbar";
import M_SIdebar from "../components/M_SIdebar";
import { assets } from "../assets/assets";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const M_Add = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please login as admin first!");
      navigate("/A_login");
    }
  }, [navigate]);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [subCategory, setSubCategory] = useState("Laptop");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Category and subcategory mapping
  const categorySubcategories = {
    "Electronics": ["Laptop", "Mobile Phones", "Tablets", "Accessories", "Gadgets"],
    "Furniture": ["Study Tables", "Chairs", "Beds / Mattresses", "Storage Units"],
    "Clothing": ["Topwear", "Bottomwear", "Footwear", "Accessories"],
    "Books & Stationery": ["Textbooks", "Notebooks", "Study Guides", "Stationery"],
    "Hostel & Essentials": ["Kitchen Items", "Bedding", "Toiletries"],
    "Sports & Fitness": ["Sportswear", "Balls, Rackets, Bats"]
  };

  // Handle category change and reset subcategory
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    // Reset subcategory to first option of new category
    setSubCategory(categorySubcategories[newCategory][0]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("size", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const token = localStorage.getItem("adminToken");

      const response = await axios.post(
        "http://localhost:5001/api/product/M_add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
        }
      );

      if (response.data.success) {
        toast.success(" Product added successfully!");
        setTimeout(() => {
          navigate("/M_List"); // redirect after toast shows
        }, 1500);
      } else {
        toast.error("❌ Failed: " + response.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("⚠️ Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Navbar />
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex">
        <div className="w-55 bg-white shadow-sm border-r border-gray-200">
          <M_SIdebar />
        </div>
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Add Product
            </h1>

            <form
              onSubmit={onSubmitHandler}
              className="flex flex-col w-full items-start gap-3"
            >
              <p className="mb-2">Upload Images</p>
              <div className="flex gap-2">
                {[setImage1, setImage2, setImage3, setImage4].map(
                  (setImage, index) => (
                    <label key={index} htmlFor={`image${index + 1}`}>
                      <img
                        className="w-20"
                        src={
                          ![image1, image2, image3, image4][index]
                            ? assets.upload_area
                            : URL.createObjectURL(
                                [image1, image2, image3, image4][index]
                              )
                        }
                        alt=""
                      />
                      <input
                        type="file"
                        id={`image${index + 1}`}
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </label>
                  )
                )}
              </div>

              <div className="w-full">
                <p className="mb-2">Product name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full max-w-[500px] px-3 py-2 border-2 border-orange-200"
                  type="text"
                  placeholder="Type Here"
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Product description</p>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="w-full max-w-[500px] px-3 py-2 border-2 border-orange-200"
                  placeholder="Write Content here"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                  <p className="mb-2">Product category</p>
                  <select
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 max-w-[500px] border-2 border-orange-200"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="Hostel & Essentials">Hostel & Essentials</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2">Sub category</p>
                  <select
                    onChange={(e) => setSubCategory(e.target.value)}
                    value={subCategory}
                    className="w-full px-3 py-2 max-w-[500px] border-2 border-orange-200"
                  >
                    {categorySubcategories[category]?.map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-2">Product Price</p>
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    className="w-full px-3 py-2 max-w-[500px] border-2 border-orange-200"
                    type="Number"
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <p className="mb-2">Stock Quantity</p>
                  <input
                    onChange={(e) => setStock(e.target.value)}
                    value={stock}
                    className="w-full px-3 py-2 max-w-[500px] border-2 border-orange-200"
                    type="Number"
                    placeholder="10"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <p className="mb-2">Product Sizes</p>
                <div className="flex gap-3">
                  {["S", "M", "L", "XL", "XXL", "Regular"].map((s) => (
                    <div
                      key={s}
                      onClick={() =>
                        setSizes((prev) =>
                          prev.includes(s)
                            ? prev.filter((item) => item !== s)
                            : [...prev, s]
                        )
                      }
                    >
                      <p
                        className={`${
                          sizes.includes(s)
                            ? "bg-orange-200"
                            : "bg-slate-200"
                        } px-3 py-1 cursor-pointer`}
                      >
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  onChange={() => setBestseller((prev) => !prev)}
                  checked={bestseller}
                  type="checkbox"
                  id="bestseller"
                />
                <label className="cursor-pointer" htmlFor="bestseller">
                  Add to bestseller
                </label>
              </div>

              <button
                type="submit"
                className="w-28 py-3 mt-4 bg-orange-400 text-white"
              >
                ADD
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M_Add;
