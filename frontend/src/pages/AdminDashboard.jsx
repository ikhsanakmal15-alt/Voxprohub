import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image14 from "../assets/image14.png";
import {
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaPlus,
  FaCog,
  FaChartBar,
  FaClipboardList,
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/bookings";

  const [bookings, setBookings] = useState([]);
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

  // === Fetch Data ===
  const fetchBookings = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal mengambil data booking");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setBookings([]);
    }
  };

  useEffect(() => {
    if (activeTab === "booking") fetchBookings();
  }, [activeTab]);

  // === Input Change ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // === Create / Update ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.ruangan || !form.tanggal) {
      alert("Nama, Ruangan, dan Tanggal wajib diisi!");
      return;
    }

    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode ? `${API_URL}/${form.id}` : API_URL;

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert(editMode ? "✅ Data diperbarui!" : "✅ Data ditambahkan!");
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
    }
  };

  // === Delete ===
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchBookings();
    }
  };

  // === Edit ===
  const handleEdit = (data) => {
    setForm({
      ...data,
      tanggal: data.tanggal
        ? new Date(data.tanggal).toISOString().split("T")[0]
        : "",
    });
    setEditMode(true);
  };

  // === Logout ===
  const handleLogout = () => {
    localStorage.removeItem("role");
    alert("Anda telah logout dari Admin Dashboard");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen font-[Poppins] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* === SIDEBAR === */}
      <aside className="w-64 bg-gray-900/90 border-r border-gray-700 flex flex-col justify-between py-6 shadow-2xl">
        <div>
          <div className="flex flex-col items-center mb-8">
            <img
              src={image14}
              alt="Logo"
              className="w-14 h-14 mb-2 drop-shadow-md"
            />
            <h2 className="text-lg font-semibold text-gray-200">Admin Panel</h2>
          </div>
          <nav className="flex flex-col space-y-3 px-6">
            <button
              onClick={() => setActiveTab("booking")}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "booking"
                  ? "bg-gray-700 text-white shadow"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <FaClipboardList /> Kelola Booking
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "settings"
                  ? "bg-gray-700 text-white shadow"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <FaCog /> Pengaturan
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "reports"
                  ? "bg-gray-700 text-white shadow"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <FaChartBar /> Laporan
            </button>
          </nav>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 mx-auto shadow-md transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-8 bg-gray-100 text-gray-800 rounded-tl-3xl shadow-inner">
        {/* === NAVBAR === */}
        <nav className="flex justify-between items-center bg-white shadow-md rounded-xl px-6 py-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-700">
            {activeTab === "booking"
              ? "Kelola Booking"
              : activeTab === "settings"
              ? "Pengaturan"
              : "Laporan"}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow"
          >
            Kembali ke Landing Page
          </button>
        </nav>

        {/* === KONTEN BERDASARKAN TAB === */}
        {activeTab === "booking" && (
          <>
            {/* === FORM TAMBAH / EDIT === */}
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                <FaPlus className="text-gray-600" />
                {editMode ? "Edit Booking" : "Tambah Booking Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Nama Customer"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
                />
                <input
                  type="text"
                  name="telepon"
                  value={form.telepon}
                  onChange={handleChange}
                  placeholder="Nomor Telepon"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
                />
                <select
                  name="ruangan"
                  value={form.ruangan}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
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
                  value={
                    form.tanggal
                      ? new Date(form.tanggal).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
                />
                <input
                  type="text"
                  name="detail"
                  value={form.detail}
                  onChange={handleChange}
                  placeholder="Detail Pesanan"
                  className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
                />
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleChange}
                  placeholder="Catatan tambahan..."
                  rows="3"
                  className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
                ></textarea>
                <button
                  type="submit"
                  className="col-span-2 bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  {editMode ? "Update Data" : "Tambah Booking"}
                </button>
              </form>
            </div>

            {/* === TABEL DATA === */}
            <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Daftar Booking Customer
              </h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Belum ada data booking.
                </p>
              ) : (
                <table className="w-full border-collapse text-sm text-center">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="border p-2">No</th>
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Telepon</th>
                      <th className="border p-2">Ruangan</th>
                      <th className="border p-2">Tanggal</th>
                      <th className="border p-2">Detail</th>
                      <th className="border p-2">Catatan</th>
                      <th className="border p-2 w-32">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id} className="hover:bg-gray-100 transition">
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{b.nama}</td>
                        <td className="border p-2">{b.telepon}</td>
                        <td className="border p-2">{b.ruangan}</td>
                        <td className="border p-2">{b.tanggal}</td>
                        <td className="border p-2">{b.detail}</td>
                        <td className="border p-2">{b.catatan}</td>
                        <td className="border p-2 flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(b)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 flex items-center gap-1"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 flex items-center gap-1"
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

        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Pengaturan Admin
            </h2>
            <p className="text-gray-600 text-sm">
              Di sini Anda dapat mengelola informasi akun admin dan preferensi
              sistem.
            </p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Laporan Aktivitas
            </h2>
            <p className="text-gray-600 text-sm">
              Menampilkan ringkasan data booking dan statistik penggunaan.
            </p>
          </div>
        )}

        <footer className="text-center text-gray-500 text-xs mt-10">
          © 2025 VOXPRO HUB | Admin Panel - Manage Your Bookings
        </footer>
      </main>
    </div>
  );
}
