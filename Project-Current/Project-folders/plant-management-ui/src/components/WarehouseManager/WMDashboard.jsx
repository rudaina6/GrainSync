import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const cards = [
    {
      title: "Manage Raw Material Inventory",
      path: "/warehouse/raw-material",
      description: "View, update, and organize stock levels",
      icon: "📦",
    },
    {
      title: "Manage Product Inventory",
      path: "/warehouse/storage",
      description: "Organize and update warehouse zones",
      icon: "🏬",
    },
    {
      title: "Manage Suppliers",
      path: "/suppliers",
      description: "View and manage suppliers in the system",
      icon: "🛒",
    },
  ];
  const handleLogout = () => {
    localStorage.clear();

    navigate("/", { replace: true });

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      {userRole === "admin" && (
        <div className="flex justify-start mb-0 text-center">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
          >
            ← Back to Admin Dashboard
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">
            Warehouse Manager Dashboard
          </h1>

          {userRole === "warehouse_manager" && (
            <div className="absolute right-0 text-white text-2xl font-medium px-4 py-2 rounded-full">
              {username}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.05,
                  type: "spring",
                  stiffness: 800,
                  damping: 15,
                }}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-100 hover:shadow-2xl flex flex-col h-[250px] w-[400px]"
              >
                <div className="p-6 flex-grow">
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 text-base">{card.description}</p>
                </div>
                <div className="bg-[#aec3c1] px-6 py-3 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">
                      Access Module
                    </span>
                    <svg
                      className="w-5 h-5 text-white"
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

      {userRole === "warehouse_manager" && (
        <button
          onClick={handleLogout}
          className="fixed bottom-4 right-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Dashboard;
