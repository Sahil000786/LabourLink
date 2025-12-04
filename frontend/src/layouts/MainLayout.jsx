import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="ll-app">
      <header className="ll-header">
        <div className="ll-header-inner">
          <Link to="/" className="ll-logo">
            <span className="ll-logo-dot" />
            <span>{t("appName")}</span>
          </Link>

          <nav className="ll-nav">
            <NavLink to="/" end className="ll-nav-link">
              {t("navHome")}
            </NavLink>
            <NavLink to="/find-work" className="ll-nav-link">
              {t("navFindWork")}
            </NavLink>
            <NavLink to="/contact" className="ll-nav-link">
              {t("navContact")}
            </NavLink>
            {user && (
              <>
                <NavLink
                  to={
                    user.role === "worker"
                      ? "/worker-dashboard"
                      : "/recruiter-dashboard"
                  }
                  className="ll-nav-link"
                >
                  {t("navDashboard")}
                </NavLink>
                <NavLink
                  to={
                    user.role === "worker"
                      ? "/worker-profile"
                      : "/recruiter-dashboard"
                  }
                  className="ll-nav-link"
                >
                  {t("navProfile")}
                </NavLink>
              </>
            )}
          </nav>

          <div className="ll-header-right">
            <select
              className="ll-lang-select"
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
            </select>

            {user ? (
              <div className="ll-user-chip">
                <span className="ll-user-name">
                  {user.name} ({user.role})
                </span>
                <button className="ll-btn ll-btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="ll-auth-links">
                <Link to="/login" className="ll-btn ll-btn-ghost">
                  Login
                </Link>
                <Link to="/register-worker" className="ll-btn ll-btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="ll-main">
        <div className="ll-main-inner ll-page-animate">{children}</div>
      </main>

      <footer className="ll-footer">
        <div className="ll-footer-inner">
          <span>© {new Date().getFullYear()} LabourLink. All rights reserved.</span>
          <span>Connecting local workers with local opportunities.</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
