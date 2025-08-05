import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const ViewSalesAndPurchases = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchPurchases();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      alert("Unable to load sales.");
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/purchases");
      setPurchases(res.data);
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
      alert("Unable to load purchases.");
    }
  };

  const tabClasses = (tab) =>
    `px-6 py-2 text-base font-semibold rounded-t-lg ${
      activeTab === tab
        ? "bg-[#aec3c1] text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-start mb-0">
          <Link
            to="/finance-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Finance Dashboard
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Sales & Purchases
        </h2>

        <div className="flex space-x-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab("sales")}
            className={tabClasses("sales")}
          >
            Sales
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={tabClasses("purchases")}
          >
            Purchases
          </button>
        </div>

        <div className="overflow-x-auto">
          <AnimatePresence mode="wait">
            {activeTab === "sales" && (
              <motion.table
                key="sales"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full table-auto border-collapse"
              >
                <thead>
                  <tr className="bg-[#aec3c1] text-white">
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Sale ID
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        No sales found.
                      </td>
                    </tr>
                  ) : (
                    sales.map((sale) => (
                      <tr
                        key={sale.sale_id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3">{sale.sale_id}</td>
                        <td className="p-3">{sale.order_id}</td>
                        <td className="p-3">{sale.transaction_id}</td>
                        <td className="p-3">{sale.units_sold}</td>
                        <td className="p-3">{sale.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </motion.table>
            )}
            {activeTab === "purchases" && (
              <motion.table
                key="purchases"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full table-auto border-collapse"
              >
                <thead>
                  <tr className="bg-[#aec3c1] text-white">
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Purchase ID
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Date of Purchase
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Delivery Date
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Price/Unit
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center p-4 text-gray-500">
                        No purchases found.
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr
                        key={purchase.purchase_id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3">{purchase.purchase_id}</td>
                        <td className="p-3">{purchase.supplier_name}</td>
                        <td className="p-3">{purchase.date_of_purchase}</td>
                        <td className="p-3">{purchase.delivery_date}</td>
                        <td className="p-3">{purchase.unit_of_measurement}</td>
                        <td className="p-3">{purchase.units_bought}</td>
                        <td className="p-3">{purchase.price_per_unit}</td>
                        <td className="p-3">
                          {purchase.total_cost.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </motion.table>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewSalesAndPurchases;
