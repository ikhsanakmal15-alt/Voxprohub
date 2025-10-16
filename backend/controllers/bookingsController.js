import db from "../config/db.js";

export const createBooking = (req, res) => {
  const { date, time } = req.body;
  const userId = req.user.id;

  const sql = "INSERT INTO bookings (user_id, date, time, status) VALUES (?, ?, ?, 'pending')";
  db.query(sql, [userId, date, time], (err) => {
    if (err) return res.status(500).json({ message: "Gagal membuat booking" });
    res.json({ message: "Booking berhasil dibuat!" });
  });
};

export const getBookings = (req, res) => {
  const sql = "SELECT * FROM bookings";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data booking" });
    res.json(result);
  });
};
