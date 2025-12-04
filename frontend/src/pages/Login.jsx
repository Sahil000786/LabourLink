import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authApi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      // Save user + token in context
      login(data.user, data.token);

      // Redirect based on role
      if (data.user.role === "worker") {
        navigate("/worker-dashboard");
      } else if (data.user.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const backendMessage = err.response?.data?.message;
      setError(
        backendMessage || err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ll-center" style={{ minHeight: "70vh" }}>
      <div className="ll-auth-card-wrapper">
        <div className="ll-auth-card">
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
            Log in to your LabourLink account.
          </p>

          <form className="ll-form" onSubmit={handleSubmit}>
            <div className="ll-field">
              <label className="ll-label">Email Address</label>
              <input
                className="ll-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="ll-field">
              <label className="ll-label">Password</label>
              <input
                className="ll-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>
            )}

            <button
              type="submit"
              className="ll-btn ll-btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: 8 }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            Don’t have an account?{" "}
            <Link to="/register-worker">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
