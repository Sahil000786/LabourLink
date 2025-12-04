// backend/src/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  applyToJob,
  getWorkerApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  addApplicationFeedback,
} = require("../controllers/applicationController");

// Worker: apply to a job
router.post("/", protect, requireRole("worker"), applyToJob);

// Worker: view own applications
router.get("/worker", protect, requireRole("worker"), getWorkerApplications);

// Recruiter: see all applications to their jobs
router.get(
  "/recruiter",
  protect,
  requireRole("recruiter"),
  getRecruiterApplications
);

// Recruiter: update status
router.patch(
  "/:id/status",
  protect,
  requireRole("recruiter"),
  updateApplicationStatus
);

// Recruiter: add rating / feedback
router.post(
  "/:id/feedback",
  protect,
  requireRole("recruiter"),
  addApplicationFeedback
);

module.exports = router;
