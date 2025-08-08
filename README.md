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

### Set Up the Database (MySQL)
1. Install MySQL Server (if not already installed).
2. Open MySQL Workbench.
3. Create the GrainSync database by running the provided SQL script (DB_query.sql)

Note your DB credentials
```· Host```
```· Port ```
```· Username```
```· Password```

### Configure and Run Backend (Spring Boot)
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

### Run Frontend (React + Vite)

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

## UI Sneakpeak

#### - Login Page

<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/2b28cecb-76ae-4e41-8c9b-ee507cddeeb2" />

#### - Admin Dashboards

<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/6819c4eb-6389-4557-8b06-87070e065fd2" />

#### - Functionalities

<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/c026c25a-e212-4e10-8e6d-51a138ff14ab" />

<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/8f4e16e7-d5e5-419e-9a88-ab3eae21a7eb" />

<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/39ae140d-4a46-4018-aec9-a1634ae87dfc" />

<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/5f82c3aa-b3f6-42af-9d30-ec6c7378e6ed" />

<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/eda61947-9b6a-472c-84c5-f7f6273dff4d" />

<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/9b6073d7-d774-4f48-902b-be7951958d01" />

#### Run the app to check the full list of functionalites
