<div align="center">

# 🏥 Hospital Appointment System

### A production-grade full-stack web application for managing hospital appointments

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[Live Demo](#) · [Report Bug](https://github.com/ishandas994-cloud/Hospital-Appointment-System/issues) · [Request Feature](https://github.com/ishandas994-cloud/Hospital-Appointment-System/issues)

</div>

---

## 📌 About The Project

The Hospital Appointment System is a complete MERN stack application that
digitizes the hospital appointment booking process. It supports three distinct
user roles — **Patient**, **Doctor**, and **Admin** — each with their own
dashboard and functionality.

The system handles everything from doctor discovery and slot booking to
appointment management, email notifications, and admin analytics — built
with production-grade standards including JWT auth, role-based access
control, input validation, rate limiting, and proper error handling.

---

## ✨ Features

### 🧑‍⚕️ Patient
- Register and login with JWT authentication
- Browse and search doctors by specialization or name
- View available time slots by date
- Book appointments with reason for visit
- Cancel appointments anytime
- Leave star ratings and reviews after consultation
- View complete appointment history with filters

### 👨‍⚕️ Doctor
- Manage professional profile (specialization, fee, bio, availability days)
- Create time slots for specific dates
- Block/unblock individual time slots
- View and manage all patient appointments
- Mark appointments as completed with notes and prescription

### 🔐 Admin
- Dashboard with real-time stats and appointment charts
- Approve or reject doctor registrations
- Manage all users — activate or deactivate accounts
- View all appointments across the system with filters
- Monitor pending doctor approvals

---

## 🛠️ Built With

### Backend
| Package | Purpose |
|---|---|
| Node.js + Express | Server and REST API |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Token | Authentication |
| Bcryptjs | Password hashing |
| Joi | Request validation |
| Nodemailer | Email notifications |
| Multer + Cloudinary | File/image uploads |
| Helmet | Security headers |
| express-rate-limit | Brute force protection |
| Winston | Production logging |
| Morgan | HTTP request logging |

### Frontend
| Package | Purpose |
|---|---|
| React.js | UI library |
| React Router DOM | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Hook Form | Form handling |
| React Hot Toast | Notifications |
| Recharts | Admin dashboard charts |
| date-fns | Date formatting |

---

## 🗄️ Database Schema
