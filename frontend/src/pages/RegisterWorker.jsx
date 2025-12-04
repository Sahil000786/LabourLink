import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const RegisterWorker = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "worker",
      };
      const data = await registerUser(payload);
      login(data.user, data.token);
      navigate("/worker-dashboard");
    } catch (err) {
      console.error("Worker register error:", err);
      const backendMessage = err.response?.data?.message;
      setError(
        backendMessage ||
          err.message ||
          "Registration failed. Please check details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ll-center" style={{ minHeight: "70vh" }}>
      <div className="ll-auth-card-wrapper">
        <div className="ll-auth-card">
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Create Your Account</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
            I am a...
          </p>

          <div className="ll-toggle-pill" style={{ marginBottom: 18 }}>
            <button className="ll-toggle-active">Worker</button>
            <button
              type="button"
              onClick={() => navigate("/register-recruiter")}
            >
              Recruiter
            </button>
          </div>

          <form className="ll-form" onSubmit={handleSubmit}>
            <div className="ll-field">
              <label className="ll-label">Full Name</label>
              <input
                className="ll-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="ll-field">
              <label className="ll-label">Email Address</label>
              <input
                className="ll-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="ll-field">
              <label className="ll-label">Mobile Number</label>
              <input
                className="ll-input"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
              />
            </div>

            <div className="ll-field">
              <label className="ll-label">Create Password</label>
              <input
                className="ll-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="ll-field">
              <label className="ll-label">Confirm Password</label>
              <input
                className="ll-input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>

            {error && (
              <div style={{ fontSize: 13, color: "#dc2626" }}>{error}</div>
            )}

            <button
              type="submit"
              className="ll-btn ll-btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: 8 }}
            >
              {loading ? "Creating account..." : "Create Account"}
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
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterWorker;
