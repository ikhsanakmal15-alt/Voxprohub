import db from "../config/db.js";

// 🟢 Tambah booking baru (mendukung banyak tanggal sekaligus)
export const createBooking = (req, res) => {
  try {
    const { nama, telepon, ruangan, tanggal, jam_mulai, durasi, detail, catatan } = req.body;

    // Jika tanggal dikirim dalam array, simpan satu per satu
    const tanggalList = Array.isArray(tanggal) ? tanggal : [tanggal];

    const sql = `
      INSERT INTO bookings (nama, telepon, ruangan, tanggal, jam_mulai, durasi, detail, catatan, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    tanggalList.forEach((tgl) => {
      db.query(sql, [nama, telepon, ruangan, tgl, jam_mulai, durasi, detail, catatan], (err) => {
        if (err) console.error("❌ Gagal insert booking:", err);
      });
    });

    res.json({ success: true, message: "Booking berhasil ditambahkan!" });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ message: "Gagal membuat booking" });
  }
};

// 🟢 Ambil semua data booking
export const getBookings = (req, res) => {
  const sql = "SELECT * FROM bookings ORDER BY tanggal DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Gagal mengambil data booking:", err);
      return res.status(500).json({ message: "Gagal mengambil data booking" });
    }
    res.json(result);
  });
};

// 🟢 Update data booking (admin edit)
export const updateBooking = (req, res) => {
  const { id } = req.params;
  const { nama, telepon, ruangan, tanggal, jam_mulai, durasi, detail, catatan, status } = req.body;
  const sql = `
    UPDATE bookings 
    SET nama=?, telepon=?, ruangan=?, tanggal=?, jam_mulai=?, durasi=?, detail=?, catatan=?, status=?
    WHERE id=?
  `;
  db.query(
    sql,
    [nama, telepon, ruangan, tanggal, jam_mulai, durasi, detail, catatan, status, id],
    (err) => {
      if (err) {
        console.error("❌ Gagal memperbarui booking:", err);
        return res.status(500).json({ message: "Gagal memperbarui booking" });
      }
      res.json({ success: true, message: "Booking berhasil diperbarui" });
    }
  );
};

// 🟢 Hapus booking
export const deleteBooking = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM bookings WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("❌ Gagal menghapus booking:", err);
      return res.status(500).json({ message: "Gagal menghapus booking" });
    }
    res.json({ success: true, message: "Booking berhasil dihapus" });
  });
};
