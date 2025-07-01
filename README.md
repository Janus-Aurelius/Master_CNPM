# 🏫 University Management System

**A comprehensive university management system built with React TypeScript and Node.js**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-339933)](https://nodejs.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

---

## 📌 Overview

This project is a comprehensive university management system developed for **VNUHCM – University of Information Technology (UIT)** as part of the **SE104** course. The system provides a modern web interface for managing academic affairs, student information, financial operations, and administrative tasks.

The system supports multiple user roles including students, academic staff, financial department, and administrators, each with tailored dashboards and functionalities.

---

## ✨ Features

### 🎓 Academic Management
- **Course Management**: Create, update, and manage courses and subjects
- **Program Management**: Academic program scheduling and curriculum management
- **Open Course Management**: Semester-based course offerings with enrollment limits
- **Student Registration**: Course registration and enrollment management
- **Grade Management**: Student performance tracking and GPA calculation

### 💰 Financial Management
- **Tuition Management**: Semester-based tuition calculation and tracking
- **Payment Processing**: Multiple payment methods and transaction history
- **Financial Reporting**: Revenue tracking and payment analytics
- **Fee Configuration**: Dynamic pricing for different course types
- **Discount Management**: Priority group discounts and scholarships

### 👥 Student Portal
- **Dashboard**: Comprehensive overview with course schedule and payments
- **Course Enrollment**: Browse and register for available courses
- **Tuition Payment**: View outstanding balances and make payments
- **Academic History**: Track completed courses and academic progress
- **Timetable Management**: Personal schedule and class information

### 🔧 Administrative Features
- **User Management**: Role-based access control and user administration
- **System Configuration**: Maintenance mode and security settings
- **Audit Logging**: Track system activities and changes
- **Dashboard Analytics**: Real-time statistics and reporting

---

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router v6** for navigation
- **Axios** for API communication
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **JWT Authentication** for security
- **PostgreSQL** database
- **Business Layer Architecture** for complex logic

### Key Architecture Patterns
- **MVC Pattern**: Controllers, Services, and Business Logic separation
- **Repository Pattern**: Database abstraction layer
- **Service Layer**: Business logic encapsulation
- **Role-based Access Control**: Multi-tier user permissions

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- npm or yarn package manager

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Janus-Aurelius/Master_CNPM.git
   cd Master_CNPM
   ```

2. **Start Backend with Docker**
   ```bash
   cd master_backend_nodejs\master_backend_nodejs\Docker
   docker-compose up --build
   ```
   This will start the backend server and database automatically.

3. **Start Frontend**
   ```bash
   cd frontend\master_frontend_tsx
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

### Manual Installation (Alternative)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Janus-Aurelius/Master_CNPM.git
   cd Master_CNPM
   ```

2. **Backend Setup**
   ```bash
   cd master_backend_nodejs/master_backend_nodejs
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/master_frontend_tsx
   npm install
   ```

4. **Database Setup**
   ```bash
   # Run database migrations (if available)
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

5. **Start the Application**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

---

## 🗂 Project Structure

```
university-management-system/
├── frontend/
│   └── master_frontend_tsx/           # React TypeScript frontend
│       ├── src/
│       │   ├── academic_affair_pages/ # Academic staff interface
│       │   ├── admin_pages/           # Administrator interface
│       │   ├── financial_dpm_pages/   # Financial department interface
│       │   ├── student_pages/         # Student portal
│       │   ├── api_clients/           # API communication layer
│       │   ├── components/            # Reusable UI components
│       │   └── styles/                # Theme and styling
│
└── master_backend_nodejs/
    └── master_backend_nodejs/         # Node.js Express backend
        ├── src/
        │   ├── controllers/           # Request handlers
        │   ├── business/              # Business logic layer
        │   ├── services/              # Data access layer
        │   ├── models/                # TypeScript interfaces
        │   ├── routes/                # API route definitions
        │   ├── middleware/            # Authentication & validation
        │   └── utils/                 # Helper utilities
        └── Docker/                    # Containerization files
```

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### Academic Endpoints
- `GET /api/academic/courses` - Manage courses
- `GET /api/academic/programs` - Academic programs
- `GET /api/academic/students` - Student management
- `GET /api/academic/dashboard/stats` - Academic statistics

### Student Endpoints
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/student/timetable` - Personal schedule
- `POST /api/student/register-courses` - Course registration
- `GET /api/student/tuition-status` - Payment information

### Financial Endpoints
- `GET /api/financial/dashboard/overview` - Financial overview
- `POST /api/financial/payments` - Process payments
- `GET /api/financial/config` - Fee configuration

### Admin Endpoints
- `GET /api/admin/users` - User management
- `GET /api/admin/system/maintenance` - System maintenance
- `GET /api/admin/dashboard/summary` - System statistics

---

## 📸 Screenshots

### 🔐 Login Interface
![Login Page](image/login_page.png)
*Secure authentication portal with role-based access*

### 🎓 Academic Affairs Dashboard
![Academic Page](image/academic_page.png)
*Academic staff interface for course management, student registration, and program administration*

### 👨‍🎓 Student Portal
![Student Page](image/student_page.png)
*Student dashboard with course enrollment, timetable, and tuition payment features*

### 💰 Financial Department Interface
![Financial Page](image/financial_page.png)
*Financial management system for tuition tracking, payment processing, and revenue analytics*

### ⚙️ Administrator Panel
![Admin Page](image/admin_page.png)
*System administration interface for user management and system configuration*

---

## 🎯 Key Features Highlight

- **Multi-role Dashboard**: Customized interfaces for different user types
- **Real-time Data**: Live updates for registrations and payments
- **Semester Management**: Academic calendar and enrollment periods
- **Payment Integration**: Comprehensive tuition and fee management
- **Responsive Design**: Mobile-friendly interface
- **Security**: JWT-based authentication with role permissions
- **Audit Trail**: Complete activity logging and tracking

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

- **Course**: SE104 – Software Engineering Introduction
- **University**: VNUHCM – University of Information Technology (UIT)
- **Email**: 23521672@gm.uit.edu.vn
- **Project Repository**: [GitHub Repository](https://github.com/Janus-Aurelius/Master_CNPM.git)

---

## 🙏 Acknowledgements

- **UIT Faculty**: For guidance and project requirements
- **SE104 Course**: Software Engineering principles and methodologies
- **Development Team**: For collaborative effort and dedication
- **Open Source Libraries**: React, Material-UI, Express.js, and other dependencies
- **University of Information Technology**: For providing the learning environment
