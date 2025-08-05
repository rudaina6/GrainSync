import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BASE_SALARIES = {
  "HR Manager": 5500,
  "Warehouse Manager": 5500,
  "Finance Manager": 5500,
  "Production Supervisor": 5500,
  "Sales Manager": 5500,
  "Training and Development Officer": 5800,
  "Attendance Supervisor": 5000,
  "Inventory Supervisor": 5200,
  "Dispatch Officer": 4800,
  "Supervisor": 6000,
  "Machine Operator": 4200,
  "Quality Inspector": 4500,
  "Process Technician": 4700,
  "Accountant": 6200,
  "Billing Officer": 5000,
  "Audit Officer": 6500,
  "Financial Analyst": 7000,
  "Sales Representative": 5300,
  "Customer Relations Officer": 5200,
  "Marketing Assistant": 4800,
  "Driver": 3500,
  "Admin": 5000,
  "Delivery Supervisor": 4600,
  "Vehicle Maintenance Coordinator": 4800,
};

const ManageSalaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [accountants, setAccountants] = useState([]);
  const [selectedAccountant, setSelectedAccountant] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [editValues, setEditValues] = useState({ bonus: 0, fine: 0 });

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, salariesRes, accountantsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/employees"),
        axios.get(
          `http://localhost:8080/api/salaries/date/${selectedMonth}-01`
        ),
        axios.get("http://localhost:8080/api/accountants"),
      ]);

      const processedEmployees = (employeesRes.data || []).map((emp) => {
        const { baseSalary, ...employeeWithoutBaseSalary } = emp;
        return employeeWithoutBaseSalary;
      });

      setEmployees(processedEmployees);
      setSalaries(salariesRes.data || []);
      setAccountants(accountantsRes.data || []);
      if (accountantsRes.data?.length > 0) {
        setSelectedAccountant(accountantsRes.data[0].accountantId);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error(err);
      setEmployees([]);
      setSalaries([]);
      setAccountants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAllSalaries = async () => {
    if (!selectedAccountant) {
      setError("Please select an accountant first");
      return;
    }

    try {
      setIsCreating(true);
      const employeesWithoutSalary = employees.filter(
        (emp) =>
          !salaries.some((s) => s.employee.employee_id === emp.employee_id)
      );

      const createPromises = employeesWithoutSalary.map((employee) =>
        axios.post("http://localhost:8080/api/salaries", null, {
          params: {
            employeeId: employee.employee_id,
            date: `${selectedMonth}-01`,
            baseAmount: BASE_SALARIES[employee.designation]?.toString() || "0",
            bonus: "0",
            fine: "0",
            accountantId: selectedAccountant,
            paymentMethod: "BANK_TRANSFER",
          },
        })
      );

      await Promise.all(createPromises);
      await fetchData();
    } catch (err) {
      setError("Failed to create salary records. Please try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary);
    setEditValues({
      bonus: salary.bonus || 0,
      fine: salary.fine || 0,
    });
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleSave = async (salaryId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/salaries/${salaryId}`,
        null,
        {
          params: {
            bonus: editValues.bonus.toString(),
            fine: editValues.fine.toString(),
          },
        }
      );
      setSalaries(
        salaries.map((s) => (s.salaryId === salaryId ? response.data : s))
      );
      setEditingSalary(null);
      setEditValues({ bonus: 0, fine: 0 });
      await fetchData();
    } catch (err) {
      setError("Failed to update salary. Please try again.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

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
            to="/finance-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Finance Dashboard
          </Link>
        </div>
        <div className="mb-8 bg-gray-50 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Manage Salaries
            </h2>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <select
                value={selectedAccountant}
                onChange={(e) => setSelectedAccountant(e.target.value)}
                className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Accountant</option>
                {accountants.map((accountant) => (
                  <option
                    key={accountant.accountantId}
                    value={accountant.accountantId}
                  >
                    {accountant.employee.first_name}{" "}
                    {accountant.employee.last_name}
                  </option>
                ))}
              </select>
              {!salaries.length && (
                <button
                  onClick={handleCreateAllSalaries}
                  disabled={isCreating || !selectedAccountant}
                  className={`w-full md:w-auto px-6 py-2 rounded-lg text-white font-medium transition-colors duration-200 border-2 ${
                    isCreating || !selectedAccountant
                      ? "bg-gray-400 border-gray-500 cursor-not-allowed"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {isCreating ? "Creating..." : "Create All Salary Records"}
                </button>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fine
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => {
                  const salary = salaries.find(
                    (s) => s.employee.employee_id === employee.employee_id
                  );
                  const baseSalary = BASE_SALARIES[employee.designation];
                  return (
                    <tr
                      key={employee.employee_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.designation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${baseSalary?.toFixed(2) || "0.00"}
                      </td>
                      {salary ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingSalary?.salaryId === salary.salaryId ? (
                              <input
                                type="number"
                                value={editValues.bonus}
                                onChange={(e) =>
                                  handleEditChange("bonus", e.target.value)
                                }
                                className="w-24 border border-gray-300 rounded-lg px-3 py-1"
                              />
                            ) : (
                              <span className="text-sm text-gray-900">
                                ${salary.bonus?.toFixed(2) || "0.00"}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingSalary?.salaryId === salary.salaryId ? (
                              <input
                                type="number"
                                value={editValues.fine}
                                onChange={(e) =>
                                  handleEditChange("fine", e.target.value)
                                }
                                className="w-24 border border-gray-300 rounded-lg px-3 py-1"
                              />
                            ) : (
                              <span className="text-sm text-gray-900">
                                ${salary.fine?.toFixed(2) || "0.00"}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            $
                            {(
                              baseSalary +
                              (salary.bonus || 0) -
                              (salary.fine || 0)
                            ).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingSalary?.salaryId === salary.salaryId ? (
                              <button
                                onClick={() => handleSave(salary.salaryId)}
                                className="text-green-600 hover:underline font-medium"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEdit(salary)}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            colSpan="4"
                            className="px-6 py-4 text-sm text-gray-500 italic"
                          >
                            Not yet created
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageSalaries;
