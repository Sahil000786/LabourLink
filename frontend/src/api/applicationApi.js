// frontend/src/api/applicationApi.js
import api from "./apiClient";

// Worker applies to a job
export const applyToJob = async (jobId, message = "") => {
  const res = await api.post("/applications", { jobId, message });
  return res.data;
};

// Worker: get own applications
export const getWorkerApplications = async () => {
  const res = await api.get("/applications/worker");
  return res.data;
};

// 👉 alias used by FindWorkPage.jsx
// So you don't need to change that file.
export const getMyApplications = async () => {
  return getWorkerApplications();
};

// Recruiter: get all applications to their jobs
export const getRecruiterApplications = async () => {
  const res = await api.get("/applications/recruiter");
  return res.data;
};

// Recruiter: update status of an application
export const updateApplicationStatus = async (id, status) => {
  const res = await api.patch(`/applications/${id}/status`, { status });
  return res.data;
};

// Recruiter: add rating / feedback
export const addApplicationFeedback = async (id, rating, feedback = "") => {
  const res = await api.post(`/applications/${id}/feedback`, {
    rating,
    feedback,
  });
  return res.data;
};
