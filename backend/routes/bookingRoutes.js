import express from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingsController.js";

const router = express.Router();

// 🟢 Ambil semua data booking
router.get("/", getBookings);

// 🟢 Tambah booking baru
router.post("/", createBooking);

// 🟢 Update booking (admin edit)
router.put("/:id", updateBooking);

// 🟢 Hapus booking
router.delete("/:id", deleteBooking);

export default router;
