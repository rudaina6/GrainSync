import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const departmentDesignations = {
  HR: [
    "HR Officer",
    "Training and Development Officer",
    "Attendance Supervisor",
  ],
  Warehouse: ["Inventory Supervisor", "Dispatch Officer"],
  Production: [
    "Supervisor",
    "Machine Operator",
    "Quality Inspector",
    "Process Technician",
  ],
  Finance: [
    "Accountant",
    "Billing Officer",
    "Audit Officer",
    "Financial Analyst",
  ],
  Sales: [
    "Sales Representative",
    "Customer Relations Officer",
    "Marketing Assistant",
  ],
  Logistics: [
    "Driver",
    "Delivery Supervisor",
    "Vehicle Maintenance Coordinator",
  ],
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    cnic: "",
    email: "",
    designation: "",
    address: "",
    gender: "male",
    department: { dept_id: "" },
    licenseNo: "",
    domain: "",
    officeNo: "",
  });

  const [departments, setDepartments] = useState([]);
  const [availableDesignations, setAvailableDesignations] = useState([]);
  const [showSpecialFields, setShowSpecialFields] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/departments")
      .then((response) => {
        console.log("Departments from API:", response.data);
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("HandleChange called with:", { name, value });

    if (name === "dept_id") {
      console.log("Current departments state:", departments);

      setFormData({
        ...formData,
        department: { dept_id: parseInt(value) },
        designation: "",
      });

      const selectedDept = departments.find(
        (d) => d.dept_id === parseInt(value)
      );
      console.log("Selected Department:", selectedDept);

      if (selectedDept) {
        const deptName = selectedDept.name;
        console.log("Department Name:", deptName);
        console.log("Department Designations Object:", departmentDesignations);
        console.log("Matching Designations:", departmentDesignations[deptName]);

        const designations = departmentDesignations[deptName];
        if (designations) {
          console.log("Setting designations:", designations);
          setAvailableDesignations(designations);
        } else {
          console.warn(`No designations found for department: ${deptName}`);
          setAvailableDesignations([]);
        }
      } else {
        console.warn("No department found with id:", value);
        setAvailableDesignations([]);
      }
    } else if (name === "designation") {
      setFormData({ ...formData, [name]: value });

      setShowSpecialFields(
        value === "Driver" || value === "Accountant" || value === "Supervisor"
      );
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        cnic: formData.cnic,
        email: formData.email,
        designation: formData.designation,
        address: formData.address,
        gender: formData.gender.toLowerCase(),
        department: {
          dept_id: parseInt(formData.department.dept_id),
        },
        absences: 0,
        leaves: 21,
      };

      const employeeResponse = await axios.post(
        "http://localhost:8080/api/employees",
        employeeData
      );

      if (formData.designation === "Driver") {
        await axios.post("http://localhost:8080/api/drivers", {
          employee: { employee_id: employeeResponse.data.employee_id },
          licenseNo: formData.licenseNo,
        });
      } else if (formData.designation === "Accountant") {
        await axios.post("http://localhost:8080/api/accountants", {
          employee: { employee_id: employeeResponse.data.employee_id },
          domain: formData.domain,
        });
      } else if (formData.designation === "Supervisor") {
        await axios.post("http://localhost:8080/api/supervisors", {
          employee: { employee_id: employeeResponse.data.employee_id },
          officeNo: formData.officeNo,
        });
      }

      alert("Employee added successfully!");
      navigate("/hr/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
      if (error.response?.data) {
        alert(`Error adding employee: ${error.response.data}`);
      } else {
        alert("Error adding employee. Please check your input.");
      }
    }
  };

  const renderSpecialFields = () => {
    if (!showSpecialFields) return null;

    switch (formData.designation) {
      case "Driver":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        );
      case "Accountant":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        );
      case "Supervisor":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Number
              </label>
              <input
                type="text"
                name="officeNo"
                value={formData.officeNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
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
            to="/hr-dashboard"
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to HR Dashboard
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Add New Employee
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="Enter CNIC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                name="dept_id"
                value={formData.department.dept_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.dept_id} value={dept.dept_id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              >
                <option value="">Select Designation</option>
                {availableDesignations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aec3c1] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          {renderSpecialFields()}

          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/hr-dashboard")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2 bg-[#aec3c1] text-white rounded-lg hover:bg-[#546464] transition-colors"
            >
              Add Employee
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
