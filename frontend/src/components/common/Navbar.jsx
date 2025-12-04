import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="ll-navbar">
      <div className="ll-navbar-inner">
        <Link to="/" className="ll-brand">
          <span className="ll-brand-dot" />
          LabourLink
        </Link>

        <div className="ll-nav-links">
          <Link to="/" className="ll-nav-link">
            Home
          </Link>
          <span className="ll-nav-link" style={{ color: "#9ca3af" }}>
            About
          </span>
          <span className="ll-nav-link" style={{ color: "#9ca3af" }}>
            Contact
          </span>

          {isAuthenticated && user?.role === "worker" && (
            <>
              <Link to="/worker-dashboard" className="ll-nav-link">
                Dashboard
              </Link>
              <Link to="/worker-profile" className="ll-nav-link">
                Profile
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === "recruiter" && (
            <>
              <Link to="/recruiter-dashboard" className="ll-nav-link">
                Dashboard
              </Link>
              <Link to="/recruiter-profile" className="ll-nav-link">
                Profile
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="ll-nav-link">
                Login
              </Link>
              <Link to="/register-worker" className="ll-nav-link">
                Register
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="ll-nav-user">
              <span>
                {user?.name} ({user?.role})
              </span>
              <button className="ll-btn ll-btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
