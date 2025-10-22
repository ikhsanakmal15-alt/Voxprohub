// === AdminDashboard.jsx ===
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image14 from "../assets/image14.png";
import {
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaPlus,
  FaCog,
  FaChartBar,
  FaClipboardList,
  FaUsers,
  FaSave,
  FaEye,
  FaImage,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // === API ENDPOINTS (tetap seperti aslinya + layanan) ===
  const API_URL_BOOKING = "http://localhost:5000/api/bookings";
  const API_URL_LANDING = "http://localhost:5000/api/landing";
  const API_URL_THEME = "http://localhost:5000/api/theme";
  const API_URL_USERS = "http://localhost:5000/api/users";
  const API_URL_LAYANAN = "http://localhost:5000/api/layanan";
  // endpoint untuk upload file (sesuaikan backend)
  const API_URL_LAYANAN_UPLOAD = "http://localhost:5000/api/layanan/upload";

  // === STATE (semua state asli + tambahan layanan/modal) ===
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    telepon: "",
    ruangan: "",
    tanggal: "",
    detail: "",
    catatan: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("booking");
  const [content, setContent] = useState([]);
  const [editing, setEditing] = useState(null);
  const [landingForm, setLandingForm] = useState({});
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [themeSettings, setThemeSettings] = useState({
    theme_color: "orange",
    theme_font: "Inter",
  });

  // === LAYANAN (services) related state ===
  const [layanan, setLayanan] = useState([]); // list layanan dari API
  const [formLayanan, setFormLayanan] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
  });
  const [editLayananMode, setEditLayananMode] = useState(false);

  // modal / preview state
  const [selectedImage, setSelectedImage] = useState(null); // object layanan yang dipilih untuk preview modal
  const [showEditLayananModal, setShowEditLayananModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // === PALET WARNA ===
  const colors = {
    dark: {
      bgMain: "bg-gray-900",
      textMain: "text-gray-100",
      sidebarBg: "bg-gray-800",
      sidebarText: "text-gray-200",
      cardBg: "bg-gray-800/80",
      cardBorder: "border-gray-700",
      hoverBg: "hover:bg-gray-700",
      tableHeader: "bg-gray-700 text-white",
      buttonPrimary: "bg-gray-500 hover:bg-gray-600",
      buttonDanger: "bg-red-600 hover:bg-red-700",
      buttonGradient: "bg-gradient-to-r from-orange-500 to-yellow-400",
    },
    light: {
      bgMain: "bg-gray-50",
      textMain: "text-gray-800",
      sidebarBg: "bg-white/80",
      sidebarText: "text-gray-800",
      cardBg: "bg-white/80",
      cardBorder: "border-gray-300",
      hoverBg: "hover:bg-gray-200",
      tableHeader: "bg-gray-200 text-gray-700",
      buttonPrimary: "bg-gray-400 hover:bg-gray-500",
      buttonDanger: "bg-red-500 hover:bg-red-600",
      buttonGradient: "bg-gradient-to-r from-orange-500 to-yellow-400",
    },
    orange: {
      bgMain: "bg-gradient-to-br from-orange-50 via-white to-yellow-50",
      textMain: "text-gray-800",
      sidebarBg: "bg-white/80",
      sidebarText: "text-gray-800",
      cardBg: "bg-white/80",
      cardBorder: "border-orange-100",
      hoverBg: "hover:bg-orange-100",
      tableHeader: "bg-orange-100 text-gray-700",
      buttonPrimary: "bg-gray-400 hover:bg-gray-500",
      buttonDanger: "bg-red-500 hover:bg-red-600",
      buttonGradient: "bg-gradient-to-r from-orange-500 to-yellow-400",
    },
  };

  const currentColor = colors[themeSettings.theme_color] || colors.orange;

  // === FETCH DATA ===
  useEffect(() => {
    if (activeTab === "booking") fetchBookings();
    if (activeTab === "landing") fetchLandingContent();
    if (activeTab === "settings") fetchThemeSettings();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "layanan") fetchLayanan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_URL_BOOKING);
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLandingContent = async () => {
    try {
      const res = await axios.get(API_URL_LANDING);
      setContent(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchThemeSettings = async () => {
    try {
      const res = await axios.get(API_URL_THEME);
      if (res.data) setThemeSettings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL_USERS);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // === FETCH LAYANAN ===
  const fetchLayanan = async () => {
    try {
      const res = await axios.get(API_URL_LAYANAN);
      setLayanan(res.data);
    } catch (error) {
      console.error("fetchLayanan:", error);
    }
  };

  // === DELETE USER ===
  const handleDeleteUser = async (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await axios.delete(`${API_URL_USERS}/${id}`);
        fetchUsers();
        alert("✅ User berhasil dihapus!");
      } catch (error) {
        console.error(error);
        alert("❌ Gagal menghapus user.");
      }
    }
  };

  const handleSaveTheme = async () => {
    try {
      await axios.put(API_URL_THEME, themeSettings);
      alert("✅ Tema berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menyimpan tema.");
    }
  };

  // === BOOKING HANDLER ===
  const handleChangeBooking = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.ruangan || !form.tanggal) {
      alert("Nama, Ruangan, dan Tanggal wajib diisi!");
      return;
    }
    try {
      if (editMode) {
        await axios.put(`${API_URL_BOOKING}/${form.id}`, form);
        alert("✅ Data booking diperbarui!");
      } else {
        await axios.post(API_URL_BOOKING, form);
        alert("✅ Data booking ditambahkan!");
      }
      setForm({
        id: null,
        nama: "",
        telepon: "",
        ruangan: "",
        tanggal: "",
        detail: "",
        catatan: "",
      });
      setEditMode(false);
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menyimpan data.");
    }
  };

  const handleEditBooking = (b) => {
    setForm({
      ...b,
      tanggal: b.tanggal ? new Date(b.tanggal).toISOString().split("T")[0] : "",
    });
    setEditMode(true);
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      await axios.delete(`${API_URL_BOOKING}/${id}`);
      fetchBookings();
    }
  };

  // === LANDING HANDLER ===
  const handleEditLanding = (section) => {
    setEditing(section.section);
    setLandingForm(section);
  };

  const handleSaveLanding = async () => {
    try {
      await axios.put(`${API_URL_LANDING}/${editing}`, landingForm);
      alert("✅ Konten berhasil diperbarui!");
      setEditing(null);
      fetchLandingContent();
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menyimpan konten.");
    }
  };

  // === LOGOUT ===
  const handleLogout = () => {
    localStorage.removeItem("role");
    alert("Anda telah logout dari Admin Dashboard");
    navigate("/login");
  };

  // === LAYANAN (CRUD) HANDLERS ===
  const handleChangeLayanan = (e) => {
    const { name, value } = e.target;
    setFormLayanan({ ...formLayanan, [name]: value });
  };

  const handleSubmitLayanan = async (e) => {
    e.preventDefault();
    if (!formLayanan.title || !formLayanan.description) {
      alert("Judul dan deskripsi wajib diisi!");
      return;
    }
    try {
      if (editLayananMode && formLayanan.id) {
        await axios.put(`${API_URL_LAYANAN}/${formLayanan.id}`, formLayanan);
        alert("✅ Layanan berhasil diperbarui!");
      } else {
        await axios.post(API_URL_LAYANAN, formLayanan);
        alert("✅ Layanan berhasil ditambahkan!");
      }
      setFormLayanan({ id: null, title: "", description: "", image: "" });
      setEditLayananMode(false);
      fetchLayanan();
    } catch (error) {
      console.error("handleSubmitLayanan:", error);
      alert("❌ Gagal menyimpan layanan.");
    }
  };

  const handleEditLayanan = (item) => {
    setFormLayanan(item);
    setEditLayananMode(true);
    setShowEditLayananModal(true);
  };

  const handleDeleteLayanan = async (id) => {
    if (window.confirm("Yakin ingin menghapus layanan ini?")) {
      try {
        await axios.delete(`${API_URL_LAYANAN}/${id}`);
        fetchLayanan();
        alert("✅ Layanan dihapus!");
      } catch (error) {
        console.error("handleDeleteLayanan:", error);
      }
    }
  };

  // Upload gambar layanan (file)
  const handleUploadImageFile = async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(API_URL_LAYANAN_UPLOAD, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // backend diharapkan mengembalikan { imageUrl: "..." } atau directly image path
      setUploading(false);
      return res.data.imageUrl || res.data.url || res.data.path || null;
    } catch (error) {
      console.error("handleUploadImageFile:", error);
      setUploading(false);
      alert("❌ Gagal upload gambar. Cek backend upload endpoint.");
      return null;
    }
  };

  // Handle file input change in edit modal
  const handleFileChangeForLayanan = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const uploadedUrl = await handleUploadImageFile(file);
    if (uploadedUrl) {
      setFormLayanan({ ...formLayanan, image: uploadedUrl });
    }
  };

  // === Modal open for image preview (landing or layanan) ===
  const openImagePreview = (item) => {
    setSelectedImage(item);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  // === RENDER ===
  return (
    <div
      className={`flex min-h-screen font-[${themeSettings.theme_font}] transition-all duration-500 ${currentColor.bgMain} ${currentColor.textMain}`}
    >
      {/* === SIDEBAR === */}
      <aside
        className={`w-64 ${currentColor.sidebarBg} ${currentColor.sidebarText} backdrop-blur-md border-r ${currentColor.cardBorder} flex flex-col justify-between py-6 shadow-lg`}
      >
        <div>
          <div className="flex flex-col items-center mb-8">
            <img src={image14} alt="Logo" className="w-12 h-12 mb-2" />
            <h2 className="text-lg font-semibold text-orange-600">Admin Panel</h2>
          </div>

          <nav className="flex flex-col space-y-3 px-4">
            {[
              { id: "booking", icon: <FaClipboardList />, label: "Kelola Booking" },
              { id: "users", icon: <FaUsers />, label: "Kelola User" },
              { id: "layanan", icon: <FaImage />, label: "Kelola Layanan" },
              { id: "landing", icon: <FaChartBar />, label: "Landing Page" },
              { id: "settings", icon: <FaCog />, label: "Pengaturan Tema" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md"
                    : currentColor.hoverBg
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className={`${currentColor.buttonDanger} text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 mx-auto transition duration-300 hover:shadow-lg`}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* === HEADER === */}
        <nav
          className={`flex justify-between items-center ${currentColor.cardBg} backdrop-blur-md border ${currentColor.cardBorder} shadow-md rounded-xl px-6 py-4 mb-8`}
        >
          <h1 className="text-xl md:text-2xl font-semibold capitalize">
            {activeTab === "booking"
              ? "📋 Kelola Booking"
              : activeTab === "users"
              ? "👥 Kelola User"
              : activeTab === "layanan"
              ? "🧰 Kelola Layanan"
              : activeTab === "landing"
              ? "📈 Kelola Landing Page"
              : "⚙️ Pengaturan Tema"}
          </h1>

          <button
            onClick={() => navigate("/")}
            className={`${currentColor.buttonGradient} text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition-all`}
          >
            Kembali ke Landing Page
          </button>
        </nav>

        {/* === TAB USERS === */}
        {activeTab === "users" && (
          <div
            className={`${currentColor.cardBg} p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder} overflow-x-auto`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-orange-500" /> Kelola User Terdaftar
            </h2>

            {/* === FORM TAMBAH USER === */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newUser.name || !newUser.email || !newUser.password) {
                  alert("Nama, email, dan password wajib diisi!");
                  return;
                }
                try {
                  await axios.post(API_URL_USERS, newUser);
                  alert("✅ User berhasil ditambahkan!");
                  setNewUser({ name: "", email: "", password: "", role: "user" });
                  fetchUsers();
                } catch (error) {
                  console.error(error);
                  alert("❌ Gagal menambahkan user.");
                }
              }}
              className="mb-6 grid md:grid-cols-4 gap-3 items-end"
            >
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className={`${currentColor.buttonGradient} text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition`}
              >
                <FaPlus /> Tambah User
              </button>
            </form>

            {/* === TABEL USER === */}
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Belum ada user yang terdaftar.
              </p>
            ) : (
              <table className="w-full border-collapse text-sm text-center">
                <thead>
                  <tr className={`${currentColor.tableHeader}`}>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Tanggal Dibuat</th>
                    <th className="border p-2 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{u.name}</td>
                      <td className="border p-2">{u.email}</td>
                      <td className="border p-2 capitalize">{u.role}</td>
                      <td className="border p-2">
                        {new Date(u.created_at).toLocaleString()}
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className={`${currentColor.buttonDanger} text-white px-2 py-1 rounded text-xs flex items-center gap-1 mx-auto`}
                        >
                          <FaTrash /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* === TAB LAYANAN (baru terintegrasi) === */}
        {activeTab === "layanan" && (
          <div className={`${currentColor.cardBg} p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaImage className="text-orange-500" /> Kelola Layanan
            </h2>

            {/* Form Layanan (URL atau upload) */}
            <form onSubmit={handleSubmitLayanan} className="grid md:grid-cols-3 gap-3 mb-6">
              <input
                type="text"
                name="title"
                value={formLayanan.title}
                onChange={handleChangeLayanan}
                placeholder="Judul layanan"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="description"
                value={formLayanan.description}
                onChange={handleChangeLayanan}
                placeholder="Deskripsi"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="image"
                value={formLayanan.image}
                onChange={handleChangeLayanan}
                placeholder="URL Gambar (atau kosong jika upload file)"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />

              {/* file upload */}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  const uploadedUrl = await handleUploadImageFile(file);
                  if (uploadedUrl) setFormLayanan((prev) => ({ ...prev, image: uploadedUrl }));
                }}
                className="col-span-3"
              />

              <button
                type="submit"
                className={`${currentColor.buttonGradient} text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition col-span-3`}
              >
                {editLayananMode ? "Simpan Perubahan" : "Tambah Layanan"}
              </button>
            </form>

            {/* Grid Layanan */}
            {layanan.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada data layanan.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {layanan.map((l, i) => (
                  <div key={l.id} className={`p-4 border ${currentColor.cardBorder} ${currentColor.cardBg} rounded-xl shadow-md`}>
                    <img
                      src={l.image || "https://via.placeholder.com/300"}
                      alt={l.title}
                      className="w-full h-40 object-cover rounded mb-3 cursor-pointer"
                      onClick={() => openImagePreview(l)}
                    />
                    <h3 className="font-semibold text-lg">{l.title}</h3>
                    <p className="text-sm mb-3">{l.description}</p>
                    <div className="flex justify-between">
                      <button onClick={() => handleEditLayanan(l)} className={`${currentColor.buttonPrimary} text-white px-3 py-1 rounded text-xs flex items-center gap-1`}>
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteLayanan(l.id)} className={`${currentColor.buttonDanger} text-white px-3 py-1 rounded text-xs flex items-center gap-1`}>
                        <FaTrash /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === TAB SETTINGS === */}
        {activeTab === "settings" && (
          <div
            className={`${currentColor.cardBg} p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder} max-w-lg mx-auto`}
          >
            <h2 className="text-lg font-semibold mb-4">🎨 Pengaturan Tema</h2>
            <label className="block mb-3 font-medium">Pilih Warna Tema</label>
            <select
              value={themeSettings.theme_color}
              onChange={(e) =>
                setThemeSettings({ ...themeSettings, theme_color: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            >
              <option value="orange">🟠 Orange (Default)</option>
              <option value="light">🌤️ Terang</option>
              <option value="dark">🌙 Gelap</option>
            </select>

            <label className="block mb-3 font-medium">Pilih Font</label>
            <select
              value={themeSettings.theme_font}
              onChange={(e) =>
                setThemeSettings({ ...themeSettings, theme_font: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
            </select>

            <button
              onClick={handleSaveTheme}
              className={`${currentColor.buttonGradient} text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition`}
            >
              <FaSave /> Simpan Pengaturan
            </button>
          </div>
        )}

        {/* === TAB BOOKING === */}
        {activeTab === "booking" && (
          <>
            {/* === FORM === */}
            <div
              className={`${currentColor.cardBg} backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-10 border ${currentColor.cardBorder}`}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaPlus className="text-orange-500" />
                {editMode ? "Edit Booking" : "Tambah Booking"}
              </h2>
              <form
                onSubmit={handleSubmitBooking}
                className="grid md:grid-cols-2 gap-4"
              >
                {["nama", "telepon", "detail"].map((f) => (
                  <input
                    key={f}
                    type="text"
                    name={f}
                    value={form[f]}
                    onChange={handleChangeBooking}
                    placeholder={
                      f === "nama"
                        ? "Nama Customer"
                        : f === "telepon"
                        ? "Nomor Telepon"
                        : "Detail Pesanan"
                    }
                    className="border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-3 py-2 transition"
                  />
                ))}
                <select
                  name="ruangan"
                  value={form.ruangan}
                  onChange={handleChangeBooking}
                  className="border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-3 py-2"
                >
                  <option value="">Pilih Ruangan</option>
                  <option value="Ruang Podcast">Ruang Podcast</option>
                  <option value="Ruang Meeting">Ruang Meeting</option>
                  <option value="Ruang Kerja">Ruang Kerja</option>
                  <option value="Studio">Studio</option>
                </select>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChangeBooking}
                  className="border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-3 py-2"
                />
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleChangeBooking}
                  placeholder="Catatan tambahan..."
                  rows="3"
                  className="md:col-span-2 border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-3 py-2"
                ></textarea>
                <button
                  type="submit"
                  className={`${currentColor.buttonPrimary} text-white py-2 rounded-lg hover:shadow-lg transition col-span-2`}
                >
                  {editMode ? "Update Data" : "Tambah Booking"}
                </button>
              </form>
            </div>

            {/* === TABEL === */}
            <div
              className={`${currentColor.cardBg} backdrop-blur-sm border ${currentColor.cardBorder} shadow-xl rounded-2xl p-6 overflow-x-auto`}
            >
              <h2 className="text-lg font-semibold mb-4">
                Daftar Booking Customer
              </h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Belum ada data booking.
                </p>
              ) : (
                <table className="w-full border-collapse text-sm text-center">
                  <thead>
                    <tr className={`${currentColor.tableHeader}`}>
                      <th className="border p-2">No</th>
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Telepon</th>
                      <th className="border p-2">Ruangan</th>
                      <th className="border p-2">Tanggal</th>
                      <th className="border p-2">Jam</th>
                      <th className="border p-2">Durasi</th>
                      <th className="border p-2">Detail</th>
                      <th className="border p-2">Catatan</th>
                      <th className="border p-2 w-32">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id}>
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{b.nama}</td>
                        <td className="border p-2">{b.telepon}</td>
                        <td className="border p-2">{b.ruangan}</td>
                        <td className="border p-2">{b.tanggal}</td>
                        <td className="border p-2">{b.jam_mulai}</td>
                        <td className="border p-2">{b.durasi} jam</td>
                        <td className="border p-2">{b.detail}</td>
                        <td className="border p-2">{b.catatan}</td>
                        <td className="border p-2 flex justify-center gap-2">
                          <button
                            onClick={() => handleEditBooking(b)}
                            className={`${currentColor.buttonPrimary} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className={`${currentColor.buttonDanger} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}
                          >
                            <FaTrash /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* === TAB LANDING PAGE === */}
        {activeTab === "landing" && (
          <div>
            <table className="w-full text-left border-collapse border border-orange-100 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-orange-50">
                <tr>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Subtitle</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {content.map((c) => (
                  <tr key={c.id}>
                    <td className="border p-2">{c.section}</td>
                    <td className="border p-2">{c.title}</td>
                    <td className="border p-2">{c.subtitle}</td>
                    <td className="border p-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditLanding(c)}
                          className="bg-orange-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-orange-600"
                        >
                          <FaEdit /> Edit
                        </button>

                        {/* Jika ada gambar di konten landing, tombol lihat gambar */}
                        {c.image && (
                          <button
                            onClick={() => openImagePreview(c)}
                            className="bg-white border px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-orange-50"
                          >
                            <FaEye /> Lihat Gambar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editing && (
              <div className="mt-6 bg-orange-50 p-4 rounded-xl shadow-inner">
                <h3 className="font-semibold mb-2 capitalize">Edit {editing}</h3>
                <input
                  type="text"
                  value={landingForm.title || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full mb-2 p-2 border border-orange-200 rounded-lg"
                />
                <textarea
                  value={landingForm.subtitle || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, subtitle: e.target.value })
                  }
                  placeholder="Subtitle"
                  className="w-full mb-2 p-2 border border-orange-200 rounded-lg"
                  rows="3"
                />
                <input
                  type="text"
                  value={landingForm.image || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, image: e.target.value })
                  }
                  placeholder="URL Gambar"
                  className="w-full mb-2 p-2 border border-orange-200 rounded-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const uploadedUrl = await handleUploadImageFile(file);
                    if (uploadedUrl) setLandingForm({ ...landingForm, image: uploadedUrl });
                  }}
                  className="w-full mb-2"
                />
                <input
                  type="text"
                  value={landingForm.button_text || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, button_text: e.target.value })
                  }
                  placeholder="Teks Tombol"
                  className="w-full mb-2 p-2 border border-orange-200 rounded-lg"
                />
                <input
                  type="text"
                  value={landingForm.button_link || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, button_link: e.target.value })
                  }
                  placeholder="Link Tombol"
                  className="w-full mb-4 p-2 border border-orange-200 rounded-lg"
                />
                <button
                  onClick={handleSaveLanding}
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
                >
                  <FaSave /> Simpan Konten
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* === MODAL PREVIEW IMAGE (FRAMER MOTION) === */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImagePreview}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{selectedImage.title || selectedImage.name || selectedImage.section}</h3>
                <button onClick={closeImagePreview} className="text-gray-500 hover:text-gray-800">Tutup</button>
              </div>
              <div className="mt-4">
                <img
                  src={selectedImage.image || selectedImage.image_url || selectedImage.imageUrl || "https://via.placeholder.com/800x400"}
                  alt={selectedImage.title || selectedImage.name || "Preview"}
                  className="w-full object-contain rounded-lg"
                />
                {selectedImage.description && <p className="mt-3 text-gray-600">{selectedImage.description}</p>}
                {selectedImage.subtitle && <p className="mt-3 text-gray-600">{selectedImage.subtitle}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
