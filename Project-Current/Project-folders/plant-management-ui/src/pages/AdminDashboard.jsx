import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const cards = [
    {
      title: "HR Dashboard",
      path: "/hr-dashboard",
      description: "Manage employees, attendance, and HR operations",
      icon: "👥",
    },
    {
      title: "Production Supervisor Dashboard",
      path: "/production-dashboard",
      description: "Monitor production batches and manage operations",
      icon: "🏭",
    },
    {
      title: "Finance Dashboard",
      path: "/finance-dashboard",
      description: "Track finances, bills, and financial operations",
      icon: "💰",
    },
    {
      title: "Warehouse Manager Dashboard",
      path: "/warehouse-dashboard",
      description: "Manage inventory and warehouse operations",
      icon: "📦",
    },
    {
      title: "Sales and Distribution Dashboard",
      path: "/sales-dashboard",
      description: "Handle sales, orders, and distribution",
      icon: "📊",
    },
    {
      title: "Manage Users",
      path: "/user-dashboard",
      description: "Add or Remove users in the database",
      icon: "➕",
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
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">
            Admin Dashboard
          </h1>

          {userRole === "admin" && (
            <div className="absolute right-0 text-white text-2xl font-medium px-4 py-2 rounded-full">
              {username}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.05 + index * 0.02,
                type: "spring",
                stiffness: 600,
                damping: 18,
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
                    Access Dashboard
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
      {userRole === "admin" && (
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
