// backend/src/models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // wage per day / month
    wage: {
      type: Number,
      required: true,
      min: 0,
    },

    // keep these as simple strings so they never break validation
    jobType: {
      type: String, // e.g. daily, monthly, contract
      default: "daily",
    },

    experienceLevel: {
      type: String, // e.g. fresher, 1-3 years, 3+ years
      default: "fresher",
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
