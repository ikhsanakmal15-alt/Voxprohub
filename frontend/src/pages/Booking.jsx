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

// Promo definitions (percent discount)
const PROMOS = {
  hemat50: 0.5,
  hemat20: 0.2,
  hemat10: 0.1,
};

export default function Booking() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);

  // Rooms with capacities & description
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [duration, setDuration] = useState(1);
  const [blockedSlots, setBlockedSlots] = useState([]); // {roomId, date, start, end, bookingId}
  const [bookingsRaw, setBookingsRaw] = useState([]); // raw bookings from backend

  // form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // {code, discount}
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending | paid | cancelled
  const [localBookingIdCounter, setLocalBookingIdCounter] = useState(1000);

  // UI
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [toast, setToast] = useState(null); // {type, message}
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLog, setAiLog] = useState([]); // {query, reply}
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSuggestions, setPreviewSuggestions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    setRooms([
      { id: "POD", name: "Ruang Podcast", price: 100000, capacity: 4, desc: "Cocok untuk rekaman & podcast" },
      { id: "MEET", name: "Ruang Rapat", price: 150000, capacity: 8, desc: "Rapat tim / presentasi" },
      { id: "KRJ", name: "Ruang Kerja", price: 200000, capacity: 6, desc: "Coworking & kerja kelompok" },
      { id: "STD", name: "Studio", price: 300000, capacity: 12, desc: "Studio produksi & rekaman" },
    ]);

    // fetch bookings from backend and map to blocked slots
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        if (!res.ok) throw new Error("Network response not ok");
        const data = await res.json();
        setBookingsRaw(data);
        const slots = data.flatMap((b) => {
          const startHour = b.jam_mulai ? parseInt(b.jam_mulai.split(":")[0]) : OPEN_HOUR;
          const dur = b.durasi || 1;
          return (Array.isArray(b.tanggal) ? b.tanggal : [b.tanggal]).map((tgl) => ({
            roomId: b.ruangan,
            date: tgl,
            start: startHour,
            end: startHour + dur,
            bookingId: b.id || null,
          }));
        });
        setBlockedSlots(slots);
      } catch (err) {
        console.error("❌ Gagal memuat data booking:", err);
        showToast("error", "Gagal memuat data booking (lihat console).");
      }
    };
    fetchBookings();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // === TOTAL & DISCOUNT CALCULATION ===
  const subtotal = useMemo(() => {
    const room = rooms.find((r) => r.id === selectedRoom);
    if (!room) return 0;
    return room.price * duration * selectedDates.length;
  }, [selectedRoom, duration, selectedDates, rooms]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return subtotal * appliedPromo.discount;
  }, [subtotal, appliedPromo]);

  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  // === TIME OPTIONS ===
  const timeOptions = [];
  for (let i = OPEN_HOUR; i < CLOSE_HOUR; i++) {
    timeOptions.push(`${pad2(i)}:00`);
  }

  // === CALENDAR ===
  const generateDays = (month, year) => {
    const days = [];
    const today = new Date();
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split("T")[0];
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      const isBooked = blockedSlots.some((b) => b.date === dateStr && b.roomId === selectedRoom);
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

  const toggleDate = (date) =>
    setSelectedDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]));

  const toggleTime = (time) =>
    setSelectedTimes((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]));

  // helpers
  const isSlotBlocked = (roomId, date, startHour, durationCheck = 1) => {
    const endHour = startHour + durationCheck;
    return blockedSlots.some((b) => {
      if (b.roomId !== roomId || b.date !== date) return false;
      // overlap detection
      return Math.max(b.start, startHour) < Math.min(b.end, endHour);
    });
  };

  // === TOAST ===
  function showToast(type, message, ms = 3500) {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, ms);
  }

  // === PROMO ===
  const applyPromo = (code) => {
    if (!code) {
      setAppliedPromo(null);
      setPromoCode("");
      showToast("info", "Promo dibersihkan.");
      return;
    }
    const key = code.trim().toLowerCase();
    if (PROMOS[key]) {
      setAppliedPromo({ code: key, discount: PROMOS[key] });
      setPromoCode(key);
      showToast("success", `Promo '${key}' berhasil diterapkan (${Math.round(PROMOS[key]*100)}% off).`);
    } else {
      showToast("error", `Kode promo '${code}' tidak dikenali.`);
    }
  };

  // === BOOKING PREVIEW / RECOMMENDER ===
  const generateRecommendations = () => {
    // Suggest rooms based on capacity and availability for selectedDates and selectedTimes
    // Simple heuristic: prefer rooms with capacity >= needed (we don't have "needed" — use chosen room or default)
    const wantedCapacity = rooms.find((r) => r.id === selectedRoom)?.capacity || 4;
    const suggestions = rooms
      .map((r) => {
        // check availability on all selected dates and times
        const ok = selectedDates.every((d) =>
          selectedTimes.every((t) => {
            const startH = parseInt(t.split(":")[0]);
            return !isSlotBlocked(r.id, d, startH, duration);
          })
        );
        return {
          ...r,
          available: ok,
          estCost: r.price * duration * selectedDates.length,
        };
      })
      .filter((s) => s.available)
      .sort((a, b) => {
        // prioritize capacity close to wanted and lower price
        const capDiffA = Math.abs(a.capacity - wantedCapacity);
        const capDiffB = Math.abs(b.capacity - wantedCapacity);
        if (capDiffA !== capDiffB) return capDiffA - capDiffB;
        return a.estCost - b.estCost;
      });
    setPreviewSuggestions(suggestions.slice(0, 4)); // up to 4 suggestions
    setPreviewOpen(true);
  };

  // === SUBMIT BOOKING ===
  const handleSubmitBooking = async () => {
    if (!selectedRoom || selectedDates.length === 0 || selectedTimes.length === 0 || !phone) {
      showToast("error", "Lengkapi semua data sebelum menyimpan!");
      return;
    }

    // Check conflicts locally
    for (const d of selectedDates) {
      for (const t of selectedTimes) {
        const startH = parseInt(t.split(":")[0]);
        if (isSlotBlocked(selectedRoom, d, startH, duration)) {
          showToast("error", `Slot ${d} ${t} bertabrakan dengan booking lain untuk ruangan ini.`);
          return;
        }
      }
    }

    // Prepare payload
    const payload = {
      nama: name,
      telepon: phone,
      ruangan: selectedRoom,
      tanggal: selectedDates,
      jam_mulai: selectedTimes.join(", "),
      durasi: duration,
      catatan: note,
      promo: appliedPromo ? appliedPromo.code : null,
      subtotal,
      discount: discountAmount,
      total,
      paymentStatus, // pending by default
    };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result && result.success) {
        showToast("success", "✅ Booking berhasil disimpan dan admin diberitahu.");
        // add to local blockedSlots for immediate UX
        const newSlots = (Array.isArray(payload.tanggal) ? payload.tanggal : [payload.tanggal]).flatMap((tgl) =>
          selectedTimes.map((t) => {
            const start = parseInt(t.split(":")[0]);
            return { roomId: selectedRoom, date: tgl, start, end: start + duration, bookingId: result.id || null };
          })
        );
        setBlockedSlots((prev) => [...prev, ...newSlots]);
        // optionally open success popup / show booking preview
        setLocalBookingIdCounter((c) => c + 1);

        // Notify admin via WhatsApp prefilled (open new tab)
        notifyAdminWhatsApp(payload, result.id || localBookingIdCounter);

        // reset or keep based on preference — here we'll keep minimal and set payment status to pending
        setPaymentStatus("pending");
      } else {
        showToast("error", "❌ Gagal menyimpan booking. Cek server.");
      }
    } catch (err) {
      console.error("❌ Gagal kirim booking:", err);
      showToast("error", "Gagal mengirim booking (lihat console).");
    }
  };

  // === NOTIFY ADMIN VIA WHATSAPP (prefilled message) ===
  const notifyAdminWhatsApp = (payload, bookingId) => {
    const room = rooms.find((r) => r.id === payload.ruangan);

    // === Format pesan WA ===
    const message = `
Halo Admin VoxProHub! 👋

Saya ingin melakukan booking dengan detail berikut:

🆔 ID: ${bookingId || "-"}
👤 Nama: ${payload.nama || "-"}
📞 HP: ${payload.telepon || "-"}
🏢 Ruangan: ${room ? room.name : payload.ruangan}
📅 Tanggal: ${payload.tanggal.join ? payload.tanggal.join(", ") : payload.tanggal}
⏰ Jam Mulai: ${payload.jam_mulai}
⏳ Durasi: ${payload.durasi} jam
💰 Subtotal: ${toIDR(payload.subtotal)}
🎟️ Diskon: ${toIDR(payload.discount)}
💵 Total: ${toIDR(payload.total)}
📄 Status Pembayaran: ${payload.paymentStatus || "Pending"}
📝 Catatan: ${payload.catatan || "-"}

Terima kasih 
    `.trim();

    // === Buka WhatsApp di tab baru ===
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };


  // === SEND TO WHATSAPP (user-triggered) ===
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

