import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function ManageEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: "",
    departmentId: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });

    axios
      .get("http://localhost:8080/api/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleDelete = () => {
    if (!selectedEmployee) {
      alert("Please select an employee to delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(
          `http://localhost:8080/api/employees/${selectedEmployee.employee_id}`
        )
        .then(() => {
          alert("Employee deleted successfully.");
          setEmployees(
            employees.filter(
              (emp) => emp.employee_id !== selectedEmployee.employee_id
            )
          );
          setSelectedEmployee(null);
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
          alert("Failed to delete employee.");
        });
    }
  };

  const handleUpdate = () => {
    if (!selectedEmployee) {
      alert("Please select an employee to update.");
      return;
    }
    navigate(`/update-employee/${selectedEmployee.employee_id}`);
  };

  const filteredEmployees = employees.filter((employee) => {
    const departmentIdFilter = filters.departmentId
      ? Number(filters.departmentId)
      : null;

    return (
      (filters.employeeId === "" ||
        employee.employee_id.toString().includes(filters.employeeId)) &&
      (departmentIdFilter === null ||
        employee.department?.dept_id === departmentIdFilter)
    );
  });

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#aec3c1] to-[#546464] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-start mb-4">
          <Link
            to="/hr-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to HR Dashboard
          </Link>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Manage Employees</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/hr/create")}
            className="px-6 py-2 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition-colors"
          >
            Add New Employee
          </motion.button>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
              placeholder="Filter by ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              name="departmentId"
              value={filters.departmentId}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <motion.tr
                  key={employee.employee_id}
                  onClick={() => handleSelectEmployee(employee)}
                  whileHover={{ scale: 1.01 }}
                  className={`cursor-pointer transition-colors ${
                    selectedEmployee?.employee_id === employee.employee_id
                      ? "bg-[#aec3c1] bg-opacity-10"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.employee_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department?.name}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gray-50 rounded-xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Selected Employee Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-medium">{selectedEmployee.employee_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium">{selectedEmployee.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">
                  {selectedEmployee.department?.name}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdate}
                className="px-6 py-2 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition-colors"
              >
                Update Employee
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Employee
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
