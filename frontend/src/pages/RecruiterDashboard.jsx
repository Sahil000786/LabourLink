// frontend/src/pages/RecruiterDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecruiterJobs, createJob } from "../api/jobApi";
import {
  getRecruiterApplications,
  updateApplicationStatus,
  addApplicationFeedback,
} from "../api/applicationApi";

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);

  // create job form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [wage, setWage] = useState("");
  const [jobType, setJobType] = useState("daily");
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await getRecruiterJobs();
      setJobs(data);
    } catch (err) {
      console.error("RecruiterDashboard jobs error:", err.response?.data || err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    try {
      setLoadingApps(true);
      const data = await getRecruiterApplications();
      setApplications(data);
    } catch (err) {
      console.error(
        "RecruiterDashboard apps error:",
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

  const stats = useMemo(() => {
    const jobsWithApplicants = jobs.filter(
      (j) => j.applicantCount && j.applicantCount > 0
    ).length;
    const totalApplicants = applications.length;
    const shortlisted = applications.filter(
      (a) => a.status === "shortlisted"
    ).length;
    const hired = applications.filter((a) => a.status === "hired").length;
    return { jobsWithApplicants, totalApplicants, shortlisted, hired };
  }, [jobs, applications]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!title || !description || !category || !location || !wage) {
      setCreateError("Please fill all fields before posting the job.");
      return;
    }

    const wageNumber = Number(wage);
    if (Number.isNaN(wageNumber) || wageNumber <= 0) {
      setCreateError("Please enter a valid wage amount.");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        title,
        description,
        category,
        location,
        wage: wageNumber,
        jobType, // daily/monthly/contract
        experienceLevel, // fresher / 1-3 years / 3+ years
      };

      await createJob(payload);

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setWage("");
      setJobType("daily");
      setExperienceLevel("fresher");
      setCreateError("");

      await loadJobs();
      alert("Job posted successfully.");
    } catch (err) {
      console.error("Create job error:", err.response?.data || err);
      setCreateError(
        err?.response?.data?.message ||
          "Server error while creating job. Please check the fields."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      await loadApplications();
    } catch (err) {
      console.error("Update status error:", err.response?.data || err);
      alert(
        err?.response?.data?.message ||
          "Could not update status. Please try again."
      );
    }
  };

  const handleFeedback = async (appId) => {
    const rating = window.prompt("Rate this worker from 1 to 5:");
    if (!rating) return;
    const ratingNum = Number(rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert("Please enter a number between 1 and 5.");
      return;
    }

    const fb = window.prompt("Write feedback (optional):") || "";
    try {
      await addApplicationFeedback(appId, ratingNum, fb);
      await loadApplications();
    } catch (err) {
      console.error("Feedback error:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
          "Failed to save feedback. Remember: you can only rate Hired workers."
      );
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="ll-dashboard">
      {/* SIDEBAR */}
      <aside className="ll-sidebar">
        <div className="ll-sidebar-top">
          <div className="ll-sidebar-user">
            <div className="ll-avatar">
              {user?.name?.[0]?.toUpperCase() || "R"}
            </div>
            <div>
              <div className="ll-sidebar-name">{user?.name}</div>
              <div className="ll-sidebar-role">Recruiter</div>
            </div>
          </div>

          <nav className="ll-sidebar-nav">
            <div className="ll-sidebar-link ll-active">Dashboard</div>
            <Link to="/recruiter-profile" className="ll-sidebar-link">
              Profile
            </Link>
            <Link to="/settings" className="ll-sidebar-link">
              Settings
            </Link>
          </nav>
        </div>

        <div className="ll-sidebar-footer">
          Post clear job details so workers nearby can confidently apply. Use
          feedback & ratings to build long-term talent.
        </div>
      </aside>

      {/* MAIN */}
      <section className="ll-dashboard-main">
        <div className="ll-dash-header">
          <div>
            <div className="ll-dash-title">Recruiter dashboard</div>
            <div className="ll-dash-meta">
              Post jobs, review applicants and connect with local workers.
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="ll-stat-grid">
          <div className="ll-stat-card">
            <div className="ll-stat-label">Jobs with applicants</div>
            <div className="ll-stat-value">{stats.jobsWithApplicants}</div>
          </div>
          <div className="ll-stat-card">
            <div className="ll-stat-label">Total applicants</div>
            <div className="ll-stat-value">{stats.totalApplicants}</div>
          </div>
          <div className="ll-stat-card">
            <div className="ll-stat-label">Shortlisted</div>
            <div className="ll-stat-value">{stats.shortlisted}</div>
          </div>
          <div className="ll-stat-card">
            <div className="ll-stat-label">Hired</div>
            <div className="ll-stat-value">{stats.hired}</div>
          </div>
        </div>

        {/* CREATE JOB */}
        <div className="ll-card-border">
          <div className="ll-card-header">
            <div>
              <div className="ll-card-title">Post a new job</div>
              <div className="ll-card-sub">
                Share job details so nearby workers can apply.
              </div>
            </div>
          </div>

          <form className="ll-form" onSubmit={handleCreateJob}>
            <div className="ll-field">
              <label className="ll-label">Job title</label>
              <input
                className="ll-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="ll-field">
              <label className="ll-label">Description</label>
              <textarea
                className="ll-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="ll-filter-group">
              <div className="ll-field">
                <label className="ll-label">Category</label>
                <input
                  className="ll-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="ll-field">
                <label className="ll-label">Location</label>
                <input
                  className="ll-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="ll-field">
                <label className="ll-label">Wage</label>
                <input
                  className="ll-input"
                  type="number"
                  min="0"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                />
              </div>
            </div>

            <div className="ll-filter-group">
              <div className="ll-field">
                <label className="ll-label">Job type</label>
                <select
                  className="ll-input"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="ll-field">
                <label className="ll-label">Experience level</label>
                <select
                  className="ll-input"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="fresher">Fresher</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3+ years">3+ years</option>
                </select>
              </div>
            </div>

            {createError && (
              <div style={{ color: "#b91c1c", fontSize: 13 }}>{createError}</div>
            )}

            <div>
              <button
                type="submit"
                className="ll-btn ll-btn-primary"
                disabled={creating}
              >
                {creating ? "Posting..." : "Post job"}
              </button>
            </div>
          </form>
        </div>

        {/* APPLICANTS */}
        <div className="ll-card-border">
          <div className="ll-card-header">
            <div>
              <div className="ll-card-title">Applicants</div>
              <div className="ll-card-sub">
                Review all workers who applied to your jobs. You can also rate
                hired workers.
              </div>
            </div>
          </div>

          {loadingApps ? (
            <p>Loading applicants...</p>
          ) : applications.length === 0 ? (
            <p>No one has applied yet.</p>
          ) : (
            <table className="ll-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Applied on</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.worker?.name}</td>
                    <td>{app.job?.title}</td>
                    <td>{app.status}</td>
                    <td>{app.rating ? `${app.rating}/5` : "-"}</td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="ll-btn ll-btn-sm"
                          onClick={() =>
                            handleStatusChange(app._id, "shortlisted")
                          }
                        >
                          Shortlist
                        </button>
                        <button
                          className="ll-btn ll-btn-sm ll-btn-primary"
                          onClick={() =>
                            handleStatusChange(app._id, "hired")
                          }
                        >
                          Mark hired
                        </button>
                        <button
                          className="ll-btn ll-btn-sm"
                          onClick={() => handleFeedback(app._id)}
                        >
                          Rate
                        </button>
                        <Link
                          to={`/chat/${app._id}`}
                          className="ll-btn ll-btn-sm"
                        >
                          Chat
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default RecruiterDashboard;
