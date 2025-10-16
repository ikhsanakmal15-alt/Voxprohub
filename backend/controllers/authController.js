import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ REGISTER
export const register = (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "Semua kolom wajib diisi!" });

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Kesalahan server" });
    if (result.length > 0)
      return res.status(400).json({ success: false, message: "Email sudah terdaftar!" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [name, email, hashedPassword, role], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Gagal registrasi!" });
      res.status(201).json({ success: true, message: "Registrasi berhasil!" });
    });
  });
};

// ✅ LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi!" });

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Kesalahan server" });
    if (result.length === 0)
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan!" });

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Password salah!" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil!",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });
};
