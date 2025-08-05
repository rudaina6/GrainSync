import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AddBill = () => {
  const [accountants, setAccountants] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    issue_date: "",
    due_date: "",
    bill_type: "",
    payment_method: "",
    accountant_id: "",
    employee_id: "",
    employee_name: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/accountants"
        );
        setAccountants(response.data);
      } catch (error) {
        console.error("Error fetching accountants:", error);
      }
    };
    fetchAccountants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount" && parseFloat(value) < 0) return;

    if (name === "accountant_id") {
      const selectedAccountant = accountants.find(
        (acc) => acc.accountant_id === parseInt(value)
      );

      const fullName = selectedAccountant
        ? `${selectedAccountant.employee.first_name} ${selectedAccountant.employee.last_name}`
        : "";

      setFormData({
        ...formData,
        accountant_id: value,
        employee_id: selectedAccountant ? selectedAccountant.employee_id : "",
        employee_name: fullName,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.issue_date) > new Date(formData.due_date)) {
      alert("Issue date cannot be after due date.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        amount: parseFloat(formData.amount),
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        bill_type: formData.bill_type,
        payment_method: formData.payment_method,
        type: "withdrawal",
        accountant_id: parseInt(formData.accountant_id),
      };

      const response = await axios.post(
        "http://localhost:8080/api/bills/create",
        payload
      );
      alert(response.data || "Bill added successfully!");

      setFormData({
        amount: "",
        issue_date: "",
        due_date: "",
        bill_type: "",
        payment_method: "",
        accountant_id: "",
        employee_id: "",
        employee_name: "",
      });
    } catch (error) {
      console.error("Error adding bill:", error);
      alert("Failed to add bill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-start mb-0">
          <Link
            to="/finance-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Finance Dashboard
          </Link>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Add Bill
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Type
            </label>
            <select
              name="bill_type"
              value={formData.bill_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Bill Type</option>
              <option value="Utility">Utility</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Payment Method</option>
              <option value="Online">Online</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Accountant
            </label>
            <select
              name="accountant_id"
              value={formData.accountant_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Accountant</option>
              {accountants.map((acc) => (
                <option key={acc.accountant_id} value={acc.accountant_id}>
                  {acc.employee.first_name} {acc.employee.last_name} -{" "}
                  {acc.domain}
                </option>
              ))}
            </select>
          </div>

          {formData.employee_id && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employee_id}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={formData.employee_name}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition-colors"
            >
              Add Bill
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBill;
