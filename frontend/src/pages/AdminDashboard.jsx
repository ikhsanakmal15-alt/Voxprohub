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
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const API_URL_BOOKING = "http://localhost:5000/api/bookings";
  const API_URL_LANDING = "http://localhost:5000/api/landing";

  // === STATE ===
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

  // Landing page content
  const [content, setContent] = useState([]);
  const [editing, setEditing] = useState(null);
  const [landingForm, setLandingForm] = useState({});

  // === FETCH DATA ===
  useEffect(() => {
    if (activeTab === "booking") fetchBookings();
    if (activeTab === "reports") fetchLandingContent();
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

  // === HANDLE BOOKING ===
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

  // === HANDLE LANDING CONTENT ===
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

  return (
    <div className="flex min-h-screen font-[Inter] bg-gray-100 text-gray-800">
      {/* === SIDEBAR === */}
      <aside className="w-64 bg-gray-200 border-r border-gray-300 flex flex-col justify-between py-6 shadow-md">
        <div>
          <div className="flex flex-col items-center mb-8">
            <img
              src={image14}
              alt="Logo"
              className="w-12 h-12 mb-2 drop-shadow-md"
            />
            <h2 className="text-lg font-semibold text-gray-700">Admin Panel</h2>
          </div>
          <nav className="flex flex-col space-y-3 px-4">
            <button
              onClick={() => setActiveTab("booking")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === "booking"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-300 text-gray-700"
              }`}
            >
              <FaClipboardList /> Kelola Booking
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === "settings"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-300 text-gray-700"
              }`}
            >
              <FaCog /> Pengaturan
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === "reports"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-300 text-gray-700"
              }`}
            >
              <FaChartBar /> Landing Page
            </button>
          </nav>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md font-medium flex items-center gap-1 mx-auto transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-8">
        <nav className="flex justify-between items-center bg-white shadow-sm rounded-lg px-4 py-3 mb-6">
          <h1 className="text-xl font-semibold text-gray-700">
            {activeTab === "booking"
              ? "Kelola Booking"
              : activeTab === "reports"
              ? "Kelola Landing Page"
              : "Pengaturan"}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition"
          >
            Kembali ke Landing Page
          </button>
        </nav>

        {/* === BOOKING SECTION === */}
        {activeTab === "booking" && (
          <>
            {/* Form Booking */}
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaPlus /> {editMode ? "Edit Booking" : "Tambah Booking"}
              </h2>
              <form
                onSubmit={handleSubmitBooking}
                className="grid md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChangeBooking}
                  placeholder="Nama Customer"
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  name="telepon"
                  value={form.telepon}
                  onChange={handleChangeBooking}
                  placeholder="Nomor Telepon"
                  className="border rounded-lg px-3 py-2"
                />
                <select
                  name="ruangan"
                  value={form.ruangan}
                  onChange={handleChangeBooking}
                  className="border rounded-lg px-3 py-2"
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
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  name="detail"
                  value={form.detail}
                  onChange={handleChangeBooking}
                  placeholder="Detail Pesanan"
                  className="md:col-span-2 border rounded-lg px-3 py-2"
                />
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleChangeBooking}
                  placeholder="Catatan tambahan..."
                  rows="3"
                  className="md:col-span-2 border rounded-lg px-3 py-2"
                ></textarea>
                <button
                  type="submit"
                  className="col-span-2 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  {editMode ? "Update Data" : "Tambah Booking"}
                </button>
              </form>
            </div>

            {/* Table Booking */}
            <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
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
                      <tr key={b.id} className="hover:bg-gray-100">
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{b.nama}</td>
                        <td className="border p-2">{b.telepon}</td>
                        <td className="border p-2">{b.ruangan}</td>
                        <td className="border p-2">{b.tanggal}</td>
                        <td className="border p-2">{b.detail}</td>
                        <td className="border p-2">{b.catatan}</td>
                        <td className="border p-2 flex justify-center gap-2">
                          <button
                            onClick={() => handleEditBooking(b)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex items-center gap-1"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 flex items-center gap-1"
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

        {/* === LANDING CONTENT === */}
        {activeTab === "reports" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Kelola Konten Landing Page
            </h2>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Subtitle</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">{item.section}</td>
                    <td className="p-2 border">{item.title}</td>
                    <td className="p-2 border">
                      {item.subtitle?.slice(0, 50)}...
                    </td>
                    <td className="p-2 border">
                      <button
                        className="bg-orange-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEditLanding(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editing && (
              <div className="mt-6 p-4 border rounded">
                <h2 className="font-semibold mb-2">
                  Edit Section: {editing}
                </h2>
                <input
                  type="text"
                  value={landingForm.title || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, title: e.target.value })
                  }
                  placeholder="Title"
                  className="block w-full border p-2 mb-2"
                />
                <textarea
                  value={landingForm.subtitle || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, subtitle: e.target.value })
                  }
                  placeholder="Subtitle"
                  className="block w-full border p-2 mb-2"
                />
                <input
                  type="text"
                  value={landingForm.image || ""}
                  onChange={(e) =>
                    setLandingForm({ ...landingForm, image: e.target.value })
                  }
                  placeholder="URL Gambar"
                  className="block w-full border p-2 mb-2"
                />
                <input
                  type="text"
                  value={landingForm.button_text || ""}
                  onChange={(e) =>
                    setLandingForm({
                      ...landingForm,
                      button_text: e.target.value,
                    })
                  }
                  placeholder="Teks Tombol"
                  className="block w-full border p-2 mb-2"
                />
                <input
                  type="text"
                  value={landingForm.button_link || ""}
                  onChange={(e) =>
                    setLandingForm({
                      ...landingForm,
                      button_link: e.target.value,
                    })
                  }
                  placeholder="Link Tombol"
                  className="block w-full border p-2 mb-4"
                />
                <button
                  onClick={handleSaveLanding}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Simpan
                </button>
              </div>
            )}
          </div>
        )}

        <footer className="text-center text-gray-500 text-xs mt-10">
          © 2025 VOXPRO HUB | Admin Panel - Manage Your Bookings & Landing Page
        </footer>
      </main>
    </div>
  );
}
