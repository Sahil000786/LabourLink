// backend/src/app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Your routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/jobRoutes"); // if you have a separate file, change this
const chatRoutes = require("./routes/chatRoutes");

const app = express();

/**
 * CORS configuration
 * - Allows localhost:5173 (for development)
 * - Allows CLIENT_URL from environment (Vercel URL on Render)
 */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // e.g. https://labourlink-orpin.vercel.app on Render
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser requests (like curl / Postman – they have no origin)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Common middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Simple health check (you saw 404 before, this will return 200)
app.get("/", (req, res) => {
  res.send("LabourLink backend is running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
// if you have a separate applications route file, replace with: ./routes/applicationRoutes
// app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
