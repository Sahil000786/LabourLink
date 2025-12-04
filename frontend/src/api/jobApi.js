// frontend/src/api/jobApi.js
import api from "./apiClient";

// Public jobs (used on Find Work, Worker dashboard)
export const getJobs = async (params = {}) => {
  const res = await api.get("/jobs", { params });
  return res.data;
};

// Recruiter jobs (for recruiter dashboard)
export const getRecruiterJobs = async () => {
  const res = await api.get("/jobs/recruiter");
  return res.data;
};

// Create new job (recruiter only)
export const createJob = async (jobData) => {
  const res = await api.post("/jobs", jobData);
  return res.data;
};
