import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ Get semua data booking
router.get("/", (req, res) => {
  const sql = "SELECT * FROM bookings";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data" });
    }
    res.json(result);
  });
});

// ✅ Tambah booking baru
router.post("/", (req, res) => {
  const { nama, telepon, ruangan, tanggal, detail, catatan } = req.body;
  const sql =
    "INSERT INTO bookings (nama, telepon, ruangan, tanggal, detail, catatan) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [nama, telepon, ruangan, tanggal, detail, catatan], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menambah booking" });
    }
    res.json({ success: true, message: "Booking berhasil ditambahkan" });
  });
});

// ✅ Update data booking
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nama, telepon, ruangan, tanggal, detail, catatan } = req.body;
  const sql =
    "UPDATE bookings SET nama=?, telepon=?, ruangan=?, tanggal=?, detail=?, catatan=? WHERE id=?";
  db.query(
    sql,
    [nama, telepon, ruangan, tanggal, detail, catatan, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal memperbarui booking" });
      }
      res.json({ success: true, message: "Booking berhasil diperbarui" });
    }
  );
});

// ✅ Hapus booking
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM bookings WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menghapus booking" });
    }
    res.json({ success: true, message: "Booking berhasil dihapus" });
  });
});

export default router;
