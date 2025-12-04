const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["worker", "recruiter"],
      required: true,
    },

    // Worker fields
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    preferredLocations: {
      type: [String],
      default: [],
    },

    // Common
    bio: {
      type: String,
      default: "",
    },

    // Recruiter fields
    companyName: {
      type: String,
      default: "",
    },
    companyAddress: {
      type: String,
      default: "",
    },
    companyType: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
