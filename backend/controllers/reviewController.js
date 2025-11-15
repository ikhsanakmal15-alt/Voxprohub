import db from "../config/db.js";

// ✅ Ambil semua review
export const getAllReviews = (req, res) => {
    db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(result);
    });
};

// ✅ Tambah review baru
export const createReview = (req, res) => {
    const { name, role, rating, img, comment } = req.body;
    if (!name || !rating || !comment)
        return res.status(400).json({ message: "Data tidak lengkap" });

    const sql =
        "INSERT INTO reviews (name, role, rating, img, comment) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, role, rating, img, comment], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Review berhasil ditambahkan" });
    });
};

// ✅ Update review
export const updateReview = (req, res) => {
    const { id } = req.params;
    const { name, role, rating, img, comment } = req.body;
    const sql =
        "UPDATE reviews SET name=?, role=?, rating=?, img=?, comment=? WHERE id=?";
    db.query(sql, [name, role, rating, img, comment, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Review berhasil diperbarui" });
    });
};

// ✅ Hapus review
export const deleteReview = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM reviews WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Review berhasil dihapus" });
    });
};
