// backend/src/controllers/jobController.js
const Job = require("../models/Job");

// POST /api/jobs  (recruiter only)
exports.createJob = async (req, res) => {
  try {
    // safety: make sure user is there
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      title,
      description,
      category,
      location,
      wage,
      jobType,
      experienceLevel,
    } = req.body;

    // basic validation
    if (!title || !description || !category || !location || wage == null) {
      return res.status(400).json({
        message:
          "Missing required fields (title, description, category, location, wage).",
      });
    }

    const wageNumber = Number(wage);
    if (Number.isNaN(wageNumber) || wageNumber < 0) {
      return res.status(400).json({ message: "Invalid wage value." });
    }

    const job = await Job.create({
      recruiter: req.user.id,
      title,
      description,
      category,
      location,
      wage: wageNumber,
      jobType,
      experienceLevel,
    });

    return res.status(201).json(job);
  } catch (err) {
    console.error("Create job error:", err);
    return res.status(500).json({
      message: err.message || "Server error while creating job",
    });
  }
};

// GET /api/jobs/recruiter  (recruiter only)
exports.getRecruiterJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const jobs = await Job.find({ recruiter: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(jobs);
  } catch (err) {
    console.error("Get recruiter jobs error:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching recruiter jobs" });
  }
};

// GET /api/jobs  (public list of open jobs)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching jobs" });
  }
};
