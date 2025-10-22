import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// import route lainnya
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import landingRoutes from "./routes/landingRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import layananRoutes from "./routes/layananRoutes.js"; // ✅ tambahkan ini

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // ✅ folder upload

// === GUNAKAN SEMUA ROUTE ===
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/landing", landingRoutes);
app.use("/api/theme", themeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/layanan", layananRoutes);

app.get("/", (req, res) => res.send("Backend VoxProHub aktif ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
