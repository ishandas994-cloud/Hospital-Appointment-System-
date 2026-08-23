🏥 Hospital Appointment System

A full-stack production-grade web application for managing hospital appointments with role-based access control.

📌 Overview

The Hospital Appointment System is a complete MERN stack application that digitizes the hospital appointment booking process. It supports three distinct user roles — Patient, Doctor, and Admin — each with their own dashboard and functionality. The system handles everything from doctor discovery and slot booking to appointment management and email notifications.

✨ Key Features

Patient

Register and login securely with JWT authentication
Browse and search doctors by specialization or name
View available time slots by date
Book appointments with reason for visit
Cancel appointments
Leave star ratings and reviews for doctors after consultation
View complete appointment history

Doctor

Manage professional profile (specialization, fee, bio, availability)
Create time slots for specific dates
View and manage all patient appointments
Mark appointments as completed with notes and prescription
Block/unblock time slots

Admin

Dashboard with real-time stats and charts
Approve or reject doctor registrations
Manage all users (activate/deactivate accounts)
View all appointments across the system
Monitor pending doctor approvals
🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS, Axios, React Router
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Auth	JWT (JSON Web Tokens) + Bcrypt
Email	Nodemailer (Gmail SMTP)
File Upload	Multer + Cloudinary
Security	Helmet, CORS, Rate Limiting
Logging	Winston
Validation	Joi
🗄️ Database Models
User — base auth model with role (patient/doctor/admin)
Doctor — specialization, qualification, experience, fee, rating
Patient — personal details, blood group, emergency contact
Slot — date, time, booked/blocked status
Appointment — links patient + doctor + slot with status workflow
Review — star rating with auto-recalculate doctor average
PasswordReset — hashed token with 15-min TTL auto-delete
🔐 Security Features
JWT token authentication on all protected routes
Role-based access control (patient/doctor/admin)
Password hashing with Bcrypt (12 salt rounds)
Rate limiting (10 auth attempts per 15 minutes)
Helmet security headers
Input validation with Joi on all endpoints
Secure password reset with hashed tokens
📡 API Endpoints
Module	Endpoints
Auth	Register, Login, Logout, Forgot Password, Reset Password
Doctor	List, Search, Get by ID, Update Profile, Create Slots
Patient	Get Profile, Update Profile
Appointment	Book, Cancel, Complete, Get Mine, Get Doctor's
Review	Create, Get by Doctor, Delete
Admin	Dashboard, Approve Doctor, Manage Users, All Appointments
Upload	Profile Photo Upload/Delete
🚀 Deployment
Backend — Render.com
Frontend — Vercel
Database — MongoDB Atlas (Free Tier)
Media — Cloudinary
📁