Status: ${paymentStatus === "paid" ? "Sudah Bayar" : "Belum Bayar (via QRIS)"}
Terima kasih 🙏
      `;
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  // === QRIS SIMULATION ===
  const simulateScanAndPay = () => {
    if (!selectedRoom || selectedDates.length === 0 || selectedTimes.length === 0 || !phone) {
      showToast("error", "Lengkapi data booking sebelum melakukan pembayaran QRIS.");
      return;
    }
    setPaymentStatus("pending");
    showToast("info", "Menunggu konfirmasi pembayaran...");

    // simulate scanning -> paid after 2.5s
    setTimeout(() => {
      setPaymentStatus("paid");
      showToast("success", "Pembayaran QRIS berhasil (simulasi). Status: paid.");
    }, 2500);
  };

  const cancelQrisPayment = () => {
    if (paymentStatus === "paid") {
      // if paid, allow refund simulation
      setPaymentStatus("cancelled");
      showToast("info", "Pembayaran dibatalkan (simulasi).");
    } else {
      setPaymentStatus("cancelled");
      showToast("info", "Pembayaran dibatalkan (simulasi).");
    }
  };

  // === AI AGENT (LOCAL SIMULATION) ===
  const aiGenerate = async (queryText) => {
    setAiLoading(true);
    const q = String(queryText || "").trim().toLowerCase();

    // simple hard-coded parsing rules:
    let reply = "Maaf, saya belum mengerti. Coba: 'jam buka', 'jam tutup', 'harga POD', 'kapasitas MEET', 'apply promo hemat50', 'cari slot kosong 2025-11-24 durasi 2', 'batalkan booking 123', 'summary'.";
    try {
      if (q.includes("jam buka") || q.includes("open hour") || q.includes("buka")) {
        reply = `Jam buka: ${OPEN_HOUR}:00, Jam tutup: ${CLOSE_HOUR}:00.`;
      } else if (q.includes("jam tutup") || q.includes("close")) {
        reply = `Jam tutup: ${CLOSE_HOUR}:00.`;
      } else if (q.startsWith("harga") || q.includes("harga ruang") || q.includes("price")) {
        // expect room code or name
        const found = rooms.find((r) => q.includes(r.id.toLowerCase()) || q.includes(r.name.toLowerCase()));
        if (found) reply = `${found.name} — ${toIDR(found.price)}/jam (kapasitas ${found.capacity}).`;
        else reply = "Sebutkan kode ruangan (POD/MEET/KRJ/STD) untuk melihat harga.";
      } else if (q.includes("kapasitas") || q.includes("capacity")) {
        const found = rooms.find((r) => q.includes(r.id.toLowerCase()) || q.includes(r.name.toLowerCase()));
        if (found) reply = `${found.name} memiliki kapasitas hingga ${found.capacity} orang.`;
        else reply = "Sebutkan kode ruangan untuk mengetahui kapasitas (contoh: 'kapasitas MEET').";
      } else if (q.startsWith("apply promo") || q.includes("apply promo") || q.includes("pakai promo")) {
        const code = q.split(" ").pop();
        if (PROMOS[code]) {
          applyPromo(code);
          reply = `Promo '${code}' diterapkan (${Math.round(PROMOS[code]*100)}% off).`;
        } else {
          reply = `Kode promo '${code}' tidak ditemukan.`;
        }
      } else if (q.startsWith("cari slot kosong") || q.includes("slot kosong") || q.includes("find slots")) {
        // naive: expect 'cari slot kosong YYYY-MM-DD durasi N'
        const parts = q.split(" ");
        const dateCandidate = parts.find((p) => /^\d{4}-\d{2}-\d{2}$/.test(p));
        const durCandidate = parts.find((p, i) => parts[i-1] === "durasi" || parts[i-1] === "duration");
        const durNum = durCandidate ? parseInt(durCandidate) : duration;

        if (!dateCandidate) {
          // search multiple dates using selectedDates
          const datesToCheck = selectedDates.length ? selectedDates : [new Date().toISOString().split("T")[0]];
          const resSlots = [];
          for (const d of datesToCheck) {
            for (const r of rooms) {
              for (let h = OPEN_HOUR; h <= CLOSE_HOUR - durNum; h++) {
                if (!isSlotBlocked(r.id, d, h, durNum)) {
                  resSlots.push({ roomId: r.id, roomName: r.name, date: d, start: `${pad2(h)}:00`, duration: durNum });
                }
              }
            }
          }
          reply = `Menemukan ${resSlots.length} slot kosong. Menampilkan 5 teratas:`;
          const sample = resSlots.slice(0, 5).map((s) => `${s.roomName} — ${s.date} ${s.start} (durasi ${s.duration}h)`).join("\n");
          reply = reply + "\n\n" + sample;
        } else {
          // look for that date
          const resSlots = [];
          for (const r of rooms) {
            for (let h = OPEN_HOUR; h <= CLOSE_HOUR - durNum; h++) {
              if (!isSlotBlocked(r.id, dateCandidate, h, durNum)) {
                resSlots.push({ roomId: r.id, roomName: r.name, date: dateCandidate, start: `${pad2(h)}:00`, duration: durNum });
              }
            }
          }
          if (resSlots.length === 0) reply = `Tidak ditemukan slot kosong pada ${dateCandidate} untuk durasi ${durNum} jam.`;
          else {
            reply = `Menemukan ${resSlots.length} slot kosong pada ${dateCandidate} — menampilkan 5 teratas:\n` + resSlots.slice(0, 5).map(s => `${s.roomName} — ${s.start}`).join("\n");
          }
        }
      } else if (q.startsWith("batalkan booking") || q.includes("cancel booking") || q.includes("batalkan")) {
        // simulate cancellation locally
        const idMatch = q.match(/\d+/);
        const id = idMatch ? idMatch[0] : null;
        if (!id) {
          reply = "Sebutkan ID booking untuk dibatalkan (contoh: 'batalkan booking 123').";
        } else {
          // remove from blockedSlots if bookingId matches or local simulated
          const prevLen = blockedSlots.length;
          const filtered = blockedSlots.filter(b => String(b.bookingId) !== String(id));
          setBlockedSlots(filtered);
          if (filtered.length < prevLen) {
            reply = `Booking ID ${id} dibatalkan (simulasi lokal). Ruangan dikembalikan ke ketersediaan.`;
            showToast("success", `Booking ${id} dibatalkan (simulasi).`);
          } else {
            reply = `Booking ID ${id} tidak ditemukan pada data lokal.`;
          }
        }
      } else if (q.includes("summary") || q.includes("ringkasan") || q.includes("form")) {
        // show quick summary of current form
        const room = rooms.find((r) => r.id === selectedRoom);
        reply = `Ringkasan:
