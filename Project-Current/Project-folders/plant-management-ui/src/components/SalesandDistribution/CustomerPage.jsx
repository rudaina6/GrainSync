import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const API_URL = "http://localhost:8080/api/customers";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(API_URL);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API_URL}/${editId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ customer_name: "", email: "", phone: "", address: "" });
      setEditMode(false);
      setIsFormVisible(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditMode(true);
    setEditId(customer.customer_id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-6">
          <Link
            to="/sales-dashboard"
            className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Sales Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Customer Management
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#546464]">Customer List</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFormVisible(true);
                setEditMode(false);
                setFormData({
                  customer_name: "",
                  email: "",
                  phone: "",
                  address: "",
                });
              }}
              className="bg-[#aec3c1] text-white px-6 py-3 rounded-lg hover:bg-[#546464] transition"
            >
              Add New Customer
            </motion.button>
          </div>

          {customers.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No customers found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map((customer) => (
                <div
                  key={customer.customer_id}
                  className="bg-gray-100 p-5 rounded-xl shadow hover:shadow-lg transition duration-200"
                >
                  <h3 className="text-xl font-semibold text-[#546464] mb-2">
                    {customer.customer_name}
                  </h3>
                  <p className="text-gray-700 mb-1">
                    <strong>Email:</strong> {customer.email}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Phone:</strong> {customer.phone}
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> {customer.address}
                  </p>
                  <div className="flex mt-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(customer)}
                      className="bg-[#aec3c1] text-white px-4 py-2 rounded-lg hover:bg-[#546464] transition"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(customer.customer_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md"
            >
              <h2 className="text-2xl font-bold text-[#546464] mb-6">
                {editMode ? "Edit Customer" : "Add New Customer"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {["customer_name", "email", "phone", "address"].map(
                  (field, index) => (
                    <div key={index}>
                      <label className="block text-gray-700 mb-2 capitalize">
                        {field.replace("_", " ")}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:outline-none"
                        required
                      />
                    </div>
                  )
                )}
                <div className="flex justify-end space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition"
                  >
                    {editMode ? "Update" : "Add"} Customer
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
