// Request.jsx
import React, { useState } from "react";

const Request = () => {
  const [request, setRequest] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // send request to backend
    setRequest("");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Request Study Material</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Request specific material..."
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default Request;
