import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets.js'; // Assuming images are in your assets folder

// Feedback Data (You can add more feedback here)
const feedbackData = [
  {
    name: 'Priya Shah',
    role: 'Director of Customer Experience',
    text: 'Eats blends quality with care. Their deliveries are prompt, and the food is always delicious. Our staff loves the healthy choices and easy ordering.',
    image: assets.profile,  // Update with your image path
    rating: 0, // Rating value
  },
  {
    name: 'John Doe',
    role: 'Marketing Head',
    text: 'Fantastic service, and the food is simply amazing! We’ve been using Eats for months, and they never disappoint.',
    image: assets.profile,  // Update with your image path
    rating: 4, // Rating value
  },
  {
    name: 'Sarah Lee',
    role: 'Product Manager',
    text: 'A seamless experience. Quick, reliable, and always tasty. The team enjoys ordering from Eats daily!',
    image: assets.profile,  // Update with your image path
    rating: 0, // Rating value
  },
];

const Feedback = () => {
  const [currentFeedback, setCurrentFeedback] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Automatically change feedback every 10 seconds with fade-out effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true); // Start fade-out effect

      setTimeout(() => {
        setFadeOut(false); // Reset fade-out effect
        setCurrentFeedback((prev) => (prev + 1) % feedbackData.length); // Change feedback after fade-out
      }, 1000); // Wait for 1 second fade-out duration
    }, 5100); // Change feedback every 11 seconds (10 seconds to stay, 1 second to fade-out)

    return () => clearInterval(interval); // Clear interval on unmount
  }, [currentFeedback]);

  // Handle manual dot click to change feedback
  const handleDotClick = (index) => {
    setFadeOut(true); // Trigger fade-out effect
    setTimeout(() => {
      setFadeOut(false); // Reset fade-out effect
      setCurrentFeedback(index); // Switch to the selected feedback
    }, 1000); // Wait for 1 second slide-out duration
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    const newFeedbackData = [...feedbackData];
    newFeedbackData[currentFeedback].rating = rating;
    feedbackData[currentFeedback] = newFeedbackData[currentFeedback];
  };

  return (

    <div className="feedback-container flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg mb-[150px]">

    <div className="feedback-container flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-lg mb-[150px]">

      <div
        className={`feedback-card bg-white p-6 rounded-lg shadow-lg transition-opacity duration-1000 ease-in-out ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex items-center space-x-4">
          <img
            src={feedbackData[currentFeedback].image}
            alt={feedbackData[currentFeedback].name}
            className="w-16 h-16 rounded-full"
          />
          <div className="text-left">
            <h3 className="text-lg font-semibold">{feedbackData[currentFeedback].name}</h3>
            <p className="text-sm text-gray-500">{feedbackData[currentFeedback].role}</p>
          </div>
        </div>
        <p className="mt-4 text-center text-gray-600">{feedbackData[currentFeedback].text}</p>
        
        {/* Rating Section */}
        <div className="flex justify-center mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-xl ${star <= feedbackData[currentFeedback].rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="mt-4 flex space-x-2">
        {feedbackData.map((_, index) => (
          <span
            key={index}
            onClick={() => handleDotClick(index)}
            className={`cursor-pointer text-2xl ${index === currentFeedback ? 'text-blue-500' : 'text-gray-500'}`}
          >
            •
          </span>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Feedback;
