import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>HospitalMS</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user?.role === "patient" && (
          <>
            <Link to="/patient/dashboard">Dashboard</Link>
            <Link to="/patient/doctors">Doctors</Link>
            <Link to="/patient/appointments">
              Appointments
            </Link>
          </>
        )}

        {user?.role === "doctor" && (
          <>
            <Link to="/doctor/dashboard">Dashboard</Link>
            <Link to="/doctor/appointments">
              Appointments
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Admin</Link>
          </>
        )}

        {user && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;