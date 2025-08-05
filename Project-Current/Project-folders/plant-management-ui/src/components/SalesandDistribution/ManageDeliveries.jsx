import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ManageDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchDeliveries();
    fetchDrivers();
    fetchVehicles();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const [allResponse, pendingResponse, completedResponse] =
        await Promise.all([
          axios.get("http://localhost:8080/api/deliveries"),
          axios.get("http://localhost:8080/api/deliveries/pending"),
          axios.get("http://localhost:8080/api/deliveries/completed"),
        ]);
      setDeliveries(allResponse.data);
      setPendingDeliveries(pendingResponse.data);
      setCompletedDeliveries(completedResponse.data);
    } catch (error) {
      console.error("Failed to fetch deliveries:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/drivers");
      setDrivers(response.data);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  const handleAssignDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalVisible(true);
  };

  const handleCompleteDelivery = async (deliveryId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/deliveries/${deliveryId}/complete`
      );
      alert("Delivery marked as completed");
      fetchDeliveries();
    } catch (error) {
      console.error("Failed to complete delivery:", error);
    }
  };

  const handleCancelDelivery = async (deliveryId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/deliveries/${deliveryId}/cancel`
      );
      alert("Delivery cancelled");
      fetchDeliveries();
    } catch (error) {
      console.error("Failed to cancel delivery:", error);
    }
  };

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setIsDetailsModalVisible(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const updatedDelivery = {
        ...selectedDelivery,
        driver: { driverId: parseInt(formData.get("driver_id")) },
        vehicle: { vehicle_id: parseInt(formData.get("vehicle_id")) },
        departureTime: formData.get("departure_time"),
      };

      await axios.put(
        `http://localhost:8080/api/deliveries/${selectedDelivery.delivery_id}`,
        updatedDelivery
      );
      alert("Delivery updated successfully");
      setIsModalVisible(false);
      fetchDeliveries();
    } catch (error) {
      console.error("Failed to update delivery:", error);
    }
  };

  const renderDeliveryTable = (deliveryList) => (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto"
      >
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#aec3c1] text-white">
              <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                Order ID
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                Driver
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                Vehicle
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                Departure Time
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                Delivery Time
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliveryList.map((delivery) => (
              <tr key={delivery.delivery_id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{delivery.order?.order_id}</td>
                <td className="py-4 px-6">
                  {delivery.driver
                    ? `${delivery.driver.employee.first_name} ${delivery.driver.employee.last_name}`
                    : "Not assigned"}
                </td>
                <td className="py-4 px-6">
                  {delivery.vehicle
                    ? `${delivery.vehicle.model} (${delivery.vehicle.license_plate})`
                    : "Not assigned"}
                </td>
                <td className="py-4 px-6">
                  {delivery.departureTime
                    ? moment(delivery.departureTime).format("YYYY-MM-DD HH:mm")
                    : "Not set"}
                </td>
                <td className="py-4 px-6">
                  {delivery.deliveryTime
                    ? moment(delivery.deliveryTime).format("YYYY-MM-DD HH:mm")
                    : "Not delivered"}
                </td>
                <td className="py-4 px-6">
                  {!delivery.deliveryTime ? (
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                        onClick={() => handleAssignDelivery(delivery)}
                      >
                        Assign
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        onClick={() =>
                          handleCompleteDelivery(delivery.delivery_id)
                        }
                      >
                        Complete
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                        onClick={() =>
                          handleCancelDelivery(delivery.delivery_id)
                        }
                      >
                        Cancel
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      onClick={() => handleViewDetails(delivery)}
                    >
                      View Details
                    </motion.button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-0">
          <Link
            to="/sales-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Sales Dashboard
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Manage Deliveries
        </h1>

        <div className="flex justify-center space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "all"
                ? "bg-white text-[#546464]"
                : "bg-[#546464] text-white hover:bg-[#3d4a4a]"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Deliveries
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "pending"
                ? "bg-white text-[#546464]"
                : "bg-[#546464] text-white hover:bg-[#3d4a4a]"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Deliveries
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "completed"
                ? "bg-white text-[#546464]"
                : "bg-[#546464] text-white hover:bg-[#3d4a4a]"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Deliveries
          </motion.button>
        </div>

        {activeTab === "all" && renderDeliveryTable(deliveries)}
        {activeTab === "pending" && renderDeliveryTable(pendingDeliveries)}
        {activeTab === "completed" && renderDeliveryTable(completedDeliveries)}

        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-xl w-[500px]"
            >
              <h2 className="text-2xl font-bold text-[#546464] mb-6">
                Assign Delivery
              </h2>
              <form onSubmit={handleModalSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Driver:</label>
                  <select
                    name="driver_id"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent"
                    required
                  >
                    <option value="">Select a driver...</option>
                    {drivers.map((driver) => (
                      <option key={driver.driverId} value={driver.driverId}>
                        {`${driver.employee.first_name} ${driver.employee.last_name}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Vehicle:</label>
                  <select
                    name="vehicle_id"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent"
                    required
                  >
                    <option value="">Select a vehicle...</option>
                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.vehicle_id}
                        value={vehicle.vehicle_id}
                      >
                        {`${vehicle.model} (${vehicle.license_plate})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Departure Time:
                  </label>
                  <input
                    type="datetime-local"
                    name="departure_time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    onClick={() => setIsModalVisible(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition-colors"
                  >
                    Save
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isDetailsModalVisible && selectedDelivery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-xl w-[500px]"
            >
              <h2 className="text-2xl font-bold text-[#546464] mb-6">
                Delivery Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Order ID
                  </label>
                  <p className="text-gray-600">
                    {selectedDelivery.order?.order_id}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Driver
                  </label>
                  <p className="text-gray-600">
                    {selectedDelivery.driver
                      ? `${selectedDelivery.driver.employee.first_name} ${selectedDelivery.driver.employee.last_name}`
                      : "Not assigned"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Vehicle
                  </label>
                  <p className="text-gray-600">
                    {selectedDelivery.vehicle
                      ? `${selectedDelivery.vehicle.model} (${selectedDelivery.vehicle.license_plate})`
                      : "Not assigned"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Departure Time
                  </label>
                  <p className="text-gray-600">
                    {selectedDelivery.departureTime
                      ? moment(selectedDelivery.departureTime).format(
                          "YYYY-MM-DD HH:mm"
                        )
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Delivery Time
                  </label>
                  <p className="text-gray-600">
                    {selectedDelivery.deliveryTime
                      ? moment(selectedDelivery.deliveryTime).format(
                          "YYYY-MM-DD HH:mm"
                        )
                      : "Not delivered"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDetailsModalVisible(false)}
                  className="px-6 py-3 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDeliveries;
