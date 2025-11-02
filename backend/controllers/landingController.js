import db from "../config/db.js";

// ✅ Ambil semua konten
export const getAllLandingContent = (req, res) => {
  db.query("SELECT * FROM landing_content", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
};

// ✅ Ambil 1 section (misalnya hero, visi, fasilitas)
export const getLandingSection = (req, res) => {
  const { section } = req.params;
  db.query("SELECT * FROM landing_content WHERE section = ?", [section], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(404).json({ message: "Section not found" });
    res.json(result[0]);
  });
};

// ✅ Update konten section
export const updateLandingSection = (req, res) => {
  const { section } = req.params;
  const { title, subtitle, image, button_text, button_link, font } = req.body;

  const sql = `
    UPDATE landing_content 
    SET title=?, subtitle=?, image=?, button_text=?, button_link=?, font=?
    WHERE section=?`;

  db.query(sql, [title, subtitle, image, button_text, button_link, font, section], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Section updated successfully" });
  });
};
//