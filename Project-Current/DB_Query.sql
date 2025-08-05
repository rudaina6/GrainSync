DROP DATABASE IF EXISTS flour_mill;

CREATE DATABASE flour_mill;
USE flour_mill;

-- DEPARTMENTS
CREATE TABLE department (
                            dept_id INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(100) NOT NULL
);

-- EMPLOYEES
CREATE TABLE employee (
                          employee_id INT PRIMARY KEY AUTO_INCREMENT,
                          dept_id INT,
                          first_name VARCHAR(50),
                          last_name VARCHAR(50),
                          date_of_birth DATE,
                          cnic VARCHAR(20) UNIQUE,
                          email VARCHAR(100) UNIQUE,
                          designation VARCHAR(50),
                          address VARCHAR(255),
                          gender ENUM('male', 'female'),
                          absences INT DEFAULT 0,
                          leaves INT DEFAULT 21,
                          FOREIGN KEY (dept_id) REFERENCES department(dept_id)
                              ON DELETE SET NULL
                              ON UPDATE CASCADE
);

-- USER MANAGEMENT
CREATE TABLE user (
                      user_id INT PRIMARY KEY AUTO_INCREMENT,
                      employee_id INT,
                      username VARCHAR(50) UNIQUE NOT NULL,
                      password VARCHAR(255) NOT NULL,
                      role ENUM(
    'hr_manager',
    'warehouse_manager',
    'production_supervisor',
    'finance_manager',
    'sales_manager',
    'admin'
	) NOT NULL,
                      FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                          ON DELETE CASCADE
                          ON UPDATE CASCADE
);


-- DRIVERS
CREATE TABLE driver (
                        driver_id INT AUTO_INCREMENT,
                        employee_id INT,
                        license_no VARCHAR(50),
                        PRIMARY KEY (driver_id, employee_id),
                        FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE
);

-- ACCOUNTANTS
CREATE TABLE accountant (
                            accountant_id INT AUTO_INCREMENT PRIMARY KEY,
                            employee_id INT,
                            domain VARCHAR(100),
                            FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
);

-- SUPERVISORS
CREATE TABLE supervisor (
                            supervisor_id INT AUTO_INCREMENT,
                            employee_id INT,
                            office_no VARCHAR(50),
                            PRIMARY KEY (supervisor_id, employee_id),
                            FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
);

-- PRODUCTS
CREATE TABLE products (
                          product_id INT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(100),
                          unit_of_measurement VARCHAR(20),
                          price_per_unit DECIMAL(10,2)
);

-- RAW MATERIAL STORAGE
CREATE TABLE raw_material_inventory_storage (
                                                r_storage_unit_id INT PRIMARY KEY AUTO_INCREMENT,
                                                capacity FLOAT,
                                                quantity_stored FLOAT
);

