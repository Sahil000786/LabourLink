// backend/src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// ---------- Middlewares ----------
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ✅ Allowed frontend URLs (local + Vercel)
const allowedOrigins = [
  "http://localhost:5173",                // Vite dev
  "http://localhost:4173",                // Vite preview (you used this before)
  "https://labourlink-orpin.vercel.app",  // LIVE frontend on Vercel
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / curl / Postman (no origin) and our allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);

// Simple health route (helpful to test Render)
app.get("/", (req, res) => {
  res.send("LabourLink backend API is running");
});

module.exports = app;
