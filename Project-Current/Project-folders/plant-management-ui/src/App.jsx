import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth
import Login from "./pages/Login";

// HR
import HRDashboard from "./components/HR/HRDashboard";
import ManageEmployees from './components/HR/ManageEmployees';
import AddEmployee from './components/HR/AddEmployee';
import UpdateEmployee from "./components/HR/UpdateEmployee";
import ManageAttendance from './components/HR/ManageAttendance';
import AttendanceHistory from './components/HR/AttendanceHistory';
import ViewEmployee from './components/HR/ViewEmployee';

// User Registration
import UserDashboard from './components/User/UserDashboard';
import RegisterEmployeeUser from './components/User/RegisterEmployeeUser';
import RemoveUser from './components/User/RemoveUser';

// Admin
import AdminDashboard from './pages/AdminDashboard';

// Production
import ProductionDashboard from './components/Production/ProductionDashboard';
import LogBatch from './components/Production/LogBatch';
import Summary from './components/Production/Summary';

// Finance
import FinanceDashboard from './components/Finance/FinanceDashboard';
import AddBill from './components/Finance/AddBill';
import ViewBills from './components/Finance/ViewBill';
import TrackSalesAndPurchases from './components/Finance/TrackSalesAndPurchases';
import ManageSalaries from './components/Finance/ManageSalaries';

// Warehouse
import WMDashboard from './components/WarehouseManager/WMDashboard';
import RawMaterialManager from './components/WarehouseManager/RawMaterialManager';
import SuppliersList from './components/WarehouseManager/SuppliersList';
import ProductInventory from './components/WarehouseManager/ProductInventory';

// Sales and Distribution
import SDDashboard from './components/SalesandDistribution/SDDashboard';
import AddOrder from './components/SalesandDistribution/AddOrders';
import ViewOrders from './components/SalesandDistribution/ViewOrders';
import CustomerManagement from './components/SalesandDistribution/CustomerPage';
import DeliveryManagement from './components/SalesandDistribution/ManageDeliveries';


function App() {
  return (
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* HR */}
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/hr/employees" element={<ManageEmployees />} />
          <Route path="/update-employee/:employee_id" element={<UpdateEmployee />} />
          <Route path="/hr/create" element={<AddEmployee />} />
          <Route path="/hr/attendance" element={<ManageAttendance />} />
          <Route path="/attendance-history/:employee_id" element={<AttendanceHistory />} />
          <Route path="/hr/view" element={<ViewEmployee />} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Production */}
          <Route path="/production-dashboard" element={<ProductionDashboard />} />
          <Route path="/product/log" element={<LogBatch />} />
          <Route path="/product/summary" element={<Summary />} />

          {/* Finance */}
          <Route path="/finance-dashboard" element={<FinanceDashboard />} />
          <Route path="/finance/add-bill" element={<AddBill />} />
          <Route path="/finance/view-bill" element={<ViewBills />} />
          <Route path="/finance/track-finance" element={<TrackSalesAndPurchases />} />
          <Route path="/finance/salaries" element={<ManageSalaries />} />

          {/* Warehouse */}
          <Route path="/warehouse-dashboard" element={<WMDashboard />} />
          <Route path="/warehouse/raw-material" element={<RawMaterialManager />} />
          <Route path="/suppliers" element={<SuppliersList />} />
          <Route path="/warehouse/storage" element={<ProductInventory />} />

          {/* Sales and Distribution */}
          <Route path="/sales-dashboard" element={<SDDashboard />} />
          <Route path="/sd/orders/add" element={<AddOrder />} />
          <Route path="/sd/orders/view" element={<ViewOrders />} />
          <Route path="/sd/customers" element={<CustomerManagement />} />
          <Route path="/sd/deliveries" element={<DeliveryManagement />} />

          {/* Manage Users */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/register-employee-user" element={<RegisterEmployeeUser />} />
          <Route path="/remove-user" element={<RemoveUser />} />

            {/* Catch-all route */}
        </Routes>
      </Router>
  );
}

export default App;
