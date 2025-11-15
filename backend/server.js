import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// === Import semua routes ===
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import landingRoutes from "./routes/landingRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import layananRoutes from "./routes/layananRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
const app = express();

// === FIX __dirname untuk ES Module ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Middleware umum ===
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// === Pastikan folder uploads ada ===
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 Folder 'uploads' dibuat secara otomatis.");
}

// === Serve folder uploads secara publik ===
// 🔥 INI BAGIAN PALING PENTING SUPAYA GAMBAR MUNCUL
app.use("/uploads", express.static(uploadDir));

// === Routes utama ===
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/landing", landingRoutes);
app.use("/api/theme", themeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/layanan", layananRoutes);
app.use("/api/reviews", reviewRoutes);

// === Root endpoint ===
app.get("/", (req, res) => res.send("✅ Backend VoxProHub aktif dan berjalan!"));

// === Jalankan server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`)
);