Nama: ${name || "-"}
Telepon: ${phone || "-"}
Ruangan: ${room ? room.name : "-"}
Tanggal: ${selectedDates.length ? selectedDates.join(", ") : "-"}
Jam: ${selectedTimes.length ? selectedTimes.join(", ") : "-"}
Durasi: ${duration} jam
Subtotal: ${toIDR(subtotal)}
Diskon: ${appliedPromo ? `${appliedPromo.code} (${Math.round(appliedPromo.discount*100)}%)` : "-"}
Total: ${toIDR(total)}
Status Pembayaran: ${paymentStatus}
        `;
      }
    } catch (err) {
      console.error("AI error:", err);
      reply = "Terjadi error saat memproses permintaan AI (lihat console).";
    } finally {
      setAiLog((l) => [{ query: queryText, reply }, ...l].slice(0, 10));
      setAiLoading(false);
      setAiInput("");
      setAiOpen(true);
    }
  };

  // small helper: quick book preview accept suggestion
  const acceptSuggestion = (roomId) => {
    setSelectedRoom(roomId);
    setPreviewOpen(false);
    showToast("success", `Rekomendasi diterapkan: ${roomId}`);
  };

  // month names
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white font-[Poppins] text-gray-800">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scroll ? "bg-white/90 shadow-md py-2" : "bg-white py-4"}`}>
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={image14} alt="Logo" className="w-9 h-9" />
            <h1 className="text-xl font-bold text-[#d26b33] tracking-wide">VOXPRO HUB</h1>
          </div>
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            {[ { name: "Beranda", path: "/" }, { name: "Booking", path: "/booking" }, { name: "Fasilitas", path: "/fasilitas" }, { name: "Kontak", path: "/kontak" } ].map((item) => (
              <button key={item.name} onClick={() => navigate(item.path)} className="hover:text-emerald-600 transition duration-300">{item.name}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-6 border border-gray-100 md:col-span-2">
          <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">Pemesanan Ruangan</h2>

          {/* Pilih Ruangan */}
          <div>
            <label className="block font-semibold mb-2">Pilih Ruangan:</label>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500">
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({toIDR(r.price)}/jam) — Kapasitas {r.capacity}
                </option>
              ))}
            </select>
          </div>

          {/* Nama & Telepon */}
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500" />
            <input type="text" placeholder="Nomor Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500" />
          </div>

          {/* Kalender */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <button onClick={prevMonth} className="text-emerald-700 font-bold">&lt;</button>
              <h3 className="font-semibold">{monthNames[month]} {year}</h3>
              <button onClick={nextMonth} className="text-emerald-700 font-bold">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => (
                <button key={d.date} disabled={d.past || d.booked} onClick={() => toggleDate(d.date)} className={`rounded-lg py-2 text-sm font-medium transition-all ${d.past ? "bg-gray-200 text-gray-500" : d.booked ? "bg-red-400 text-white cursor-not-allowed" : selectedDates.includes(d.date) ? "bg-emerald-600 text-white ring-2 ring-emerald-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Jam */}
          <div>
            <label className="block font-semibold mb-2">Pilih Jam:</label>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((t) => {
                const startH = parseInt(t.split(":")[0]);
                const blocked = selectedDates.some((d) => isSlotBlocked(selectedRoom, d, startH, duration));
                return (
                  <button key={t} onClick={() => toggleTime(t)} disabled={blocked} className={`py-2 rounded-lg border flex items-center justify-center gap-1 ${selectedTimes.includes(t) ? "bg-emerald-600 text-white border-emerald-700" : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-100"} ${blocked ? "opacity-60 cursor-not-allowed line-through" : ""}`}>
                    {selectedTimes.includes(t) && "✅"} {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Durasi */}
          <div>
            <label className="block font-semibold mb-2">Durasi (jam):</label>
            <input type="number" min="1" max="12" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="border rounded-xl p-3 w-28 text-center focus:ring-2 focus:ring-emerald-500" />
          </div>

          {/* Promo */}
          <div className="grid md:grid-cols-3 gap-2 items-center">
            <input type="text" placeholder="Kode Promo (contoh: hemat50)" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500" />
            <button onClick={() => applyPromo(promoCode)} className="bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition">Terapkan Promo</button>
            <button onClick={() => { setAppliedPromo(null); setPromoCode(""); showToast("info","Promo dibersihkan."); }} className="bg-gray-200 py-2 rounded-xl">Bersihkan</button>
          </div>

          {/* Ringkasan */}
          <div className="p-4 bg-gray-50 border rounded-xl">
            <p className="font-semibold mb-2 text-gray-700">Ringkasan Booking:</p>
            <p>Ruangan: {selectedRoom || "-"}</p>
            <p>Tanggal: {selectedDates.join(", ") || "-"}</p>
            <p>Jam: {selectedTimes.join(", ") || "-"}</p>
            <p>Durasi: {duration} jam</p>
            <p>Subtotal: {toIDR(subtotal)}</p>
            <p>Diskon: {appliedPromo ? `${appliedPromo.code} (${Math.round(appliedPromo.discount*100)}%) - ${toIDR(discountAmount)}` : "-"}</p>
            <p className="font-semibold text-emerald-700 mt-2">Total: {toIDR(total)}</p>
            <p className="text-sm text-gray-500 mt-1">Status Pembayaran: <span className={`font-semibold ${paymentStatus === "paid" ? "text-green-600" : paymentStatus === "cancelled" ? "text-red-600" : "text-amber-600"}`}>{paymentStatus}</span></p>
          </div>

          {/* Tombol aksi */}
          <div className="grid md:grid-cols-2 gap-3">
            <button onClick={handleSubmitBooking} disabled={!selectedRoom || !phone || selectedDates.length === 0} className="bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition">Simpan Booking</button>
            <button onClick={sendToWhatsApp} className="bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition">Chat via WhatsApp</button>
            <button onClick={generateRecommendations} className="bg-sky-600 text-white py-3 rounded-xl hover:bg-sky-700 transition">Preview Rekomendasi Ruangan</button>
            <button onClick={() => setAiOpen(true)} className="bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 transition">Bantuan AI Agent</button>
          </div>

        </div>

        {/* QRIS PEMBAYARAN */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 text-center">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Pembayaran QRIS</h3>
          <img src={qrisImage} alt="QRIS Payment" className="w-56 h-56 mx-auto mb-4 rounded-2xl border shadow-sm" />
          <p className="text-sm text-gray-600 leading-relaxed">Silakan lakukan pembayaran melalui QRIS untuk mempercepat konfirmasi.</p>
          <p className="text-xs text-gray-500 mt-2 italic">Setelah pembayaran, status akan berubah menjadi <span className="font-semibold">paid</span> (simulasi).</p>

          <div className="mt-4 space-y-2">
            <button onClick={simulateScanAndPay} className="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition">Scan & Bayar (Simulasi)</button>
            <button onClick={cancelQrisPayment} className="w-full bg-red-400 text-white py-2 rounded-xl hover:bg-red-500 transition">Batalkan Pembayaran</button>
            <div className="text-sm text-gray-700 mt-2">
              Status: <span className={`font-semibold ${paymentStatus === "paid" ? "text-green-600" : paymentStatus === "cancelled" ? "text-red-600" : "text-amber-600"}`}>{paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-orange-600">VoxProHub</span>. All Rights Reserved.</p>
      </footer>

      {/* TOAST */}
      {toast && (
        <div className={`fixed right-6 bottom-6 z-60 px-5 py-3 rounded-lg shadow-lg ${toast.type === "success" ? "bg-green-600 text-white" : toast.type === "error" ? "bg-red-600 text-white" : "bg-amber-500 text-black"}`}>
          {toast.message}
        </div>
      )}

      {/* PREVIEW SUGGESTIONS MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h3 className="font-semibold text-lg mb-3">Rekomendasi Ruangan</h3>
            {previewSuggestions.length === 0 ? <p>Tidak ada rekomendasi yang tersedia untuk pilihan Anda.</p> : (
              <div className="grid gap-3">
                {previewSuggestions.map((s) => (
                  <div key={s.id} className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{s.name} — {s.capacity} orang</div>
                      <div className="text-sm text-gray-600">{s.desc}</div>
                      <div className="text-sm mt-1">Estimasi biaya: <span className="font-semibold">{toIDR(s.estCost)}</span></div>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => acceptSuggestion(s.id)} className="bg-emerald-600 text-white py-2 px-4 rounded-xl">Pakai</button>
                      <div className="text-xs text-gray-500">Tersedia</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-right">
              <button onClick={() => setPreviewOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* AI AGENT MODAL */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-semibold text-lg">AI Agent — Bantuan Pintar</h3>
              <div className="space-x-2">
                <button onClick={() => { setAiOpen(false); }} className="px-3 py-1 rounded bg-gray-200">Tutup</button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Tanyakan sesuatu, contoh: 'jam buka', 'harga POD', 'apply promo hemat50', 'cari slot kosong 2025-11-24 durasi 2'" className="col-span-3 border rounded-xl p-3" />
              <button onClick={() => aiGenerate(aiInput)} disabled={aiLoading} className="col-span-1 bg-emerald-600 text-white rounded-xl p-3">{aiLoading ? "Memproses..." : "Kirim"}</button>
            </div>

            <div className="mt-4 max-h-64 overflow-auto space-y-3">
              {aiLog.length === 0 ? <div className="text-sm text-gray-500">Riwayat percakapan AI akan muncul di sini...</div> : aiLog.map((l, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="text-xs text-gray-500">Anda: {l.query}</div>
                  <div className="mt-2 whitespace-pre-line">{l.reply}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <button onClick={() => { setAiLog([]); showToast("info","Riwayat AI dibersihkan."); }} className="px-3 py-2 rounded bg-gray-200 mr-2">Bersihkan Riwayat</button>
              <button onClick={() => setAiOpen(false)} className="px-4 py-2 rounded bg-emerald-600 text-white">Selesai</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
