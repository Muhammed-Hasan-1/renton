import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import API from "../services/api";
import { getToken, setSession } from "../services/auth";
import "../styles/SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      // Save session (tab-scoped)
      setSession(response.data.token, response.data.user);

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >

        <h2>Sign In</h2>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <label>
          Email

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Continue"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>

      </form>

    </div>
  );
}

export default SignIn;