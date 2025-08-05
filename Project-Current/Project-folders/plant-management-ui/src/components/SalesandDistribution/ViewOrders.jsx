import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    axios
      .get(`${API_URL}/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch orders.");
      });
  }, []);

  const getStatusClasses = (status) => {
    const normalized = status?.toLowerCase();
    const statusClasses = {
      pending: "bg-yellow-200 text-yellow-800",
      delivered: "bg-green-200 text-green-800",
      cancelled: "bg-red-200 text-red-800",
    };
    return statusClasses[normalized] || "bg-gray-200 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-start mb-4">
          <Link
            to="/sales-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Sales Dashboard
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          View All Orders
        </h2>

        {error && <p className="text-center text-red-600">{error}</p>}

        {orders.length === 0 && !error ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Order #{order.order_id}
                  </h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-1">
                  Customer ID: {order.customer_id}
                </p>
                <p className="text-gray-700">
                  Address: {order.address || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
