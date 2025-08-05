import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LogBatch() {
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [storageUnits, setStorageUnits] = useState([]);
  const [productStorageUnits, setProductStorageUnits] = useState([]);

  const [formData, setFormData] = useState({
    product_id: "",
    start_time: "",
    end_time: "",
    quantity_used: "",
    quantity_produced: "",
    employee_id: "",
    r_storage_unit_id: "",
    p_storage_unit_id: "",
  });

  const [filteredProductStorageUnits, setFilteredProductStorageUnits] =
    useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchProducts();
    fetchStorageUnits();
    fetchProductStorageUnits();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/employees/production"
      );
      setEmployees(res.data);
    } catch {
      alert("Failed to load employees.");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch {
      alert("Failed to load products.");
    }
  };

  const fetchStorageUnits = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/storage-units");
      setStorageUnits(res.data);
    } catch {
      alert("Failed to load raw material storage units.");
    }
  };

  const fetchProductStorageUnits = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/product-inventory-storage/product-inventory"
      );
      setProductStorageUnits(res.data);
    } catch (error) {
      console.error("Failed to load product storage units:", error);
      alert("Failed to load product storage units.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "quantity_used" || name === "quantity_produced") &&
      value < 0
    ) {
      alert("Quantities cannot be negative.");
      return;
    }

    const updatedForm = { ...formData, [name]: value };

    if (name === "product_id") {
      const matchingUnits = productStorageUnits.filter(
        (unit) => unit.product_id === parseInt(value)
      );
      setFilteredProductStorageUnits(matchingUnits);
      if (matchingUnits.length > 0) {
        updatedForm.p_storage_unit_id = matchingUnits[0].id;
      } else {
        updatedForm.p_storage_unit_id = "";
      }
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.end_time) < new Date(formData.start_time)) {
      alert("End time cannot be earlier than start time.");
      return;
    }

    const selectedStorage = storageUnits.find(
      (unit) => unit.id === parseInt(formData.r_storage_unit_id)
    );

    if (
      selectedStorage &&
      parseFloat(formData.quantity_used) > selectedStorage.quantity_stored
    ) {
      alert("Not enough stock in the selected storage unit.");
      return;
    }

    try {
      const payload = {
        product_id: parseInt(formData.product_id),
        employee_id: parseInt(formData.employee_id),
        quantity_used: parseFloat(formData.quantity_used),
        quantity_produced: parseFloat(formData.quantity_produced),
        start_time: formData.start_time,
        end_time: formData.end_time,
        r_storage_unit_id: parseInt(formData.r_storage_unit_id),
        p_storage_unit_id: parseInt(formData.p_storage_unit_id),
      };

      await axios.post("http://localhost:8080/api/batches", payload);
      alert("Batch logged successfully!");

      setFormData({
        product_id: "",
        start_time: "",
        end_time: "",
        quantity_used: "",
        quantity_produced: "",
        employee_id: "",
        r_storage_unit_id: "",
        p_storage_unit_id: "",
      });

      fetchStorageUnits();
      fetchProductStorageUnits();
    } catch {
      alert("Failed to log batch.");
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
        <div className="flex justify-start mb-4">
          <Link
            to="/production-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Production Dashboard
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Log Production Batch
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee
              </label>
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {e.first_name} {e.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Used
              </label>
              <input
                type="number"
                name="quantity_used"
                value={formData.quantity_used}
                onChange={handleInputChange}
                step="0.01"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Produced
              </label>
              <input
                type="number"
                name="quantity_produced"
                value={formData.quantity_produced}
                onChange={handleInputChange}
                step="0.01"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raw Material Storage Unit
              </label>
              <select
                name="r_storage_unit_id"
                value={formData.r_storage_unit_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Storage Unit</option>
                {storageUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    Unit #{unit.id} — {unit.quantity_stored}/{unit.capacity}
                    {unit.quantity_stored < 10 ? " ⚠️ Low stock" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Storage Unit
              </label>
              {filteredProductStorageUnits.length > 0 ? (
                <div className="p-4 border rounded-lg bg-gray-100 text-sm text-gray-700">
                  {filteredProductStorageUnits.map((unit) => (
                    <div key={unit.id}>
                      Unit #{unit.id} — {unit.quantity_stored}/{unit.capacity}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-gray-100 text-sm text-gray-500">
                  No storage unit found for selected product.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <motion.button
              type="reset"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setFormData({
                  product_id: "",
                  start_time: "",
                  end_time: "",
                  quantity_used: "",
                  quantity_produced: "",
                  employee_id: "",
                  r_storage_unit_id: "",
                  p_storage_unit_id: "",
                })
              }
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464]"
            >
              Log Batch
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
