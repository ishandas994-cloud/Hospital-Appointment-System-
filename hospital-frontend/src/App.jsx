import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

// Home
import Home from "./pages/Home";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Patient
import PatientDashboard from "./pages/patient/PatientDashboard";
import FindDoctors from "./pages/patient/FindDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import PatientProfile from "./pages/patient/PatientProfile";

// Doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ManageSlots from "./pages/doctor/ManageSlots";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageUsers from "./pages/admin/ManageUsers";
import AllAppointments from "./pages/admin/AllAppointments";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        {/* PATIENT ROUTES */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute role="patient">
              <FindDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/book/:id"
          element={
            <ProtectedRoute role="patient">
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute role="patient">
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute role="patient">
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        {/* DOCTOR ROUTES */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/slots"
          element={
            <ProtectedRoute role="doctor">
              <ManageSlots />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute role="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute role="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute role="admin">
              <ManageDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="admin">
              <AllAppointments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;