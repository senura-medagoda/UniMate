import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [boardingPlaces, setBoardingPlaces] = useState([]);
  const ownerId = '64fe1eaa12ab345678901234'; // Replace with actual logged-in user ID (hardcoded for now)

  useEffect(() => {
    const fetchBoardingPlaces = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/boarding-places/owner/${ownerId}`);
        setBoardingPlaces(response.data);
      } catch (error) {
        console.error('Failed to fetch boarding places', error);
        toast.error('Failed to load your boarding places.');
      }
    };

    fetchBoardingPlaces();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Boarding Places</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boardingPlaces.map(place => (
          <div key={place._id} className="border rounded-lg shadow-md p-4 bg-white">
            <img
              src={place.images[0]}
              alt={place.title}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="text-xl font-semibold">{place.title}</h3>
            <p className="text-gray-600">{place.description}</p>
            <p className="text-sm text-gray-500 mt-1">{place.location}</p>
            <p className="text-sm text-green-700 font-bold mt-1">Rs. {place.price}</p>
            <p className="text-xs text-gray-500 mt-1">
              Available from: {new Date(place.availableFrom).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">Contact: {place.contactNumber}</p>
            {/* Action buttons coming soon */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;
