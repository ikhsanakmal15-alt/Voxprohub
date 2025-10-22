import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import image14 from "../assets/image14.png";
import qrisImage from "../assets/qris.png";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;
const ADMIN_WHATSAPP = "6285242008058";
const pad2 = (n) => String(n).padStart(2, "0");
const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

export default function Booking() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]); // multiple time slots
  const [duration, setDuration] = useState(1);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  // === FETCH DATA ===
  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", () => setScroll(window.scrollY > 50));

    setRooms([
      { id: "POD", name: "Ruang Podcast", price: 100000 },
      { id: "MEET", name: "Ruang Rapat", price: 150000 },
      { id: "KRJ", name: "Ruang Kerja", price: 200000 },
      { id: "STD", name: "Studio", price: 300000 },
    ]);

    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();
        const slots = data.map((b) => ({
          roomId: b.ruangan,
          date: b.tanggal,
          start: b.jam_mulai ? parseInt(b.jam_mulai.split(":")[0]) : 8,
          end: b.jam_mulai ? parseInt(b.jam_mulai.split(":")[0]) + (b.durasi || 1) : 9,
        }));
        setBlockedSlots(slots);
      } catch (err) {
        console.error("❌ Gagal memuat data booking:", err);
      }
    };
    fetchBookings();
  }, []);

  // === HITUNG TOTAL ===
  const total = useMemo(() => {
    const room = rooms.find((r) => r.id === selectedRoom);
    return room ? room.price * duration * selectedDates.length : 0;
  }, [selectedRoom, duration, selectedDates, rooms]);

  // === JAM PILIHAN ===
  const timeOptions = [];
  for (let i = OPEN_HOUR; i < CLOSE_HOUR; i++) {
    timeOptions.push(`${pad2(i)}:00`);
  }

  // === GENERATE KALENDER ===
  const generateDays = (month, year) => {
    const days = [];
    const today = new Date();
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split("T")[0];
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      const isBooked = blockedSlots.some(
        (b) => b.date === dateStr && b.roomId === selectedRoom
      );
      days.push({ date: dateStr, label: i, booked: isBooked, past: isPast });
    }
    return days;
  };

  const days = generateDays(month, year);

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const toggleTime = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  // === SUBMIT BOOKING ===
  const handleSubmitBooking = async () => {
    if (!selectedRoom || selectedDates.length === 0 || selectedTimes.length === 0 || !phone) {
      alert("Lengkapi semua data sebelum menyimpan!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: name,
          telepon: phone,
          ruangan: selectedRoom,
          tanggal: selectedDates,
          jam_mulai: selectedTimes.join(", "),
          durasi: duration,
          catatan: note,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ Booking berhasil disimpan!");
        window.location.reload();
      } else {
        alert("❌ Gagal menyimpan booking");
      }
    } catch (err) {
      console.error("❌ Gagal kirim booking:", err);
    }
  };

  // === KIRIM KE WHATSAPP ===
  const sendToWhatsApp = () => {
    const room = rooms.find((r) => r.id === selectedRoom);
    const message = `
Halo Admin VoxProHub! 🙌

Saya ingin melakukan booking dengan detail berikut:

🧍 Nama: ${name || "-"}
📞 No. HP: ${phone || "-"}
🏢 Ruangan: ${room ? room.name : "-"}
📅 Tanggal: ${selectedDates.join(", ") || "-"}
⏰ Jam: ${selectedTimes.join(", ") || "-"}
⏳ Durasi: ${duration} jam
💰 Total: ${toIDR(total)}

Catatan: ${note || "-"}

Status: Belum Bayar (via QRIS)
Terima kasih 🙏
    `;
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white font-[Poppins] text-gray-800">
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll ? "bg-white/90 shadow-md py-2" : "bg-white py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={image14} alt="Logo" className="w-9 h-9" />
            <h1 className="font-[Playfair_Display] text-xl font-bold text-orange-600">
              VOXPRO HUB
            </h1>
          </div>
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            {[
              { name: "Beranda", path: "/" },
              { name: "Booking", path: "/booking" },
              { name: "Fasilitas", path: "/fasilitas" },
              { name: "Kontak", path: "/kontak" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="hover:text-emerald-600 transition duration-300"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* === MAIN CONTENT === */}
      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {/* === FORM === */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-6 border border-gray-100 md:col-span-2">
          <h2 className="text-3xl font-[Playfair_Display] font-bold text-center text-emerald-700 mb-6">
            Pemesanan Ruangan
          </h2>

          {/* Pilihan Ruangan */}
          <div>
            <label className="block font-semibold mb-2">Pilih Ruangan:</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({toIDR(r.price)}/jam)
                </option>
              ))}
            </select>
          </div>

          {/* Input Nama & Telepon */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Nomor Telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Kalender */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <button onClick={prevMonth} className="text-emerald-700 font-bold">&lt;</button>
              <h3 className="font-semibold">
                {monthNames[month]} {year}
              </h3>
              <button onClick={nextMonth} className="text-emerald-700 font-bold">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => (
                <button
                  key={d.date}
                  disabled={d.past || d.booked}
                  onClick={() => toggleDate(d.date)}
                  className={`rounded-lg py-2 text-sm font-medium transition-all ${
                    d.past
                      ? "bg-gray-200 text-gray-500"
                      : d.booked
                      ? "bg-red-400 text-white cursor-not-allowed"
                      : selectedDates.includes(d.date)
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Jam */}
          <div>
            <label className="block font-semibold mb-2">Pilih Jam:</label>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTime(t)}
                  className={`py-2 rounded-lg border flex items-center justify-center gap-1 ${
                    selectedTimes.includes(t)
                      ? "bg-emerald-600 text-white border-emerald-700"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-100"
                  }`}
                >
                  {selectedTimes.includes(t) && "✅"} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Durasi */}
          <div>
            <label className="block font-semibold mb-2">Durasi (jam):</label>
            <input
              type="number"
              min="1"
              max="12"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border rounded-xl p-3 w-28 text-center focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Ringkasan */}
          <div className="p-4 bg-gray-50 border rounded-xl">
            <p className="font-semibold mb-2 text-gray-700">Ringkasan Booking:</p>
            <p>Ruangan: {selectedRoom || "-"}</p>
            <p>Tanggal: {selectedDates.join(", ") || "-"}</p>
            <p>Jam: {selectedTimes.join(", ") || "-"}</p>
            <p>Durasi: {duration} jam</p>
            <p className="font-semibold text-emerald-700 mt-2">
              Total: {toIDR(total)}
            </p>
          </div>

          {/* Tombol */}
          <div className="grid md:grid-cols-2 gap-3">
            <button
              onClick={handleSubmitBooking}
              disabled={!selectedRoom || !phone || selectedDates.length === 0}
              className="bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              Simpan Booking
            </button>
            <button
              onClick={sendToWhatsApp}
              className="bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
            >
              Chat via WhatsApp
            </button>
          </div>
        </div>

        {/* === PEMBAYARAN QRIS === */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 text-center">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Pembayaran QRIS</h3>
          <img
            src={qrisImage}
            alt="QRIS Payment"
            className="w-56 h-56 mx-auto mb-4 rounded-2xl border shadow-sm"
          />
          <p className="text-sm text-gray-600 leading-relaxed">
            Silakan lakukan pembayaran melalui QRIS untuk mempercepat konfirmasi.
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            Setelah pembayaran, kirim bukti ke admin melalui WhatsApp.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-600">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-orange-600">VoxProHub</span>. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
