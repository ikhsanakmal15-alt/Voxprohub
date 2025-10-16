import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import image14 from "../assets/image14.png";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;
const pad2 = (n) => String(n).padStart(2, "0");
const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

export default function Booking() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [name, setName] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", () => setScroll(window.scrollY > 50));

    setRooms([
      { id: "A", name: "Studio A", price: 150000 },
      { id: "B", name: "Studio B", price: 200000 },
      { id: "C", name: "Studio C", price: 250000 },
    ]);

    setBlockedSlots([
      { roomId: "A", date: "2025-10-20", start: 10, end: 12 },
      { roomId: "B", date: "2025-10-21", start: 14, end: 16 },
    ]);
  }, []);

  const total = useMemo(() => {
    const room = rooms.find((r) => r.id === selectedRoom);
    return room ? room.price * duration * selectedDates.length : 0;
  }, [selectedRoom, duration, selectedDates, rooms]);

  const hasOverlap = useMemo(() => {
    return selectedDates.some((date) =>
      blockedSlots.some(
        (b) =>
          b.roomId === selectedRoom &&
          b.date === date &&
          parseInt(selectedTime.split(":")[0]) < b.end &&
          parseInt(selectedTime.split(":")[0]) + duration > b.start
      )
    );
  }, [selectedDates, selectedTime, duration, selectedRoom, blockedSlots]);

  const timeOptions = [];
  for (let i = OPEN_HOUR; i < CLOSE_HOUR; i++) {
    timeOptions.push(`${pad2(i)}:00`);
  }

  const generateDays = (month, year) => {
    const days = [];
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split("T")[0];
      const isBooked = blockedSlots.some((b) => b.date === dateStr);
      days.push({
        date: dateStr,
        label: i,
        booked: isBooked,
      });
    }
    return days;
  };

  const days = generateDays(month, year);

  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];

  const onWhatsApp = () => {
    if (!selectedRoom || selectedDates.length === 0 || !selectedTime) return;
    const room = rooms.find((r) => r.id === selectedRoom);
    const autoMsg = "Pesan dibuat otomatis dari sistem booking.";
    const msg = encodeURIComponent(
      `Halo, saya ingin booking:\n\n👤 Nama: ${name || "-"}\n🏠 Ruangan: ${
        room?.name
      }\n📅 Tanggal: ${selectedDates.join(", ")}\n🕗 Waktu: ${selectedTime}\n⏰ Durasi: ${
        duration
      } jam\n💰 Total: ${toIDR(total)}\n\n${autoMsg}`
    );
    window.location.href = `https://api.whatsapp.com/send?phone=6285242008058&text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-[#f9f9f7] font-[Poppins] text-gray-800">
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll ? "bg-white/90 shadow-md py-2" : "bg-white py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={image14} alt="Logo" className="w-9 h-9" />
            <h1 className="font-[Playfair_Display] text-xl font-bold text-orange-600 tracking-wide">
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
      <div className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-4xl font-[Playfair_Display] font-bold text-center text-black mb-10">
          Pemesanan Ruangan
        </h2>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 border border-gray-100">
          {/* Ruangan */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Pilih Ruangan:
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({toIDR(r.price)}/jam)
                </option>
              ))}
            </select>
          </div>

          {/* Kalender */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevMonth}
                className="text-emerald-700 font-bold text-lg"
              >
                &lt;
              </button>
              <h3 className="font-semibold text-gray-700">
                {monthNames[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="text-emerald-700 font-bold text-lg"
              >
                &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => (
                <button
                  key={d.date}
                  onClick={() => !d.booked && toggleDate(d.date)}
                  className={`rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                    d.booked
                      ? "bg-red-200 text-red-700 cursor-not-allowed"
                      : selectedDates.includes(d.date)
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-emerald-500"></span> Available
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-red-400"></span> Booked
              </div>
            </div>
          </div>

          {/* Waktu & Durasi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Waktu Mulai:</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">-- Pilih Jam --</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-2">Durasi (jam):</label>
              <input
                type="number"
                min="1"
                max="8"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="block font-medium mb-2">Nama (opsional):</label>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Ringkasan */}
          <div className="p-4 bg-gray-50 border rounded-xl">
            <p className="font-semibold mb-1 text-gray-700">Ringkasan Booking:</p>
            <p>Ruangan: {selectedRoom || "-"}</p>
            <p>Tanggal: {selectedDates.length ? selectedDates.join(", ") : "-"}</p>
            <p>Jam: {selectedTime || "-"}</p>
            <p>Durasi: {duration} jam</p>
            <p className="mt-2 font-semibold text-emerald-700 text-lg">
              Total: {toIDR(total)}
            </p>
          </div>

          {hasOverlap && (
            <p className="text-sm text-red-600">
              ⚠️ Salah satu tanggal bentrok dengan jadwal yang sudah dibooking.
            </p>
          )}

          <button
            onClick={onWhatsApp}
            disabled={!selectedRoom || selectedDates.length === 0 || !selectedTime || hasOverlap}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300 disabled:opacity-60 shadow-lg"
          >
            Kirim ke WhatsApp
          </button>
        </div>
      </div>

      {/* === FOOTER === */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-600">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-orange-600">VoxProHub</span>. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
