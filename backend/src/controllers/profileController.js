const Profile = require("../models/Profile");

// GET /api/profile/me
const getMyProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({ user: req.user._id });

    if (!existing) {
      // send empty default profile (not saved yet)
      return res.status(200).json({
        user: req.user._id,
        role: req.user.role,
        skills: [],
        experienceYears: 0,
        preferredLocations: [],
        bio: "",
        companyName: "",
        companyAddress: "",
        companyType: "",
        website: "",
        isNew: true,
      });
    }

    return res.status(200).json(existing);
  } catch (error) {
    console.error("Get my profile error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching profile" });
  }
};

// PUT /api/profile/me
const updateMyProfile = async (req, res) => {
  try {
    const {
      skills,
      experienceYears,
      preferredLocations,
      bio,
      companyName,
      companyAddress,
      companyType,
      website,
    } = req.body;

    const role = req.user.role;

    // normalize arrays (skills, preferredLocations) if sent as strings
    const normalizeArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        return val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    const update = {
      role,
      bio: bio || "",
    };

    if (role === "worker") {
      update.skills = normalizeArray(skills);
      update.experienceYears = Number(experienceYears || 0);
      update.preferredLocations = normalizeArray(preferredLocations);
      // clear recruiter fields if present
      update.companyName = "";
      update.companyAddress = "";
      update.companyType = "";
      update.website = "";
    } else if (role === "recruiter") {
      update.companyName = companyName || "";
      update.companyAddress = companyAddress || "";
      update.companyType = companyType || "";
      update.website = website || "";
      // clear worker fields
      update.skills = [];
      update.experienceYears = 0;
      update.preferredLocations = [];
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: update, user: req.user._id },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update my profile error:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating profile" });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
