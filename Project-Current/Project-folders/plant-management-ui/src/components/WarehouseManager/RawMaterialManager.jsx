import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const RawMaterialManager = () => {
  const [storageUnits, setStorageUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [restockValues, setRestockValues] = useState({});
  const [selectedSuppliers, setSelectedSuppliers] = useState({});

  useEffect(() => {
    fetchStorageUnits();
    fetchSuppliers();
  }, []);

  const fetchStorageUnits = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/storage-units"
      );
      setStorageUnits(response.data);
    } catch (error) {
      console.error("Error fetching storage units:", error);
      alert("Failed to load storage units.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      alert("Failed to load suppliers.");
    }
  };

  const handleRestockChange = (id, value) => {
    const floatVal = parseFloat(value);
    if (floatVal < 0) {
      alert("Restock amount cannot be negative.");
      return;
    }
    setRestockValues({ ...restockValues, [id]: value });
  };

  const handleSupplierChange = (id, supplierId) => {
    setSelectedSuppliers({ ...selectedSuppliers, [id]: supplierId });
  };

  const handleRestock = async (unit) => {
    const additionalQty = parseFloat(restockValues[unit.id]) || 0;
    const newQty = unit.quantity_stored + additionalQty;
    const supplierId = selectedSuppliers[unit.id];

    if (newQty > unit.capacity) {
      alert("Cannot exceed storage capacity.");
      return;
    }

    if (!supplierId) {
      alert("Please select a supplier.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/storage-units/${unit.id}`, {
        ...unit,
        quantity_stored: newQty,
      });

      await axios.post("http://localhost:8080/api/purchases", {
        supplier: { supplier_id: supplierId },
        date_of_purchase: new Date().toISOString().split("T")[0],
        delivery_date: new Date().toISOString().split("T")[0],
        unit_of_measurement: "kg",
        units_bought: additionalQty,
        price_per_unit: 30.0,
      });

      fetchStorageUnits();
      setRestockValues({ ...restockValues, [unit.id]: "" });
      setSelectedSuppliers({ ...selectedSuppliers, [unit.id]: "" });
    } catch (error) {
      console.error("Error during restock or purchase:", error);
      alert("Failed to restock or record purchase.");
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
          Raw Material Inventory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storageUnits.map((unit) => {
            const inputValue = parseFloat(restockValues[unit.id]) || 0;
            const isActive = inputValue > 0;

            return (
              <motion.div
                key={unit.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="border rounded-xl p-6 shadow-sm bg-gray-50"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Unit #{unit.id}
                </h3>
                <p className="text-gray-700">
                  Capacity: <strong>{unit.capacity}</strong>
                </p>
                <p className="text-gray-700 mb-4">
                  Stored: <strong>{unit.quantity_stored}</strong>
                </p>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Supplier
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={selectedSuppliers[unit.id] || ""}
                    onChange={(e) =>
                      handleSupplierChange(unit.id, e.target.value)
                    }
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.supplier_id}
                        value={supplier.supplier_id}
                      >
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Restock amount"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent"
                    value={restockValues[unit.id] || ""}
                    onChange={(e) =>
                      handleRestockChange(unit.id, e.target.value)
                    }
                  />
                  <motion.button
                    onClick={() => handleRestock(unit)}
                    whileHover={{ scale: isActive ? 1.02 : 1 }}
                    whileTap={{ scale: isActive ? 0.98 : 1 }}
                    disabled={!isActive}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#aec3c1] text-white hover:bg-[#546464]"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Restock
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default RawMaterialManager;
