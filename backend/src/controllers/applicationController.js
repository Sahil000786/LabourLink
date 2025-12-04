// backend/src/controllers/applicationController.js
const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications  (worker applies to a job)
exports.applyToJob = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "worker") {
      return res.status(403).json({ message: "Only workers can apply to jobs." });
    }

    const { jobId, message } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    if (job.status !== "open") {
      return res.status(400).json({ message: "This job is not open for applications." });
    }

    // Prevent duplicate applications from same worker to same job
    const existing = await Application.findOne({
      worker: user.id,
      job: jobId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job." });
    }

    const application = await Application.create({
      worker: user.id,
      recruiter: job.recruiter,
      job: jobId,
      message: message || "",
    });

    return res.status(201).json(application);
  } catch (err) {
    console.error("applyToJob error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error while applying to job" });
  }
};

// GET /api/applications/worker  (current worker's applications)
exports.getWorkerApplications = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "worker") {
      return res.status(403).json({ message: "Only workers can view this." });
    }

    const apps = await Application.find({ worker: user.id })
      .populate("job")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(apps);
  } catch (err) {
    console.error("getWorkerApplications error:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching worker applications" });
  }
};

// GET /api/applications/recruiter  (applications to recruiter's jobs)
exports.getRecruiterApplications = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can view this." });
    }

    const apps = await Application.find({ recruiter: user.id })
      .populate("job")
      .populate("worker")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(apps);
  } catch (err) {
    console.error("getRecruiterApplications error:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching recruiter applications" });
  }
};

// PATCH /api/applications/:id/status   (recruiter updates status)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can update status." });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["applied", "shortlisted", "hired", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const app = await Application.findById(id);
    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (String(app.recruiter) !== String(user.id)) {
      return res.status(403).json({ message: "Not allowed for this application." });
    }

    app.status = status;
    await app.save();

    return res.status(200).json(app);
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    return res
      .status(500)
      .json({ message: "Server error while updating application status" });
  }
};

// POST /api/applications/:id/feedback  (recruiter rates worker)
exports.addApplicationFeedback = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can give feedback." });
    }

    const { id } = req.params;
    const { rating, feedback } = req.body;

    const app = await Application.findById(id);
    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (String(app.recruiter) !== String(user.id)) {
      return res.status(403).json({ message: "Not allowed for this application." });
    }
    if (app.status !== "hired") {
      return res
        .status(400)
        .json({ message: "You can only rate workers who are hired." });
    }

    const ratingNumber = Number(rating);
    if (Number.isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    app.rating = ratingNumber;
    app.feedback = feedback || "";
    await app.save();

    return res.status(200).json(app);
  } catch (err) {
    console.error("addApplicationFeedback error:", err);
    return res
      .status(500)
      .json({ message: "Server error while saving feedback" });
  }
};
