import db from "../config/db.js";

// ✅ GET THEME SETTINGS
export const getTheme = (req, res) => {
  const query = "SELECT * FROM theme_settings ORDER BY id DESC LIMIT 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("❌ Gagal mengambil data tema:", err);
      return res.status(500).json({ error: "Gagal mengambil data tema" });
    }
    res.json(result[0] || { theme_color: "light", theme_font: "Inter" });
  });
};

// ✅ UPDATE THEME SETTINGS
export const updateTheme = (req, res) => {
  const { theme_color, theme_font } = req.body;
  if (!theme_color || !theme_font) {
    return res.status(400).json({ error: "Kolom tidak boleh kosong" });
  }

  const query = `
    UPDATE theme_settings 
    SET theme_color = ?, theme_font = ?, updated_at = NOW()
    WHERE id = 1
  `;
  db.query(query, [theme_color, theme_font], (err) => {
    if (err) {
      console.error("❌ Gagal memperbarui tema:", err);
      return res.status(500).json({ error: "Gagal memperbarui tema" });
    }
    res.json({ success: true, message: "🎨 Tema berhasil diperbarui!" });
  });
};
