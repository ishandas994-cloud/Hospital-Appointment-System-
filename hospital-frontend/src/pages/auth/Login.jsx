import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { loginUser } from "../../api/authAPI";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data =
        await loginUser(formData);

      // Save user
      login(
        data.token,
        data.user
      );

      // Redirect by role
      if (
        data.user.role === "admin"
      ) {
        navigate(
          "/admin/dashboard"
        );
      } else if (
        data.user.role ===
        "doctor"
      ) {
        navigate(
          "/doctor/dashboard"
        );
      } else {
        navigate(
          "/patient/dashboard"
        );
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={
            formData.password
          }
          onChange={handleChange}
          required
        />

        <button type="submit">
          {loading
            ? "Loading..."
            : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;