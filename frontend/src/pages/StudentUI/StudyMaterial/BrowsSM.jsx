import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const BrowseDocument = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const handleFeedbackSubmit = () => {
    console.log("Feedback:", feedback);
    console.log("Rating:", rating);
    setFeedback("");
    setRating(0);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
     
     <div>
        <h2 className="text-2xl font-bold mb-4">Document Title</h2>
     </div>
     
      {/* Document Preview */}
      <div className="border rounded-lg h-64 flex items-center justify-center bg-gray-100 mb-6">
        <p className="text-gray-500">📄 Document Preview (placeholder)</p>
      </div>

      {/* Download Button */}
      <a
        href="/path-to-document.pdf" // Replace with actual file link
        download
        className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mb-6"
      >
        Download Study Material
      </a>

      {/* Rating System */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Rate this Material:</h3>
        <div className="flex space-x-1">
          {[...Array(5)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setRating(currentRating)}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
                className="focus:outline-none"
              >
                <FaStar
                  size={28}
                  className={
                    currentRating <= (hover || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Give Your Feedback:</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border p-2 rounded-lg"
          placeholder="Write your feedback here..."
          rows="4"
        />
      </div>

      {/* Submit Feedback Button */}
      <button
        onClick={handleFeedbackSubmit}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Add Feedback
      </button>
    </div>
  );
};

export default BrowseDocument;
