import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const navigate = useNavigate();

  const userCards = [
    {
      title: "Add User",
      path: "/register-employee-user",
      description: "Register a new user with credentials",
      icon: "➕",
    },
    {
      title: "Remove User",
      path: "/remove-user",
      description: "Delete an existing user from the system",
      icon: "🗑️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3dcdc] to-[#4f6464] p-8">
      <div className="flex justify-start mb-0 text-center">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
        >
          ← Back to Admin Dashboard
        </button>
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          User Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userCards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.1 + index * 0.05,
                type: "spring",
                stiffness: 500,
                damping: 20,
              }}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-100 hover:shadow-2xl flex flex-col h-[250px]"
            >
              <div className="p-6 flex-grow">
                <div className="text-4xl mb-3">{card.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
              <div className="bg-[#aec3c1] px-6 py-3 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    Access Module
                  </span>
                  <svg
                    className="w-5 h-5 text-white transform transition-transform duration-100 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
