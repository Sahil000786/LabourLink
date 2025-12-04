import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobs } from "../api/jobApi";
import { applyToJob, getMyApplications } from "../api/applicationApi";

const FindWorkPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // applications (for “already applied” info)
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const [applyJobId, setApplyJobId] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");

  // load jobs
  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs({});
      setJobs(data);
    } catch (err) {
      console.error("FindWorkPage jobs error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // load worker applications if logged in
  const loadApplications = async () => {
    if (!user || user.role !== "worker") {
      setApplications([]);
      setLoadingApps(false);
      return;
    }
    try {
      setLoadingApps(true);
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error("FindWorkPage apps error:", err.response?.data || err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // which jobs already applied?
  const appliedJobIds = useMemo(() => {
    const set = new Set();
    for (const app of applications) {
      if (app.job?._id) set.add(app.job._id);
    }
    return set;
  }, [applications]);

  // client-side filter
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesTitle = job.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());
      const matchesLocation = job.location
        .toLowerCase()
        .includes(locationFilter.toLowerCase());
      const matchesCategory = job.category
        .toLowerCase()
        .includes(categoryFilter.toLowerCase());
      return matchesTitle && matchesLocation && matchesCategory;
    });
  }, [jobs, titleFilter, locationFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // filters are already applied in useMemo
  };

  const handleApplyClick = (jobId) => {
    // if not logged in, send to register-worker
    if (!user) {
      navigate("/register-worker");
      return;
    }
    // if logged in but not worker, show message
    if (user.role !== "worker") {
      alert("Only workers can apply for jobs. Please log in as worker.");
      return;
    }

    setApplyJobId(jobId);
    setApplyMessage("");
  };

  const doApply = async (jobId) => {
    try {
      await applyToJob(jobId, applyMessage);
      alert("Application submitted.");
      setApplyJobId(null);
      setApplyMessage("");
      await loadApplications();
    } catch (err) {
      console.error("FindWork apply error:", err.response?.data || err);
      const msg =
        err?.response?.data?.message ||
        "Could not apply for this job. You may have already applied.";
      alert(msg);
    }
  };

  return (
    <div className="ll-page-animate">
      <div className="ll-card-border" style={{ marginBottom: 20 }}>
        <div className="ll-card-header">
          <div>
            <div className="ll-card-title">Find local work</div>
            <div className="ll-card-sub">
              Browse open jobs near you. Create an account to apply.
            </div>
          </div>
        </div>

        {/* SEARCH / FILTER BAR */}
        <form className="ll-filter-group" onSubmit={handleSearchSubmit}>
          <div className="ll-field">
            <label className="ll-label">Search</label>
            <input
              className="ll-input"
              placeholder="Job title"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </div>
          <div className="ll-field">
            <label className="ll-label">Location</label>
            <input
              className="ll-input"
              placeholder="City"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <div className="ll-field">
            <label className="ll-label">Category</label>
            <input
              className="ll-input"
              placeholder="e.g. electrician"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
          <div className="ll-field" style={{ alignSelf: "flex-end" }}>
            <button
              type="submit"
              className="ll-btn ll-btn-primary"
              style={{ width: "100%" }}
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* JOB LIST */}
      <div className="ll-card-border">
        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p>No jobs found for this search.</p>
        ) : (
          <div className="ll-job-list">
            {filteredJobs.map((job) => {
              const alreadyApplied = appliedJobIds.has(job._id);

              return (
                <div key={job._id} className="ll-card-border">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{job.title}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {job.location} • {job.category}
                      </div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>
                        ₹{job.wage} / {job.jobType}
                      </div>
                    </div>

                    <div style={{ alignSelf: "center" }}>
                      {alreadyApplied ? (
                        <span className="ll-chip ll-chip-blue">
                          Already applied
                        </span>
                      ) : applyJobId === job._id ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <textarea
                            className="ll-textarea"
                            rows={2}
                            placeholder="Short message to recruiter (optional)"
                            value={applyMessage}
                            onChange={(e) =>
                              setApplyMessage(e.target.value)
                            }
                          />
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              className="ll-btn ll-btn-sm ll-btn-primary"
                              onClick={() => doApply(job._id)}
                            >
                              Send application
                            </button>
                            <button
                              type="button"
                              className="ll-btn ll-btn-sm"
                              onClick={() => {
                                setApplyJobId(null);
                                setApplyMessage("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="ll-btn ll-btn-sm ll-btn-primary"
                          onClick={() => handleApplyClick(job._id)}
                        >
                          Apply as worker
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWorkPage;
