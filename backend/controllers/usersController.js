import db from "../config/db.js";

// === GET semua user ===
export const getAllUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
    (error, results) => {
      if (error) {
        console.error("❌ Gagal mengambil data user:", error);
        return res.status(500).json({
          message: "Gagal mengambil data user",
          error: error?.message || error,
        });
      }
      console.log("✅ Data user berhasil diambil:", results);
      res.status(200).json(results);
    }
  );
};

// === DELETE user berdasarkan ID ===
export const deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (error, result) => {
    if (error) {
      console.error("❌ Gagal menghapus user:", error);
      return res.status(500).json({
        message: "Gagal menghapus user",
        error: error?.message || error,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    console.log(`✅ User dengan ID ${id} berhasil dihapus`);
    res.status(200).json({ message: "User berhasil dihapus" });
  });
};
