import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// import route
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import landingRoutes from "./routes/landingRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import layananRoutes from "./routes/layananRoutes.js"; // ✅

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pastikan folder uploads ada
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static folder uploads
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/landing", landingRoutes);
app.use("/api/theme", themeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/layanan", layananRoutes);

// Root endpoint
app.get("/", (req, res) => res.send("Backend VoxProHub aktif ✅"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
