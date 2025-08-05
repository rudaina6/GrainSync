import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BatchSummary() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/batches");
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      alert("Failed to load batches.");
    }
  };

  const calculateStats = (batch) => {
    if (!batch) return null;
    const yieldPercent = (
      (batch.quantity_produced / batch.quantity_used) *
      100
    ).toFixed(2);
    const wastage = (batch.quantity_used - batch.quantity_produced).toFixed(2);
    return { yieldPercent, wastage };
  };

  const stats = selectedBatch ? calculateStats(selectedBatch) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Batch Summary
        </h1>
        <div className="flex justify-start mb-4">
          <Link
            to="/production-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Production Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#546464] mb-6">
                Production Batches
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#aec3c1] text-white">
                      <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                        Batch ID
                      </th>
                      <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                        Product
                      </th>
                      <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">
                        Employee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {batches.map((batch) => (
                      <tr
                        key={batch.batch_id}
                        onClick={() => setSelectedBatch(batch)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedBatch?.batch_id === batch.batch_id
                            ? "bg-gray-100"
                            : ""
                        }`}
                      >
                        <td className="py-4 px-6">{batch.batch_id}</td>
                        <td className="py-4 px-6">
                          {batch.product?.name || "N/A"}
                        </td>
                        <td className="py-4 px-6">{batch.start_time}</td>
                        <td className="py-4 px-6">{batch.end_time}</td>
                        <td className="py-4 px-6">
                          {batch.employee
                            ? `${batch.employee.first_name} ${batch.employee.last_name}`
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold text-[#546464] mb-6">
              Production Stats
            </h2>
            {selectedBatch && stats ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Batch ID</p>
                  <p className="text-lg font-semibold text-[#546464]">
                    {selectedBatch.batch_id}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="text-lg font-semibold text-[#546464]">
                    {selectedBatch.product?.name || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Yield</p>
                  <p className="text-lg font-semibold text-[#546464]">
                    {stats.yieldPercent}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Wastage</p>
                  <p className="text-lg font-semibold text-[#546464]">
                    {stats.wastage} units
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a batch to view its statistics
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
