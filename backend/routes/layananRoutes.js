import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import {
  getAllLayanan,
  getLayananById,
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from "../controllers/layananController.js";

const router = express.Router();

// Pastikan folder uploads ada
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getAllLayanan);
router.get("/:id", getLayananById);
router.post("/", upload.single("image"), createLayanan);
router.put("/:id", upload.single("image"), updateLayanan);
router.delete("/:id", deleteLayanan);

export default router;
