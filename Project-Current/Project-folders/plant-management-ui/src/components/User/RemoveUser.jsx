import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RemoveUser = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to load users.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setMessage(`User with ID ${userId} deleted.`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Failed to delete user.");
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}/make-admin`);
      setMessage(`User with ID ${userId} promoted to admin.`);
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      setMessage("Failed to promote user.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3dcdc] to-[#4f6464] p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8"
      >
        <div className="flex justify-start mb-4">
          <Link
            to="/user-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to User Dashboard
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Manage Users
        </h2>

        {message && <p className="text-blue-600 mb-4">{message}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#aec3c1] text-white">
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  User ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Username
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="border-t hover:bg-gray-50">
                    <td className="p-4 align-middle">{user.user_id}</td>
                    <td className="p-4 align-middle">{user.username}</td>
                    <td className="p-4 align-middle capitalize">{user.role}</td>
                    <td className="p-4">
                      <div className="flex justify-start gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                          onClick={() =>
                            handleCancelDelivery(delivery.delivery_id)
                          }
                        >
                          Delete
                        </motion.button>
                        <button
                          onClick={() => handleMakeAdmin(user.user_id)}
                          disabled={user.role === "admin"}
                          className={`px-4 py-1 rounded-lg shadow text-white ${
                            user.role === "admin"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Already Admin"
                            : "Make Admin"}
                        </button>
                      </div>
                    </td>
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

export default RemoveUser;
