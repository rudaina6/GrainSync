import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ViewBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bills");
      setBills(res.data);
    } catch (err) {
      console.error("Failed to fetch bills:", err);
      alert("Unable to load bills.");
    }
  };

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
          View Bills
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#aec3c1] text-white">
                <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                  Bill ID
                </th>
                <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                  Due Date
                </th>
                <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                  Type
                </th>
                <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No bills found.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr
                    key={bill.bill_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">{bill.bill_id}</td>
                    <td className="py-4 px-6">
                      {Number(bill.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">{bill.issue_date}</td>
                    <td className="py-4 px-6">{bill.due_date}</td>
                    <td className="py-4 px-6">{bill.bill_type}</td>
                    <td className="py-4 px-6">{bill.payment_method || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewBills;
