import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerAuth } from "../../../../context/ownerAuthContext";

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginOwner } = useOwnerAuth(); // Make sure this matches the context

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await loginOwner(email, password);

    if (success) {
      navigate("/owner/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Owner Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-success w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default OwnerLogin;
