import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"; // ✅ tambahkan ini
import landingRoutes from "./routes/landingRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Route API
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes); // ✅ route baru
app.use("/api/landing", landingRoutes);

app.get("/", (req, res) => res.send("Backend VoxproHub aktif ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
