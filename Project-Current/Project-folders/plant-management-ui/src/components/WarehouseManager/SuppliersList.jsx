import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      alert("Failed to load suppliers.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/suppliers",
        newSupplier
      );
      setSuppliers((prev) => [...prev, res.data]);
      setNewSupplier({ name: "", phone: "", email: "", address: "", city: "" });
    } catch (err) {
      console.error("Error adding supplier:", err);
      alert("Failed to add supplier.");
    }
  };

  const handleDeleteSupplier = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.supplier_id !== id));
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert("Failed to delete supplier.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cde1df] to-[#657f7f] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8"
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
          Supplier Directory
        </h2>

        <div className="mb-8 bg-gray-50 p-6 rounded-xl">
          <form onSubmit={handleAddSupplier} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Supplier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={newSupplier.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                value={newSupplier.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                required
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                value={newSupplier.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                value={newSupplier.address}
                onChange={handleInputChange}
                placeholder="Address"
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="city"
                value={newSupplier.city}
                onChange={handleInputChange}
                placeholder="City"
                required
                className="border p-2 rounded"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition-colors"
            >
              Add Supplier
            </motion.button>
          </form>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.supplier_id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {supplier.supplier_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {supplier.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {supplier.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {supplier.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{supplier.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </motion.button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default SupplierList;
