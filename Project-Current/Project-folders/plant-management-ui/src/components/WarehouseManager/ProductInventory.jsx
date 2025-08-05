import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const ProductInventoryTable = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/product-inventory-storage/product-inventory"
      );
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      alert("Failed to load inventory data.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-start mb-0">
          <Link
            to="/warehouse-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Warehouse Dashboard
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Product Inventory Storage
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inventory.map((item) => (
            <motion.div
              key={item.p_storage_unit_id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="border rounded-xl p-6 shadow-sm bg-gray-50"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Storage Unit #{item.p_storage_unit_id}
              </h3>
              <p className="text-gray-700">
                Capacity: <strong>{item.capacity}</strong>
              </p>

              <p className="text-gray-700 mb-4">
                Stored: <strong>{item.quantity_stored}</strong>
              </p>

              <div className="grid grid-cols-1 gap-4">
                <p className="text-gray-700">
                  Product ID: <strong>{item.product_id}</strong>
                </p>
                <p className="text-gray-700">
                  Product Name: <strong>{item.name}</strong>
                </p>
                <p className="text-gray-700">
                  Unit of Measurement:{" "}
                  <strong>{item.unit_of_measurement}</strong>
                </p>
                <p className="text-gray-700">
                  Price per Unit: <strong>{item.price_per_unit}</strong>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductInventoryTable;
