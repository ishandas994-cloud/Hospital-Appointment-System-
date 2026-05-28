import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Spinner from './components/Spinner.jsx'
import React from "react";
// Public pages
import Home           from './pages/Home.jsx'
import Login          from './pages/auth/Login.jsx'
import Register       from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard.jsx'
import FindDoctors      from './pages/patient/FindDoctors.jsx'
import BookAppointment  from './pages/patient/BookAppointment.jsx'
import MyAppointments   from './pages/patient/MyAppointments.jsx'
import PatientProfile   from './pages/patient/PatientProfile.jsx'

// Doctor pages
import DoctorDashboard    from './pages/doctor/DoctorDashboard.jsx'
import ManageSlots        from './pages/doctor/ManageSlots.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'
import DoctorProfile      from './pages/doctor/DoctorProfile.jsx'

// Admin pages
import AdminDashboard  from './pages/admin/AdminDashboard.jsx'
import ManageDoctors   from './pages/admin/ManageDoctors.jsx'
import ManageUsers     from './pages/admin/ManageUsers.jsx'
import AllAppointments from './pages/admin/AllAppointments.jsx'

export default function App() {
  const { loading } = useAuth()
  if (loading) return <Spinner fullPage />

  return (
    <Routes>
      {/* Public */}
      <Route path="/"                element={<Home />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Patient */}
      <Route path="/patient" element={<ProtectedRoute role="patient" />}>
        <Route path="dashboard"      element={<PatientDashboard />} />
        <Route path="doctors"        element={<FindDoctors />} />
        <Route path="book/:doctorId" element={<BookAppointment />} />
        <Route path="appointments"   element={<MyAppointments />} />
        <Route path="profile"        element={<PatientProfile />} />
      </Route>

      {/* Doctor */}
      <Route path="/doctor" element={<ProtectedRoute role="doctor" />}>
        <Route path="dashboard"    element={<DoctorDashboard />} />
        <Route path="slots"        element={<ManageSlots />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="profile"      element={<DoctorProfile />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin" />}>
        <Route path="dashboard"    element={<AdminDashboard />} />
        <Route path="doctors"      element={<ManageDoctors />} />
        <Route path="users"        element={<ManageUsers />} />
        <Route path="appointments" element={<AllAppointments />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}