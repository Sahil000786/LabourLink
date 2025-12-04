import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

import Home from "../pages/Home";
import Contact from "../pages/Contact";
import FindWorkPage from "../pages/FindWorkPage";
import Login from "../pages/Login";
import RegisterWorker from "../pages/RegisterWorker";
import RegisterRecruiter from "../pages/RegisterRecruiter";
import WorkerDashboard from "../pages/WorkerDashboard";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import WorkerProfile from "../pages/WorkerProfile";
import ChatPage from "../pages/ChatPage";
import SettingsPage from "../pages/SettingsPage";

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC PAGES */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        <Route
          path="/find-work"
          element={
            <MainLayout>
              <FindWorkPage />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/register-worker"
          element={
            <MainLayout>
              <RegisterWorker />
            </MainLayout>
          }
        />

        <Route
          path="/register-recruiter"
          element={
            <MainLayout>
              <RegisterRecruiter />
            </MainLayout>
          }
        />

        {/* WORKER PAGES */}
        <Route
          path="/worker-dashboard"
          element={
            <MainLayout>
              <PrivateRoute roles={["worker"]}>
                <WorkerDashboard />
              </PrivateRoute>
            </MainLayout>
          }
        />

        <Route
          path="/worker-profile"
          element={
            <MainLayout>
              <PrivateRoute roles={["worker"]}>
                <WorkerProfile />
              </PrivateRoute>
            </MainLayout>
          }
        />

        {/* RECRUITER PAGES */}
        <Route
          path="/recruiter-dashboard"
          element={
            <MainLayout>
              <PrivateRoute roles={["recruiter"]}>
                <RecruiterDashboard />
              </PrivateRoute>
            </MainLayout>
          }
        />

        {/* COMMON PAGES */}
        <Route
          path="/chat/:applicationId"
          element={
            <MainLayout>
              <PrivateRoute roles={["worker", "recruiter"]}>
                <ChatPage />
              </PrivateRoute>
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <PrivateRoute roles={["worker", "recruiter"]}>
                <SettingsPage />
              </PrivateRoute>
            </MainLayout>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
