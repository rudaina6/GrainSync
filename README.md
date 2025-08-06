# GrainSync 🌾

This project is a management system for a wheat and flour processing plant. It is a web application that allows the streamlining of operations across inventory, orders, deliveries, sales, and financial transactions for the plant — all in one place.

## Overview of Features and Dashboards

- Employee Management
- Warehouse, Raw Material and Inventory Management
- Production Statistics and Operations
- Financial Management
- Sales, Orders and Customer Management
- Logistics: Storage and Distribution
- User Authentication

## Technologies Used
- Backend ```Java · Spring Boot · REST API```
- Frontend ```React.js · Tailwind CSS · Framer Motion```
- Database ```MySQL```
- Build ```Maven```

## Run this project
### Prerequisites
1. Java 17+
2. Maven 3.8+
3. Node.js 16+ and npm/yarn
4. MySQL database

# Set Up the Database (MySQL)
1. Install MySQL Server (if not already installed).
2. Open MySQL Workbench.
3. Create the GrainSync database by running the provided SQL script (DB_query.sql)

Note your DB credentials
```· Host```
```· Port ```
```· Username```
```· Password```

# Configure and Run Backend (Spring Boot)
Open the file:
_src/main/resources/application.properties_

Update your database configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/grainsync
spring.datasource.username=your_username
spring.datasource.password=your_password
```

In your terminal:

```bash
mvn clean install
mvn spring-boot:run
```

Backend will run on:
_http://localhost:8080_

# Run Frontend (React + Vite)

Navigate to the frontend folder:
```bash
cd frontend
```

Install frontend dependencies:
```bash
npm install
```

Start the frontend dev server:
```bash
npm run dev
```

Vite will run your frontend on:
_http://localhost:5173_
