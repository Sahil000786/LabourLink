// backend/src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// ************ CORS CONFIG ************
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4173";

const corsOptions = {
  origin: FRONTEND_URL,          // ✅ DO NOT use '*'
  credentials: true,             // allow cookies / auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// handle preflight for all routes
app.options("*", cors(corsOptions));
// **************************************

// basic middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// simple health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "LabourLink backend is running",
    time: new Date().toISOString(),
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);

// global error handler (so 500s show message)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
