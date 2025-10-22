import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Assets (fallback / default image jika tidak ada di DB)
import image13 from "./assets/image13.png";
import image14 from "./assets/image14.png";
import line39 from "./assets/line39.png";
import fasilitas1 from "./assets/fasilitas1.png";
import fasilitas2 from "./assets/fasilitas2.png";
import fasilitas3 from "./assets/fasilitas3.png";
import kontak1 from "./assets/kontak1.png";
import SHAPEGradasi from "./assets/shape-gradasi.png";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const logoRef = useRef(null);

  const [hero, setHero] = useState({});
  const [visi, setVisi] = useState({});
  const [fasilitas, setFasilitas] = useState({});
  const [lokasi, setLokasi] = useState({});
  const [kontak, setKontak] = useState({});

  const berandaRef = useRef(null);
  const fasilitasRef = useRef(null);
  const lokasiRef = useRef(null);
  const kontakRef = useRef(null);

  // === Efek perubahan scroll navbar ===
  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === Ambil konten dari API ===
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/landing")
      .then((res) => {
        const data = res.data;
        setHero(data.find((item) => item.section === "hero") || {});
        setVisi(data.find((item) => item.section === "visi") || {});
        setFasilitas(data.find((item) => item.section === "fasilitas") || {});
        setLokasi(data.find((item) => item.section === "lokasi") || {});
        setKontak(data.find((item) => item.section === "kontak") || {});
      })
      .catch((err) => console.error("Gagal memuat landing content:", err));
  }, []);

  // === Fungsi scroll ke section tertentu ===
  const scrollToSection = (ref) => {
    setOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white text-gray-800 overflow-x-hidden"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll ? "bg-white/80 shadow-xl backdrop-blur-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={image14} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10" />
            <h1 className="font-extrabold tracking-wide text-lg sm:text-xl md:text-2xl text-orange-600">
              VOXPRO HUB
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center font-medium text-gray-700">
            <button onClick={() => scrollToSection(berandaRef)} className="hover:text-orange-500 transition">Beranda</button>
            <button onClick={() => scrollToSection(fasilitasRef)} className="hover:text-orange-500 transition">Fasilitas</button>
            <button onClick={() => scrollToSection(lokasiRef)} className="hover:text-orange-500 transition">Lokasi</button>
            <button onClick={() => scrollToSection(kontakRef)} className="hover:text-orange-500 transition">Kontak</button>

            <div className="flex gap-3 ml-4">
              <Link to="/login" className="px-4 py-1.5 text-sm rounded-full border border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white transition">
                Masuk
              </Link>
              <Link to="/register" className="px-4 py-1.5 text-sm rounded-full bg-orange-500 text-white hover:bg-orange-600 shadow-md transition">
                Daftar
              </Link>
            </div>
          </div>

          {/* Mobile Button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden bg-white/95 backdrop-blur-md overflow-hidden transition-all duration-500 ${
            open ? "max-h-80 py-5" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-gray-700 font-medium text-sm">
            <button onClick={() => scrollToSection(berandaRef)} className="hover:text-orange-600 transition">Beranda</button>
            <button onClick={() => scrollToSection(fasilitasRef)} className="hover:text-orange-600 transition">Fasilitas</button>
            <button onClick={() => scrollToSection(lokasiRef)} className="hover:text-orange-600 transition">Lokasi</button>
            <button onClick={() => scrollToSection(kontakRef)} className="hover:text-orange-600 transition">Kontak</button>
            <Link to="/login" className="px-5 py-1.5 border border-orange-400 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition">Masuk</Link>
            <Link to="/register" className="px-5 py-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition">Daftar</Link>
          </div>
        </div>
      </nav>

      {/* === HERO SECTION === */}
      <section
        ref={berandaRef}
        className="relative bg-white overflow-visible"
        style={{
          backgroundImage: `url(${hero.image || SHAPEGradasi})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-6 md:px-10 pt-28 md:pt-36 pb-16">
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
              {hero.title || "Judul default hero"}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed drop-shadow-sm">
              {hero.subtitle || "Deskripsi hero default"}
            </p>
            <div className="inline-block mt-4">
              <Link
                to={hero.button_link || "/booking"}
                className="inline-flex items-center px-6 py-3 rounded-full bg-orange-600 text-white font-semibold shadow-md hover:shadow-xl hover:-translate-y-[2px] transition transform"
              >
                {hero.button_text || "Booking Sekarang"}
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              ref={logoRef}
              src={image13}
              alt="Voxpro Hub"
              className="w-[80%] sm:w-[70%] md:w-[90%] max-w-md drop-shadow-2xl transition hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* === VISI === */}
      <section className="bg-white py-16 text-center px-6 md:px-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{visi.title || "Visi Kami"}</h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          {visi.subtitle || "Deskripsi visi default."}
        </p>
        <img src={line39} alt="Line" className="mx-auto w-3/4 sm:w-2/3 lg:w-1/2 h-1.5 mt-6 opacity-70" />
      </section>

      {/* === LOKASI (MAPS) === */}
      <section
        ref={lokasiRef}
        id="maps"
        className="bg-gradient-to-r from-orange-100 to-yellow-50 py-16 px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center scroll-mt-28"
      >
        <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-3xl shadow-2xl overflow-hidden">
          <iframe
            title="Lokasi Voxpro Hub"
            src="https://www.google.com/maps?q=Kedai%20Mantao%20Makassar&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Lokasi Ruangan</h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Terletak di kawasan strategis dengan akses mudah, parkir luas, serta dikelilingi kafe dan ATM.
          </p>
          <a
            href="https://www.google.com/maps/place/Kedai+Mantao+Makassar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-medium underline hover:text-orange-800 transition"
          >
            Buka di Google Maps →
          </a>
        </div>
      </section>

      {/* === FASILITAS === */}
      <section
        ref={fasilitasRef}
        className="bg-white py-16 text-center px-6 md:px-12 lg:px-20"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          {fasilitas.title || "Fasilitas Kami"}
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          {fasilitas.subtitle || "Kami menyediakan berbagai fasilitas untuk kebutuhan Anda."}
        </p>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {[fasilitas1, fasilitas2, fasilitas3].map((img, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-orange-50 via-yellow-50 to-white rounded-3xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col items-center"
            >
              <img
                src={img}
                alt={`Fasilitas ${i + 1}`}
                className="w-full h-[200px] object-cover rounded-2xl mb-5"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {["Studio", "Medium Room", "Small Room"][i]}
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {[
                  "Cocok untuk podcast atau video dengan pencahayaan profesional.",
                  "Ideal untuk diskusi kecil dengan fasilitas modern.",
                  "Nyaman untuk meeting privat atau sesi kerja fokus.",
                ][i]}
              </p>
              <Link
                to="/detail-layanan"
                className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-2 rounded-full text-sm hover:scale-105 transition transform"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* === KONTAK === */}
      <section
        ref={kontakRef}
        className="relative bg-gradient-to-r from-orange-400 to-yellow-400 py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 text-white overflow-hidden"
      >
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-3xl font-bold leading-snug drop-shadow-md">
            {kontak.title || "Siap membantu Anda dalam pemesanan ruang"}
          </h2>
          <p className="text-white/90 text-sm sm:text-base drop-shadow-sm">
            {kontak.subtitle || "Hubungi kami melalui WhatsApp atau Instagram resmi Voxpro Hub."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-4">
            <a
              href={kontak.button_link || "https://wa.me/6285242008058"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-gray-100 flex items-center gap-2 transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                alt="WhatsApp"
                className="w-5 h-5"
              />
              {kontak.button_text || "Hubungi Kami"}
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img
            src={kontak.image || kontak1}
            alt="Kontak"
            className="w-full max-w-xs sm:max-w-sm rounded-3xl drop-shadow-2xl hover:scale-105 transition duration-500"
          />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-white pt-14 pb-8 px-6 md:px-16 border-t border-gray-200 mt-16 text-center md:text-left text-[13px] text-gray-600">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <img src={image14} alt="Logo" className="w-8 h-8" />
              <h2 className="font-bold text-lg text-orange-600">VOXPRO HUB</h2>
            </div>
            <p>
              Kedai Mantao Lt.2, Jl. Toddopuli Raya, <br /> Makassar, Sulawesi Selatan 90231
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-800 uppercase tracking-wide">
              Kontak
            </h3>
            <p>Marketing</p>
            <p>+62 813-5666-8121 (WA/Call)</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-800 uppercase tracking-wide">
              Navigasi
            </h3>
            <button onClick={() => scrollToSection(berandaRef)} className="block hover:text-orange-600 transition">
              Beranda
            </button>
            <button onClick={() => scrollToSection(lokasiRef)} className="hover:text-orange-600 transition">
              Lokasi
            </button>
            <button onClick={() => scrollToSection(fasilitasRef)} className="block hover:text-orange-600 transition">
              Fasilitas
            </button>
            <button onClick={() => scrollToSection(kontakRef)} className="block hover:text-orange-600 transition">
              Kontak
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Web Designer & Workspace Provider di Makassar | Voxpro Hub © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
