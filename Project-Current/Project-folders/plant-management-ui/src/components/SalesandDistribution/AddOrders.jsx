import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Orders() {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [orderProducts, setOrderProducts] = useState([
    { product_id: "", quantity: "" },
  ]);
  const [orderAddress, setOrderAddress] = useState("");
  const [accountants, setAccountants] = useState([]);
  const [selectedAccountant, setSelectedAccountant] = useState("");

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    axios
      .get(`${API_URL}/customers`)
      .then((res) => setCustomers(res.data))
      .catch((error) => console.error("Error fetching customers:", error));

    axios
      .get(`${API_URL}/accountants`)
      .then((res) => setAccountants(res.data))
      .catch((error) => console.error("Error fetching accountants:", error));

    axios
      .get(`${API_URL}/employees/sales`)
      .then((res) => {
        console.log("Sales representatives:", res.data);
        setEmployees(res.data);
      })
      .catch((error) => {
        console.error("Error fetching sales representatives:", error);
        console.error("Error response:", error.response?.data);
      });

    axios
      .get(`${API_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const customer = customers.find(
      (c) => c.customer_id === parseInt(selectedCustomer)
    );
    if (customer) setOrderAddress(customer.address);
    else setOrderAddress("");
  }, [selectedCustomer, customers]);

  const handleProductChange = (index, field, value) => {
    const updated = [...orderProducts];
    updated[index][field] = value;
    setOrderProducts(updated);
  };

  const addProductRow = () => {
    setOrderProducts([...orderProducts, { product_id: "", quantity: "" }]);
  };

  const removeProductRow = (index) => {
    if (orderProducts.length > 1) {
      setOrderProducts(orderProducts.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedCustomer || !selectedEmployee) {
        alert("Please fill in all required fields.");
        return;
      }

      if (
        orderProducts.some(
          (op) => !op.product_id || !op.quantity || parseFloat(op.quantity) <= 0
        )
      ) {
        alert("All products must have a valid quantity greater than 0.");
        return;
      }

      const orderData = {
        customer_id: parseInt(selectedCustomer),
        employee_id: parseInt(selectedEmployee),
        accountant_id: parseInt(selectedAccountant),
        status: "pending",
        order_date: new Date().toISOString().split("T")[0],
        products: orderProducts.map((op) => ({
          product_id: parseInt(op.product_id),
          quantity: parseFloat(op.quantity),
        })),
      };

      const response = await axios.post(`${API_URL}/orders`, orderData);
      alert("Order placed successfully!");

      setSelectedCustomer("");
      setSelectedEmployee("");
      setOrderProducts([{ product_id: "", quantity: "" }]);
      setOrderAddress("");
    } catch (error) {
      console.error("Error placing order:", error);
      const serverMsg =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message;
      alert(`Failed to place order. ${serverMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-start mb-0">
          <Link
            to="/sales-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Sales Dashboard
          </Link>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create New Order</h2>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create a new order
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Customer Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Customer
                </label>
                <select
                  required
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1]"
                >
                  <option value="">Choose a customer...</option>
                  {customers.map((c) => (
                    <option key={c.customer_id} value={c.customer_id}>
                      {c.customer_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={orderAddress}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Sales Representative
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Sales Representative
            </label>
            <select
              required
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1]"
            >
              <option value="">Choose a sales representative...</option>
              {employees.map((e) => (
                <option key={e.employee_id} value={e.employee_id}>
                  {e.first_name} {e.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Accountant
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Accountant
            </label>
            <select
              required
              value={selectedAccountant}
              onChange={(e) => setSelectedAccountant(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1]"
            >
              <option value="">Choose an accountant...</option>
              {accountants.map((a) =>
                a.employee ? (
                  <option key={a.accountantId} value={a.accountantId}>
                    {a.employee.first_name} {a.employee.last_name}
                  </option>
                ) : null
              )}
            </select>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Order Products
            </h3>
            <div className="space-y-4">
              {orderProducts.map((op, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product {index + 1}
                    </label>
                    <select
                      required
                      value={op.product_id}
                      onChange={(e) =>
                        handleProductChange(index, "product_id", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1]"
                    >
                      <option value="">Select a product...</option>
                      {products.map((p) => (
                        <option key={p.product_id} value={p.product_id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={op.quantity}
                      onChange={(e) =>
                        handleProductChange(index, "quantity", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1]"
                      required
                    />
                  </div>
                  <div className="w-1/6 pt-6">
                    <button
                      type="button"
                      onClick={() => removeProductRow(index)}
                      className="w-full text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={orderProducts.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addProductRow}
                className="text-[#546464] hover:text-[#aec3c1] font-medium mt-2 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add another product
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-[#aec3c1] hover:bg-[#546464] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Place Order
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
