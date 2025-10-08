import React, { useState } from "react";

const M_ResellItem = ({ item }) => {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Like New":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-yellow-100 text-yellow-800";
      case "Fair":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Card */}
      <div className="m-4 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        {/* Image Section (click to open modal) */}
        <div
          className="relative h-64 overflow-hidden group cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.itemName}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 
                  002 2h12a2 2 0 002-2V5a2 2 
                  0 00-2-2H4zm12 12H4l4-8 3 6 
                  2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Gradient + Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getConditionColor(
                item.condition
              )}`}
            >
              {item.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {item.itemName}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-extrabold text-orange-600">
              Rs {item.price}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(item.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-xl overflow-hidden relative">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* Image */}
            <div className="h-80 w-full bg-gray-100">
              <img
                src={item.images[0]}
                alt={item.itemName}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {item.itemName}
              </h2>
              <p className="text-gray-600">{item.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-orange-600">
                  Rs {item.price}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                    item.condition
                  )}`}
                >
                  {item.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="text-gray-500">Category: </span>
                  {item.category}
                </div>
                <div>
                  <span className="text-gray-500">Type: </span>
                  {item.subCategory}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Seller: </span>
                  {item.userName}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Contact: </span>
                  <span className="text-blue-600">{item.contactNumber}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 italic">
                Contact the seller directly to arrange purchase.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default M_ResellItem;
