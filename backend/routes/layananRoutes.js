import express from "express";
import multer from "multer";
import {
  getAllLayanan,
  getLayananById,
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from "../controllers/layananController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
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
