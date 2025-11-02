// === LandingPage.jsx ===
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

// === ASSETS ===
import image13 from "./assets/image13.png";
import image14 from "./assets/image14.png";
import fasilitas1 from "./assets/fasilitas1.png";
import fasilitas2 from "./assets/fasilitas2.png";
import fasilitas3 from "./assets/fasilitas3.png";
import kontak1 from "./assets/kontak1.png";
import SHAPEGradasi from "./assets/shape-gradasi.png";

/**
 * NOTE:
 * - Aku mempertahankan semua fungsi & data fetching yang sudah ada.
 * - Menghilangkan bagian yang kamu minta: "WHO WE ARE", statistik (850+, 99.2%, 12+)
 *   dan juga floating stat cards (🏆 95% Client Retention, 3.2x ROI).
 * - Styling ditingkatkan: palet biru-putih konsisten, shadow lembut, glassmorphism,
 *   transisi halus, dan typographic hierarchy.
 *
 * Pastikan Tailwind CSS sudah dikonfigurasi di proyekmu. Jika ingin font khusus
 * (Poppins, Inter) pastikan ditambahkan di index.html atau di config Tailwind.
 */

// === Lazy Load Image Component ===
const LazyImage = ({ src, alt, className }) => (
  <img loading="lazy" src={src} alt={alt} className={className} />
);

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [hero, setHero] = useState({});
  const [visi, setVisi] = useState({});
  const [fasilitas, setFasilitas] = useState({});
  const [lokasi, setLokasi] = useState({});
  const [kontak, setKontak] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const berandaRef = useRef(null);
  const fasilitasRef = useRef(null);
  const lokasiRef = useRef(null);
  const kontakRef = useRef(null);

  const fasilitasData = [
    {
      img: fasilitas1,
      title: "Studio",
      desc: "Cocok untuk podcast, video, atau live streaming profesional.",
    },
    {
      img: fasilitas2,
      title: "Medium Room",
      desc: "Ideal untuk meeting skala kecil dengan fasilitas lengkap.",
    },
    {
      img: fasilitas3,
      title: "Small Room",
      desc: "Nyaman untuk rapat privat atau kerja mandiri.",
    },
  ];

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 20);
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Data from API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/landing")
      .then((res) => {
        const data = res.data;
        setHero(data.find((i) => i.section === "hero") || {});
        setVisi(data.find((i) => i.section === "visi") || {});
        setFasilitas(data.find((i) => i.section === "fasilitas") || {});
        setLokasi(data.find((i) => i.section === "lokasi") || {});
        setKontak(data.find((i) => i.section === "kontak") || {});
      })
      .catch((err) => console.error("Gagal memuat konten:", err));
  }, []);

  // Auto Slide Fasilitas
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fasilitasData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoSlide]);

  const scrollToSection = (ref) => {
    setOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCardClick = (index) => setCurrentIndex(index);

  return (
    <div className="min-h-screen overflow-x-hidden transition-colors duration-500 bg-white text-gray-800 font-[Poppins,Inter,sans-serif]">
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll
            ? "bg-white/80 shadow-md backdrop-blur-md py-2"
            : "bg-white/60 backdrop-blur-sm py-3"
        } border-b border-white/30`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* === Logo === */}
          <div className="flex items-center gap-3">
            <img
              src={image14}
              alt="Logo"
              className="w-10 h-10 rounded-full drop-shadow-md object-cover"
            />
            <div>
              <h1 className="font-extrabold tracking-tight text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
                VOXPRO HUB
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">Creative Voxprohub • Makassar</p>
            </div>
          </div>

          {/* === Desktop Menu === */}
          <div className="hidden md:flex gap-8 items-center font-medium text-gray-700">
            {["Beranda", "Fasilitas", "Lokasi", "Kontak"].map((menu, i) => (
              <button
                key={i}
                onClick={() =>
                  scrollToSection([berandaRef, fasilitasRef, lokasiRef, kontakRef][i])
                }
                className="relative group text-sm md:text-base px-2 py-1 rounded-md hover:text-blue-600 transition-colors"
              >
                {menu}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:w-full rounded"></span>
              </button>
            ))}
            <div className="flex gap-3 ml-6">
              <Link
                to="/login"
                className="px-4 py-2 text-sm rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm transition-all duration-300"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:scale-[1.01] transition-transform duration-200"
              >
                Daftar
              </Link>
            </div>
          </div>

          {/* === Mobile Button === */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-blue-600 transition-transform duration-300 hover:scale-110"
              onClick={() => setOpen(!open)}
              aria-label="Open menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* === Mobile Menu === */}
        <div
          className={`md:hidden bg-white/95 backdrop-blur-md overflow-hidden transition-all duration-500 ${
            open ? "max-h-80 py-4 shadow-lg" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center gap-4 text-gray-700 font-medium text-sm">
            {["Beranda", "Fasilitas", "Lokasi", "Kontak"].map((menu, i) => (
              <button
                key={i}
                onClick={() =>
                  scrollToSection([berandaRef, fasilitasRef, lokasiRef, kontakRef][i])
                }
                className="w-full text-left px-6 py-2 hover:text-blue-600 transition"
              >
                {menu}
              </button>
            ))}
            <div className="flex gap-3 mt-2">
              <Link
                to="/login"
                className="px-5 py-1.5 border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:shadow-md transition"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section
        ref={berandaRef}
        className="relative bg-white pt-28 md:pt-32 pb-16 md:pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 items-center">
          {/* Text Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 text-center md:text-left"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {hero.title || "Ruang Kreatif & Kolaborasi untuk Profesional Digital"}
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              {hero.subtitle ||
                "Voxpro Hub menyediakan studio, ruang meeting, dan fasilitas event yang dirancang untuk mendukung produktivitas, kreativitas, dan pertumbuhan komunitas startup di Makassar."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              {hero.button_text && (
                <Link
                  to={hero.button_link || "/booking"}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-[1.01] transition transform duration-200"
                >
                  {hero.button_text}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              <button
                onClick={() => scrollToSection(fasilitasRef)}
                className="px-6 py-3 border border-blue-200 text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 transition"
              >
                Lihat Fasilitas
              </button>
            </div>

            {/* small trust badges */}
            <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 shadow-sm">★</span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Trusted</div>
                  <div className="text-xs">oleh komunitas kreatif Makassar</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 shadow-sm">⚡</span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Fast Setup</div>
                  <div className="text-xs">infrastruktur ready-to-use</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={image13}
                alt="Team"
                className="w-full h-full object-cover"
                style={{ minHeight: 380 }}
              />
              {/* subtle overlay card bottom-left */}
              <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-sm border border-white/60">
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === VISI SECTION === */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {visi?.title || "Visi & Misi"}
          </h2>
          <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            {visi?.subtitle ||
              "Menjadi pusat kreatif terdepan yang menghubungkan talenta digital, kreator, dan pelaku bisnis melalui ruang kerja dan pengalaman kolaboratif."}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[
            { icon: "🔒", title: "Secure Platform", desc: "Keamanan privat untuk semua booking." },
            { icon: "⚡", title: "Fast Performance", desc: "Infrastruktur siap pakai, minim setup." },
            { icon: "🔗", title: "Easy Integration", desc: "Integrasi cepat dengan tool tim Anda." },
            { icon: "⚙️", title: "Customizable", desc: "Ruang & paket bisa disesuaikan." },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-4 text-blue-600">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === FASILITAS === */}
      <section ref={fasilitasRef} className="bg-white py-16 md:py-24 px-6 md:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {fasilitas.title || "Fasilitas Kami"}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {fasilitas.subtitle ||
              "Pilih ruang yang sesuai: studio untuk produksi, ruang meeting untuk diskusi, atau private room untuk fokus."}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["All", "Workspace", "Meeting Room", "Event Space", "Facilities"].map(
            (cat, i) => (
              <button
                key={i}
                className={`px-4 py-2 text-sm font-semibold rounded-full border ${
                  i === 0
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-md"
                    : "text-gray-700 border-gray-200 hover:bg-gray-50"
                } transition`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {fasilitasData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="relative">
                <LazyImage
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[220px] object-cover"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  FACILITY
                </div>
              </div>

              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>🏷️</span>
                    <span>Available</span>
                  </div>
                  <Link
                    to="/detail-layanan"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      
      {/* === LOKASI === */}
      <section
        ref={lokasiRef}
        className="relative bg-white py-16 md:py-20 px-6 md:px-20"
      >
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-[380px] rounded-3xl overflow-hidden shadow-xl border border-gray-100"
          >
            <iframe
              title="Lokasi Voxpro Hub"
              src="https://www.google.com/maps?q=Kedai%20Mantao%20Makassar&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-3xl"
            ></iframe>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {lokasi?.title || "Lokasi Kami"}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              {lokasi?.subtitle ||
                "Temukan kami di pusat kota Makassar — mudah diakses dan dekat dengan berbagai fasilitas publik."}
            </p>

            {lokasi?.button_link && (
              <a
                href={lokasi.button_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-md hover:scale-[1.01] transition-transform duration-200"
              >
                Buka di Google Maps →
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* === KONTAK === */}
      <section
        ref={kontakRef}
        className="relative bg-white text-gray-800 py-16 md:py-20 px-6 md:px-20"
      >
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {kontak.title || "Kontak Kami"}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {kontak.subtitle || "Butuh bantuan? Hubungi kami via email atau WhatsApp."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Info Kontak */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <h3 className="text-2xl font-semibold text-gray-800">Let's Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Kami siap membantu menjawab pertanyaan Anda dan memberikan informasi yang Anda butuhkan.
              </p>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                    alt="Email"
                    className="w-5 h-5 opacity-80"
                  />
                  <span>{kontak.email || "contact@example.com"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/159/159832.png"
                    alt="Phone"
                    className="w-5 h-5 opacity-80"
                  />
                  <span>{kontak.phone || "+62 852-4200-8058"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                    alt="Location"
                    className="w-5 h-5 opacity-80"
                  />
                  <span>{kontak.address || "Kedai Mantao Lt.2, Jl. Toddopuli Raya"}</span>
                </div>
              </div>

              {kontak.button_text && (
                <a
                  href={kontak.button_link || "https://wa.me/6285242008058"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-4 py-2 rounded-full shadow-md hover:scale-[1.01] transition-transform duration-200"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                    alt="WA"
                    className="w-4 h-4"
                  />
                  {kontak.button_text}
                </a>
              )}
            </motion.div>

            {/* Form Kontak */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();

                  const fullName = e.target.fullName.value;
                  const email = e.target.email.value;
                  const subject = e.target.subject.value;
                  const message = e.target.message.value;

                  // === Format pesan ke WhatsApp ===
                  const whatsappNumber = "6285242008058"; // ubah ke nomor tujuan (tanpa +)
                  const text = `*Pesan Baru dari Website Voxpro Hub*\n\n👤 *Nama:* ${fullName}\n📧 *Email:* ${email}\n📝 *Subjek:* ${subject}\n💬 *Pesan:* ${message}`;
                  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

                  window.open(url, "_blank"); // buka WhatsApp
                }}
              >
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
                  />
                </div>
                <input
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
                />
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Message"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-4 py-2 rounded-full shadow-md hover:scale-[1.01] transition-transform duration-200"
                >
                  Send Message →
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === FOOTER BARU === */}
      <footer className="bg-[#0d1224] text-gray-300 pt-12 pb-8 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <h2 className="text-2xl font-bold text-white mb-3">Voxpro Hub</h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              Mewujudkan ruang kerja modern yang mendukung kolaborasi, kreativitas, dan pertumbuhan digital di Makassar.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">📍</span> Kedai Mantao Lt.2, Jl. Toddopuli Raya, Makassar
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">📞</span> +62 813-5666-8121
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">✉️</span> info@voxprohub.com
              </li>
            </ul>
          </div>

          {/* Studio Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Studio</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection(berandaRef)} className="hover:text-blue-400 transition">Beranda</button></li>
              <li><button onClick={() => scrollToSection(fasilitasRef)} className="hover:text-blue-400 transition">Fasilitas</button></li>
              <li><button onClick={() => scrollToSection(lokasiRef)} className="hover:text-blue-400 transition">Lokasi</button></li>
              <li><button onClick={() => scrollToSection(kontakRef)} className="hover:text-blue-400 transition">Kontak</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Layanan</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Workspace Provider</li>
              <li>Event Space</li>
              <li>Meeting Room</li>
              <li>Startup Incubation</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/voxprohub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-400 transition"
                >
                  <FaInstagram /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/voxprohub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-400 transition"
                >
                  <FaFacebookF /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} <span className="text-white font-semibold">Voxpro Hub</span> — Crafted with voxprohub Makassar
          </p>
        </div>

        {/* Back to Top */}
        {showTopBtn && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full shadow-xl hover:scale-[1.03] transition-transform z-50"
            title="Kembali ke atas"
          >
            ↑
          </button>
        )}
      </footer>
    </div>
  );
}
