import db from "../config/db.js";

// Ambil semua layanan
export const getAllLayanan = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM layanan ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data layanan", error: err });
  }
};

// Ambil layanan berdasarkan ID
export const getLayananById = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM layanan WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Layanan tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil layanan", error: err });
  }
};

// Tambah layanan baru
export const createLayanan = async (req, res) => {
  try {
    const { title, description } = req.body; // sesuaikan dengan kolom tabel
    const image = req.file ? req.file.filename : null;

    await db.promise().query(
      "INSERT INTO layanan (title, description, image) VALUES (?, ?, ?)",
      [title, description, image]
    );

    res.json({ message: "Layanan berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah layanan", error: err });
  }
};

// Update layanan
export const updateLayanan = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : req.body.image;

    await db.promise().query(
      "UPDATE layanan SET title=?, description=?, image=? WHERE id=?",
      [title, description, image, req.params.id]
    );

    res.json({ message: "Layanan berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui layanan", error: err });
  }
};

// Hapus layanan
export const deleteLayanan = async (req, res) => {
  try {
    await db.promise().query("DELETE FROM layanan WHERE id=?", [req.params.id]);
    res.json({ message: "Layanan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus layanan", error: err });
  }
};
