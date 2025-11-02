// === controllers/authController.js ===
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// === Koneksi Database ===
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "voxpro_hub",
});

// === LOGIN ===
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ success: false, message: "Kesalahan server" });
    }

    if (results.length === 0)
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      role: user.role,
      name: user.name,
    });
  });
};

// === REGISTER ===
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "Semua field wajib diisi" });

  const hashed = await bcrypt.hash(password, 10);

  db.query("SELECT email FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Kesalahan server" });
    if (results.length > 0)
      return res.status(409).json({ success: false, message: "Email sudah terdaftar" });

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      [name, email, hashed],
      (err) => {
        if (err) {
          console.error("Insert Error:", err);
          return res.status(500).json({ success: false, message: "Gagal mendaftar" });
        }
        res.json({ success: true, message: "Registrasi berhasil" });
      }
    );
  });
};
