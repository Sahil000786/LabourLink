// frontend/src/pages/WorkerDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobs } from "../api/jobApi";
import {
  applyToJob,
  getWorkerApplications,
} from "../api/applicationApi";

const WorkerDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);

  const [openJobId, setOpenJobId] = useState(null);
  const [messageByJob, setMessageByJob] = useState({});
  const [applyingJobId, setApplyingJobId] = useState(null);

  // ─────────────────────────────────────────
  // Load data from backend
  // ─────────────────────────────────────────
  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("WorkerDashboard jobs error:", err.response?.data || err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    try {
      setLoadingApps(true);
      const data = await getWorkerApplications();
      setApplications(data);
    } catch (err) {
      console.error(
        "WorkerDashboard applications error:",
        err.response?.data || err
      );
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  // ─────────────────────────────────────────
  // Stats + helpers
  // ─────────────────────────────────────────
  const stats = useMemo(() => {
    const total = applications.length;
    const hired = applications.filter((a) => a.status === "hired").length;
    const pending = applications.filter(
      (a) => a.status === "applied" || a.status === "shortlisted"
    ).length;

    const rated = applications.filter((a) => a.rating).length;
    const avgRating =
      rated > 0
        ? (
            applications
              .filter((a) => a.rating)
              .reduce((sum, a) => sum + a.rating, 0) / rated
          ).toFixed(1)
        : "–";

    return { total, hired, pending, avgRating };
  }, [applications]);

  // list of job IDs already applied by this worker
  const appliedJobIds = useMemo(() => {
    const set = new Set();
    applications.forEach((a) => {
      if (a.job && typeof a.job === "object") {
        set.add(a.job._id);
      } else if (a.job) {
        set.add(a.job);
      }
    });
    return set;
  }, [applications]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString();
  };

  // ─────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────
  const handleOpenApply = (jobId) => {
    setOpenJobId(jobId);
  };

  const handleCancelApply = () => {
    setOpenJobId(null);
  };

  const handleMessageChange = (jobId, value) => {
    setMessageByJob((prev) => ({ ...prev, [jobId]: value }));
  };

  const handleApply = async (jobId) => {
    const msg = messageByJob[jobId] || "";
    setApplyingJobId(jobId);

    try {
      if (appliedJobIds.has(jobId)) {
        alert("You have already applied for this job.");
        return;
      }

      await applyToJob(jobId, msg);

      alert("Application sent.");
      setMessageByJob((prev) => ({ ...prev, [jobId]: "" }));
      setOpenJobId(null);

      // reload applications so UI updates
      await loadApplications();
    } catch (err) {
      console.error("Apply to job error:", err.response?.data || err);
      const msgFromServer = err.response?.data?.message;

      if (
        err.response?.status === 400 &&
        msgFromServer?.toLowerCase().includes("already")
      ) {
        alert(msgFromServer || "You have already applied for this job.");
        await loadApplications();
      } else {
        alert(
          msgFromServer ||
            "Server error while applying to job. Please try again."
        );
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <div className="ll-dashboard">
      {/* SIDEBAR */}
      <aside className="ll-sidebar">
        <div className="ll-sidebar-top">
          <div className="ll-sidebar-user">
            <div className="ll-avatar">
              {user?.name?.[0]?.toUpperCase() || "W"}
            </div>
            <div>
              <div className="ll-sidebar-name">{user?.name}</div>
              <div className="ll-sidebar-role">Worker</div>
            </div>
          </div>

          <nav className="ll-sidebar-nav">
            <div className="ll-sidebar-link ll-active">Dashboard</div>
            <Link to="/worker-profile" className="ll-sidebar-link">
              Profile
            </Link>
            <Link to="/settings" className="ll-sidebar-link">
              Settings
            </Link>
          </nav>
        </div>

        <div className="ll-sidebar-footer">
          Apply only to jobs that match your skills. Track your applications and
          see recruiter feedback here.
        </div>
      </aside>

      {/* MAIN */}
      <section className="ll-dashboard-main">
        {/* Header */}
        <div className="ll-dash-header">
          <div>
            <div className="ll-dash-title">Worker dashboard</div>
            <div className="ll-dash-meta">
              View your applications, hiring status and ratings from recruiters.
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="ll-stat-grid">
          <div className="ll-stat-card">
            <div className="ll-stat-label">Total applications</div>
            <div className="ll-stat-value">{stats.total}</div>
          </div>
          <div className="ll-stat-card">
            <div className="ll-stat-label">Hired</div>
            <div className="ll-stat-value">{stats.hired}</div>
          </div>
          <div className="ll-stat-card">
            <div className="ll-stat-label">Pending</div>
            <div className="ll-stat-value">{stats.pending}</div>
          </div>
          <div className="ll-stat-card">
            <div className="ll-stat-label">Average rating</div>
            <div className="ll-stat-value">{stats.avgRating}</div>
          </div>
        </div>

        {/* Your applications table */}
        <div className="ll-card-border">
          <div className="ll-card-header">
            <div>
              <div className="ll-card-title">Your applications</div>
              <div className="ll-card-sub">
                Track job status and see recruiter feedback.
              </div>
            </div>
          </div>

          {loadingApps ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <p>You have not applied to any jobs yet.</p>
          ) : (
            <table className="ll-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Applied on</th>
                  <th>Chat</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.job?.title || "-"}</td>
                    <td>{app.job?.category || "-"}</td>
                    <td>{app.status}</td>
                    <td>{app.rating ? `${app.rating}/5` : "-"}</td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      <Link
                        to={`/chat/${app._id}`}
                        className="ll-btn ll-btn-sm"
                      >
                        Open chat
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Jobs near you – CARD STYLE */}
        <div className="ll-card-border">
          <div className="ll-card-header">
            <div>
              <div className="ll-card-title">Jobs near you</div>
              <div className="ll-card-sub">
                Apply to jobs that match your skills. You can add a short
                message for the recruiter.
              </div>
            </div>
          </div>

          {loadingJobs ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs available right now. Check again later.</p>
          ) : (
            <div className="ll-jobs-list">
              {jobs.map((job) => {
                const alreadyApplied = appliedJobIds.has(job._id);
                const isOpen = openJobId === job._id;

                return (
                  <div key={job._id} className="ll-job-card">
                    {/* header row */}
                    <div className="ll-job-header">
                      <div>
                        <h3 className="ll-job-title">{job.title}</h3>
                        <div className="ll-job-meta">
                          📍 {job.location} • {job.category}
                        </div>
                      </div>
                      <div className="ll-job-wage">
                        💰 ₹{job.wage} / {job.jobType || "day"}
                      </div>
                    </div>

                    {/* description */}
                    {job.description && (
                      <p className="ll-job-desc">
                        {job.description.length > 80
                          ? job.description.slice(0, 80) + "..."
                          : job.description}
                      </p>
                    )}

                    {/* footer row with Apply / Applied */}
                    <div className="ll-job-footer">
                      {alreadyApplied ? (
                        <span className="ll-badge">Applied</span>
                      ) : isOpen ? (
                        <>
                          <textarea
                            className="ll-textarea"
                            rows={2}
                            placeholder="Short message to recruiter (optional)"
                            value={messageByJob[job._id] || ""}
                            onChange={(e) =>
                              handleMessageChange(job._id, e.target.value)
                            }
                          />
                          <div className="ll-job-footer-buttons">
                            <button
                              className="ll-btn ll-btn-primary"
                              disabled={applyingJobId === job._id}
                              onClick={() => handleApply(job._id)}
                            >
                              {applyingJobId === job._id
                                ? "Sending..."
                                : "Send application"}
                            </button>
                            <button
                              type="button"
                              className="ll-btn ll-btn-secondary"
                              onClick={handleCancelApply}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="ll-btn ll-btn-primary"
                          onClick={() => handleOpenApply(job._id)}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WorkerDashboard;