-- PRODUCT INVENTORY STORAGE
CREATE TABLE product_inventory_storage (
                                           p_storage_unit_id INT PRIMARY KEY AUTO_INCREMENT,
                                           capacity FLOAT,
                                           quantity_stored FLOAT,
                                           product_id INT,
                                           FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- SUPPLIERS
CREATE TABLE suppliers (
                           supplier_id INT PRIMARY KEY AUTO_INCREMENT,
                           name VARCHAR(100),
                           email VARCHAR(100),
                           phone VARCHAR(20),
                           address VARCHAR(255),
                           city VARCHAR(50)
);

-- PURCHASES
CREATE TABLE purchases (
                           purchase_id INT PRIMARY KEY AUTO_INCREMENT,
                           supplier_id INT,
                           date_of_purchase DATE,
                           delivery_date DATE,
                           unit_of_measurement VARCHAR(20),
                           units_bought FLOAT,
                           price_per_unit FLOAT DEFAULT 30,
                           FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
                               ON DELETE SET NULL
                               ON UPDATE CASCADE
);

-- BATCHES
CREATE TABLE batches (
                         batch_id INT PRIMARY KEY AUTO_INCREMENT,
                         product_id INT,
                         start_time DATETIME,
                         end_time DATETIME,
                         quantity_used FLOAT,
                         quantity_produced FLOAT,
                         employee_id INT,
                         r_storage_unit_id INT,
                         p_storage_unit_id INT,
                         FOREIGN KEY (product_id) REFERENCES products(product_id)
                             ON DELETE RESTRICT
                             ON UPDATE CASCADE,
                         FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                             ON DELETE SET NULL
                             ON UPDATE CASCADE,
                         FOREIGN KEY (r_storage_unit_id) REFERENCES raw_material_inventory_storage(r_storage_unit_id)
                             ON DELETE SET NULL
                             ON UPDATE CASCADE,
                         FOREIGN KEY (p_storage_unit_id) REFERENCES product_inventory_storage(p_storage_unit_id)
                             ON DELETE SET NULL
                             ON UPDATE CASCADE
);

-- CUSTOMERS
CREATE TABLE customers (
                           customer_id INT PRIMARY KEY AUTO_INCREMENT,
                           customer_name VARCHAR(100),
                           email VARCHAR(100),
                           phone VARCHAR(20),
                           address VARCHAR(255)
);

-- ORDERS
CREATE TABLE orders (
                        order_id INT PRIMARY KEY,
                        customer_id INT,
                        employee_id INT,
                        order_date DATE,
                        status VARCHAR(50),
                        address VARCHAR(300),
                        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
                            ON DELETE SET NULL
                            ON UPDATE CASCADE,
                        FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                            ON DELETE SET NULL
                            ON UPDATE CASCADE
);

-- ORDER PRODUCTS
CREATE TABLE orders_products (
                                 order_id INT,
                                 product_id INT,
                                 quantity FLOAT,
                                 PRIMARY KEY (order_id, product_id),
                                 FOREIGN KEY (order_id) REFERENCES orders(order_id)
                                     ON DELETE CASCADE
                                     ON UPDATE CASCADE,
                                 FOREIGN KEY (product_id) REFERENCES products(product_id)
                                     ON DELETE CASCADE
                                     ON UPDATE CASCADE
);

-- VEHICLES
CREATE TABLE vehicles (
                          vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
                          type VARCHAR(50),
                          license_plate VARCHAR(20),
                          model VARCHAR(50),
                          capacity FLOAT,
                          status ENUM('active', 'inactive')
);

-- DELIVERIES
CREATE TABLE deliveries (
                            delivery_id INT PRIMARY KEY AUTO_INCREMENT,
                            order_id INT,
                            vehicle_id INT,
                            driver_id INT,
                            departure_time DATETIME,
                            delivery_time DATETIME,
                            FOREIGN KEY (order_id) REFERENCES orders(order_id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE,
                            FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
                                ON DELETE SET NULL
                                ON UPDATE CASCADE,
                            FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
                                ON DELETE SET NULL
                                ON UPDATE CASCADE
);

-- ATTENDANCE
CREATE TABLE attendance (
                            attendance_id INT PRIMARY KEY AUTO_INCREMENT,
                            employee_id INT,
                            date DATE,
                            clock_in TIME,
                            clock_out TIME,
                            status ENUM('present', 'absent', 'late'),
                            FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
);

-- TRANSACTIONS
CREATE TABLE transactions (
                              transaction_id INT PRIMARY KEY AUTO_INCREMENT,
                              amount DECIMAL(10,2),
                              type ENUM('withdrawal', 'deposit'),
                              date_of_transaction DATE,
                              accountant_id INT,
                              payment_method VARCHAR(50),
                              FOREIGN KEY (accountant_id) REFERENCES accountant(accountant_id)
);

-- BILLS
CREATE TABLE bills (
                       bill_id INT AUTO_INCREMENT,
                       transaction_id INT,
                       bill_type VARCHAR(50),
                       issue_date DATE,
                       due_date DATE,
                       PRIMARY KEY (bill_id, transaction_id),
                       FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
                           ON DELETE CASCADE
                           ON UPDATE CASCADE
);

-- SALARIES
CREATE TABLE salaries (
                          salary_id INT AUTO_INCREMENT,
                          transaction_id INT,
                          employee_id INT,
                          bonus DECIMAL(10,2),
                          fine DECIMAL(10,2),
                          PRIMARY KEY (salary_id, transaction_id),
                          FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
                              ON DELETE CASCADE
                              ON UPDATE CASCADE,
                          FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
                              ON DELETE CASCADE
                              ON UPDATE CASCADE
);

-- SALES
CREATE TABLE sales (
                       sale_id INT AUTO_INCREMENT,
                       transaction_id INT,
                       order_id INT,
                       units_sold FLOAT,
                       status VARCHAR(50),
                       PRIMARY KEY (sale_id, transaction_id),
                       FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
                           ON DELETE CASCADE
                           ON UPDATE CASCADE,
                       FOREIGN KEY (order_id) REFERENCES orders(order_id)
                           ON DELETE CASCADE
                           ON UPDATE CASCADE
);



INSERT INTO department (dept_id, name) VALUES
                                           (1, 'HR'),
                                           (2, 'Warehouse'),
                                           (3, 'Production'),
                                           (4, 'Finance'),
                                           (5, 'Sales'),
                                           (6, 'Logistics');

INSERT INTO employee (employee_id, dept_id, first_name, last_name, date_of_birth, cnic, email, designation, address, gender, absences, leaves) VALUES
                                                                                                                                                   (1, 1, 'Alice', 'Johnson', '1990-05-15', '35201-1234567-1', 'hr@flourmill.com', 'HR Manager', '123 Elm Street', 'Female', 2, 19),
                                                                                                                                                   (2, 2, 'Bob', 'Smith', '1985-03-22', '35201-2345678-2', 'warehouse@flourmill.com', 'Warehouse Manager', '456 Maple Avenue', 'Male', 0, 21),
                                                                                                                                                   (3, 3, 'Charlie', 'Brown', '1992-11-30', '35201-3456789-3', 'production@flourmill.com', 'Production Supervisor', '789 Oak Lane', 'Male', 1, 20),
                                                                                                                                                   (4, 4, 'Diana', 'Prince', '1988-07-08', '35201-4567890-4', 'finance@flourmill.com', 'Finance Manager', '321 Birch Road', 'Female', 0, 21),
                                                                                                                                                   (5, 5, 'Edward', 'Norton', '1995-12-25', '35201-5678901-5', 'sales@flourmill.com', 'Sales Representative', '654 Pine Street', 'Male', 0, 21),
                                                                                                                                                   (6, 1, 'Ali', 'Khan', '1985-03-15', '12345-6789012-3', 'ali.khan@company.com', 'Admin', '123 Main Street, Lahore', 'Male', 0, 21),
                                                                                                                                                   (7, 6, 'Zain', 'Malik', '1990-05-20', '98765-4321098-7', 'zain.malik@company.com', 'Driver', '456 Elm Avenue, Karachi', 'Male', 0, 21),
                                                                                                                                                   (8, 4, 'Fatima', 'Ahmed', '1988-07-10', '34567-8901234-5', 'fatima.ahmed@company.com', 'Accountant', '789 Oak Road, Islamabad', 'Female', 0, 21),
                                                                                                                                                   (9, 4, 'Hassan', 'Iqbal', '1992-11-05', '54321-0987654-3', 'hassan.iqbal@company.com', 'Accountant', '101 Pine Lane, Peshawar', 'Male', 0, 21),
                                                                                                                                                   (10, 3, 'Ayesha', 'Noor', '1987-09-25', '11223-4455667-8', 'ayesha.noor@company.com', 'Supervisor', '234 Maple Drive, Faisalabad', 'Female', 0, 21),
                                                                                                                                                   (11, 3, 'Rehan', 'Ali', '1995-01-30', '22133-6677889-1', 'rehan.ali@company.com', 'Supervisor', '567 Birch Boulevard, Multan', 'Male', 2, 19);

INSERT INTO user (user_id, employee_id, username, password, role) VALUES
                                                                      (1, 1, 'alice_j', 'secure123', 'hr_manager'),
                                                                      (2, 2, 'bob_s', 'passw0rd', 'warehouse_manager'),
                                                                      (3, 3, 'charlie_b', 'flourProd', 'production_supervisor'),
                                                                      (4, 4, 'diana_p', 'financeMe', 'finance_manager'),
                                                                      (5, 5, 'edward_n', 'salesHub', 'sales_manager'),
                                                                      (6,6,'ali_k','admin','admin');



INSERT INTO driver (driver_id, employee_id, license_no) VALUES
                                                            (1, 6, 'DR-12345'),
                                                            (2, 7, 'DR-67890');

INSERT INTO accountant (accountant_id, employee_id, domain) VALUES
                                                                (1, 8, 'Finance Management'),
                                                                (2, 9, 'Taxation and Auditing');

INSERT INTO supervisor (supervisor_id, employee_id, office_no) VALUES
                                                                   (1, 10, 'S-101'),
                                                                   (2, 11, 'S-102');

INSERT INTO products (product_id, name, unit_of_measurement, price_per_unit) VALUES
                                                                                 (1, 'Wheat Flour', 'kg', 50.00),
                                                                                 (2, 'Semolina', 'kg', 55.00),
                                                                                 (3, 'Bran', 'kg', 25.00),
                                                                                 (4, 'Whole Wheat Flour', 'kg', 60.00),
                                                                                 (5, 'Refined Flour', 'kg', 65.00),
                                                                                 (6, 'Multigrain Flour', 'kg', 70.00);

INSERT INTO raw_material_inventory_storage (r_storage_unit_id, capacity, quantity_stored) VALUES
                                                                                              (1, 5000.00, 3000.00),
                                                                                              (2, 6000.00, 4500.00),
                                                                                              (3, 4000.00, 2000.00),
                                                                                              (4, 7000.00, 3500.00),
                                                                                              (5, 8000.00, 6000.00),
                                                                                              (6, 9000.00, 0.00);

INSERT INTO product_inventory_storage (p_storage_unit_id, capacity, quantity_stored, product_id) VALUES
                                                                                                     (1, 1000.0, 750.0, 1), -- Product ID 1: Wheat Flour
                                                                                                     (2, 1200.0, 500.0, 2), -- Product ID 2: Semolina
                                                                                                     (3, 800.0, 200.0, 3),  -- Product ID 3: Bran
                                                                                                     (4, 1500.0, 1200.0, 4), -- Product ID 4: Whole Wheat Flour
                                                                                                     (5, 1000.0, 600.0, 5), -- Product ID 5: Refined Flour
                                                                                                     (6, 900.0, 300.0, 6);  -- Product ID 6: Gluten-Free Flour

INSERT INTO suppliers (supplier_id, name, email, phone, address, city) VALUES
                                                                           (1, 'ABC Supplies', 'abc@supplies.com', '123-456-7890', '10 Supply Road', 'Islamabad'),
                                                                           (2, 'XYZ Trading', 'xyz@trading.com', '987-654-3210', '20 Commerce St', 'Lahore'),
                                                                           (3, 'Superior Goods', 'superior@goods.com', '456-789-0123', '30 Market Lane', 'Karachi'),
                                                                           (4, 'Global Parts', 'global@parts.com', '789-012-3456', '40 Import Ave', 'Faisalabad'),
                                                                           (5, 'Raw Material Co', 'raw@material.com', '321-654-9870', '50 Source Blvd', 'Multan');

INSERT INTO purchases (purchase_id, supplier_id, date_of_purchase, delivery_date, unit_of_measurement, units_bought) VALUES
                                                                                                                         (1, 1, '2025-04-20', '2025-04-22', 'kg', 2000.00),
                                                                                                                         (2, 2, '2025-04-21', '2025-04-23', 'kg', 1500.00),
                                                                                                                         (3, 3, '2025-04-22', '2025-04-24', 'kg', 1800.00),
                                                                                                                         (4, 4, '2025-04-23', '2025-04-25', 'kg', 2200.00),
                                                                                                                         (5, 5, '2025-04-24', '2025-04-26', 'kg', 2500.00);

INSERT INTO batches (batch_id, product_id, start_time, end_time, quantity_used, quantity_produced, employee_id,r_storage_unit_id,p_storage_unit_id) VALUES
                                                                                                                                                        (1, 1, '2025-04-28 08:00:00', '2025-04-28 16:00:00', 1000.00, 800.00, 3,1,1),
                                                                                                                                                        (2, 2, '2025-04-28 09:00:00', '2025-04-28 17:00:00', 1200.00, 950.00, 3,1,2),
                                                                                                                                                        (3, 3, '2025-04-29 08:30:00', '2025-04-29 16:30:00', 1100.00, 850.00, 3,1,3),
                                                                                                                                                        (4, 4, '2025-04-29 10:00:00', '2025-04-29 18:00:00', 1300.00, 1000.00, 3,1,4),
                                                                                                                                                        (5, 5, '2025-04-30 08:00:00', '2025-04-30 16:00:00', 1150.00, 870.00, 3, 2, 5),
                                                                                                                                                        (6, 6, '2025-04-30 09:00:00', '2025-04-30 17:00:00', 1250.00, 930.00, 3, 2, 6);

INSERT INTO customers (customer_id, customer_name, email, phone, address) VALUES
                                                                              (1, 'John Doe', 'john.doe@email.com', '03123456789', '123 Baker Street, Lahore'),
                                                                              (2, 'Jane Smith', 'jane.smith@email.com', '03211234567', '456 Main Road, Karachi'),
                                                                              (3, 'David Williams', 'david.williams@email.com', '03334455667', '789 Park Avenue, Islamabad'),
                                                                              (4, 'Emily Johnson', 'emily.johnson@email.com', '03445566778', '321 Maple Lane, Peshawar'),
                                                                              (5, 'Michael Brown', 'michael.brown@email.com', '03556677889', '654 Oak Drive, Multan'),
                                                                              (6, 'Sarah Wilson', 'sarah.wilson@email.com', '03667788990', '987 Birch Boulevard, Faisalabad');

INSERT INTO orders (order_id, customer_id, employee_id, order_date, status, address) VALUES
                                                                                         (1, 1, 5, '2025-04-15', 'delivered', '123 Baker Street, Lahore'),
                                                                                         (2, 2, 5, '2025-04-16', 'pending', '456 Main Road, Karachi'),
                                                                                         (3, 3, 5, '2025-04-17', 'delivered', '789 Park Avenue, Islamabad'),
                                                                                         (4, 4, 5, '2025-04-18', 'cancelled', '321 Maple Lane, Peshawar'),
                                                                                         (5, 5, 5, '2025-04-19', 'pending', '654 Oak Drive, Multan'),
                                                                                         (6, 6, 5, '2025-04-20', 'delivered', '987 Birch Boulevard, Faisalabad');

INSERT INTO orders_products (order_id, product_id, quantity) VALUES
                                                                 (1, 1, 500.0), -- Order 1: 500 kg of Wheat Flour
                                                                 (1, 2, 200.0), -- Order 1: 200 kg of Semolina
                                                                 (2, 4, 1000.0), -- Order 2: 1000 kg of Whole Wheat Flour
                                                                 (2, 5, 300.0), -- Order 2: 300 kg of Refined Flour
                                                                 (3, 3, 150.0), -- Order 3: 150 kg of Bran
                                                                 (4, 6, 400.0), -- Order 4: 400 kg of Gluten-Free Flour
                                                                 (5, 1, 250.0), -- Order 5: 250 kg of Wheat Flour
                                                                 (5, 2, 150.0), -- Order 5: 150 kg of Semolina
                                                                 (6, 5, 700.0), -- Order 6: 700 kg of Refined Flour
                                                                 (6, 4, 500.0); -- Order 6: 500 kg of Whole Wheat Flour

INSERT INTO vehicles (vehicle_id, type, license_plate, model, capacity, status) VALUES
                                                                                    (1, 'Truck', 'ABC-123', 'Hino 500', 5000.00, 'Active'),
                                                                                    (2, 'Van', 'XYZ-456', 'Toyota HiAce', 3000.00, 'Active'),
                                                                                    (3, 'Pickup', 'LMN-789', 'Isuzu D-Max', 2000.00, 'Active'),
                                                                                    (4, 'Truck', 'DEF-101', 'Mercedes Actros', 6000.00, 'Inactive'),
                                                                                    (5, 'Van', 'PQR-202', 'Ford Transit', 2500.00, 'Active');

INSERT INTO deliveries (delivery_id, order_id, vehicle_id, driver_id, departure_time, delivery_time) VALUES
                                                                                                         (1, 1, 1, 1, '2025-04-25 08:00:00', '2025-04-25 12:00:00'),
                                                                                                         (2, 2, 2, 2, '2025-04-26 09:00:00', NULL),
                                                                                                         (3, 3, 3, 1, '2025-04-27 10:00:00', '2025-04-27 14:00:00'),
                                                                                                         (5, 5, 5, 1, '2025-04-29 12:00:00', NULL),
                                                                                                         (6, 6, 1, 1, '2025-05-2 08:00:00', '2025-05-2 16:00:00');

INSERT INTO attendance (attendance_id, employee_id, date, clock_in, clock_out, status) VALUES
                                                                                           (1, 1, '2025-04-01', '08:00:00', '17:00:00', 'present'),  -- Alice (HR Manager)
                                                                                           (2, 2, '2025-04-01', '08:30:00', '17:30:00', 'late'),     -- Bob (Warehouse Manager)
                                                                                           (3, 3, '2025-04-01', '08:00:00', '17:00:00', 'present'),  -- Charlie (Production Supervisor)
                                                                                           (4, 4, '2025-04-01', '08:00:00', '17:00:00', 'present'),  -- Diana (Finance Manager)
                                                                                           (5, 5, '2025-04-01', '08:15:00', '17:15:00', 'late'),     -- Edward (Sales Manager)
                                                                                           (6, 6, '2025-04-01', '08:00:00', '17:00:00', 'present'),  -- Ali (Driver)
                                                                                           (7, 7, '2025-04-01', '08:10:00', '17:10:00', 'present'),  -- Zain (Driver)
                                                                                           (8, 8, '2025-04-01', '08:00:00', '17:00:00', 'present'),  -- Fatima (Accountant)
                                                                                           (9, 9, '2025-04-01', '08:00:00', '17:00:00', 'present'),  -- Hassan (Accountant)
                                                                                           (10, 10, '2025-04-01', '08:00:00', '17:00:00', 'present'), -- Ayesha (Supervisor)
                                                                                           (11, 11, '2025-04-01', '08:00:00', '17:00:00', 'absent'),  -- Rehan (Supervisor)

                                                                                           (12, 1, '2025-04-02', '08:00:00', '17:00:00', 'present'),  -- Alice (HR Manager)
                                                                                           (13, 2, '2025-04-02', '08:45:00', '17:30:00', 'late'),     -- Bob (Warehouse Manager)
                                                                                           (14, 3, '2025-04-02', '08:00:00', '17:00:00', 'present'),  -- Charlie (Production Supervisor)
                                                                                           (15, 4, '2025-04-02', '08:00:00', '17:00:00', 'present'),  -- Diana (Finance Manager)
                                                                                           (16, 5, '2025-04-02', '08:20:00', '17:10:00', 'late'),     -- Edward (Sales Manager)
                                                                                           (17, 6, '2025-04-02', '08:00:00', '17:00:00', 'present'),  -- Ali (Driver)
                                                                                           (18, 7, '2025-04-02', '08:10:00', '17:05:00', 'present'),  -- Zain (Driver)
                                                                                           (19, 8, '2025-04-02', '08:00:00', '17:00:00', 'present'),  -- Fatima (Accountant)
                                                                                           (20, 9, '2025-04-02', '08:00:00', '17:00:00', 'present'),  -- Hassan (Accountant)
                                                                                           (21, 10, '2025-04-02', '08:00:00', '17:00:00', 'present'), -- Ayesha (Supervisor)
                                                                                           (22, 11, '2025-04-02', '08:00:00', '17:00:00', 'absent');  -- Rehan (Supervisor)


INSERT INTO transactions (transaction_id, amount, type, date_of_transaction, accountant_id, payment_method) VALUES
-- Corresponding to Salaries
(101, 80000.00, 'withdrawal', '2025-04-01', 1, 'Bank Transfer'), -- Salary for Alice
(102, 75000.00, 'withdrawal', '2025-04-01', 2, 'Bank Transfer'), -- Salary for Bob
(103, 78000.00, 'withdrawal', '2025-04-01', 1, 'Bank Transfer'), -- Salary for Charlie
(104, 95000.00, 'withdrawal', '2025-04-01', 2, 'Bank Transfer'), -- Salary for Diana
(105, 72000.00, 'withdrawal', '2025-04-01', 1, 'Bank Transfer'), -- Salary for Edward
(106, 50000.00, 'withdrawal', '2025-04-01', 2, 'Cash'),         -- Salary for Ali
(107, 52000.00, 'withdrawal', '2025-04-01', 1, 'Cash'),         -- Salary for Zain
(108, 85000.00, 'withdrawal', '2025-04-01', 2, 'Bank Transfer'), -- Salary for Fatima
(109, 86000.00, 'withdrawal', '2025-04-01', 1, 'Bank Transfer'), -- Salary for Hassan
(110, 78000.00, 'withdrawal', '2025-04-01', 2, 'Bank Transfer'), -- Salary for Ayesha
(111, 80000.00, 'withdrawal', '2025-04-01', 1, 'Bank Transfer'), -- Salary for Rehan

-- Corresponding to Bills
(201, 12000.00, 'withdrawal', '2025-03-15', 1, 'Bank Transfer'), -- Utility Bill
(202, 8000.00, 'withdrawal', '2025-03-20', 2, 'Cash'),           -- Maintenance Bill
(203, 15000.00, 'withdrawal', '2025-03-25', 1, 'Bank Transfer'), -- Raw Material Bill
(204, 10000.00, 'withdrawal', '2025-03-30', 2, 'Bank Transfer'), -- Office Supplies Bill

-- Corresponding to Sales
(301, 250000.00, 'deposit', '2025-03-10', 1, 'Bank Transfer'),   -- Sale Payment
(303, 180000.00, 'deposit', '2025-03-20', 1, 'Cash'),            -- Sale Payment
(306, 300000.00, 'deposit', '2025-03-25', 2, 'Bank Transfer');   -- Sale Payment


INSERT INTO bills (bill_id, transaction_id, bill_type,issue_date, due_date) VALUES
                                                                                (1, 201, 'Utility','2025-03-01', '2025-03-20'),
                                                                                (2, 202, 'Maintenance','2025-03-01', '2025-03-25'),
                                                                                (3, 203, 'Raw Material','2025-03-01', '2025-03-30'),
                                                                                (4, 204, 'Office Supplies','2025-03-01', '2025-04-05');

INSERT INTO salaries (salary_id, transaction_id, employee_id, bonus, fine) VALUES
                                                                               (1, 101, 1, 2000.00, 0.00), -- Alice (HR Manager)
                                                                               (2, 102, 2, 1500.00, 100.00), -- Bob (Warehouse Manager)
                                                                               (3, 103, 3, 1800.00, 50.00), -- Charlie (Production Supervisor)
                                                                               (4, 104, 4, 2500.00, 0.00), -- Diana (Finance Manager)
                                                                               (5, 105, 5, 1700.00, 200.00), -- Edward (Sales Manager)
                                                                               (6, 106, 6, 1000.00, 0.00), -- Ali (Driver)
                                                                               (7, 107, 7, 1100.00, 50.00), -- Zain (Driver)
                                                                               (8, 108, 8, 2200.00, 0.00), -- Fatima (Accountant)
                                                                               (9, 109, 9, 2100.00, 100.00), -- Hassan (Accountant)
                                                                               (10, 110, 10, 1900.00, 0.00), -- Ayesha (Supervisor)
                                                                               (11, 111, 11, 2000.00, 50.00); -- Rehan (Supervisor)

INSERT INTO sales (sale_id, transaction_id, order_id, units_sold, status) VALUES
                                                                              (1, 301, 1, 700.0, 'completed'),
                                                                              (3, 303, 3, 400.0, 'completed'),
                                                                              (6, 306, 6, 500.0, 'completed');

DELIMITER $$
CREATE PROCEDURE create_new_bill (
    IN p_amount DECIMAL(10,2),
    IN p_accountant_id INT,
    IN p_payment_method VARCHAR(50),
    IN p_bill_type VARCHAR(50),
    IN p_issue_date DATE,
    IN p_due_date DATE
)
BEGIN
    DECLARE new_transaction_id INT;
INSERT INTO transactions (
    amount,
    type,
    date_of_transaction,
    accountant_id,
    payment_method
) VALUES (
             p_amount,
             'withdrawal',
             SYSDATE(),
             p_accountant_id,
             p_payment_method
         );
SET new_transaction_id = LAST_INSERT_ID();
INSERT INTO bills (
    transaction_id,
    bill_type,
    issue_date,
    due_date
) VALUES (
             new_transaction_id,
             p_bill_type,
             p_issue_date,
             p_due_date
         );
END$$
DELIMITER ;
DELIMITER //

CREATE PROCEDURE register_user_from_employee(
    IN emp_id INT,
    IN uname VARCHAR(50),
    IN pwd VARCHAR(255)
)
BEGIN
    -- Declare variable
    DECLARE emp_role VARCHAR(50);

    -- Check if the employee already has a user
    IF EXISTS (SELECT 1 FROM `user` WHERE employee_id = emp_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User already exists for this employee';

ELSE
        -- Get role based on department name
SELECT
    CASE d.name
        WHEN 'HR' THEN 'hr_manager'
        WHEN 'Finance' THEN 'finance_manager'
        WHEN 'Sales' THEN 'sales_manager'
        WHEN 'Production' THEN 'production_supervisor'
        WHEN 'Warehouse' THEN 'warehouse_manager'
        WHEN 'Logistics' THEN 'warehouse_manager'
        END
INTO emp_role
FROM employee e
         JOIN department d ON e.dept_id = d.dept_id
WHERE e.employee_id = emp_id;

-- Optional: check if emp_role is still null (employee not found)
IF emp_role IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid employee ID or department not found';
ELSE
            -- Insert into user table
            INSERT INTO `user` (employee_id, username, password, role)
            VALUES (emp_id, uname, pwd, emp_role);
END IF;
END IF;
END //

DELIMITER ;


