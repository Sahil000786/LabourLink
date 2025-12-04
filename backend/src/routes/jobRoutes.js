// backend/src/routes/jobRoutes.js
const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
  getRecruiterJobs,
} = require("../controllers/jobController");

// Public: list open jobs
router.get("/", getJobs);

// Recruiter: list this recruiter's jobs
router.get("/recruiter", protect, requireRole("recruiter"), getRecruiterJobs);

// Recruiter: create job
router.post("/", protect, requireRole("recruiter"), createJob);

module.exports = router;
