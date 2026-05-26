// import { Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Pages (keep yours, just ensure paths are correct)
// import Home from "./pages/Home";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

// // Patient
// import PatientDashboard from "./pages/patient/PatientDashboard";

// // Doctor
// import DoctorDashboard from "./pages/doctor/DoctorDashboard";

// // Admin
// import AdminDashboard from "./pages/admin/AdminDashboard";

// const App = () => {
//   return (
//     <>
//       <Navbar />

//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Patient */}
//         <Route
//           path="/patient/dashboard"
//           element={
//             <ProtectedRoute role="patient">
//               <PatientDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Doctor */}
//         <Route
//           path="/doctor/dashboard"
//           element={
//             <ProtectedRoute role="doctor">
//               <DoctorDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Admin */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// };

// export default App;


const App = () => {
  return <h1 style={{ color: "green" }}>APP IS WORKING</h1>;
};

export default App;