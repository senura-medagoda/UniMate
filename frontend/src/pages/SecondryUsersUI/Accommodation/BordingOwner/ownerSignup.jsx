import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OwnerSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/owner/signup", formData);
      toast.success("Signup successful!");
      navigate("/owner/login");
    } catch (err) {
      console.error(err);
      toast.error("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Owner Signup</h2>
      <input name="fullName" type="text" placeholder="Full Name" className="input input-bordered w-full" value={formData.fullName} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" className="input input-bordered w-full" value={formData.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" className="input input-bordered w-full" value={formData.password} onChange={handleChange} required />
      <button className="btn btn-primary w-full">Signup</button>
    </form>
  );
};

export default OwnerSignup;
