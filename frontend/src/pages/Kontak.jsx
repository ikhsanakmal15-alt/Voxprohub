import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/image14.png"; // Ganti sesuai logo kamu

export default function Contact() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4ff] text-gray-800 font-[Poppins] overflow-x-hidden">
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll ? "bg-white/80 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src={logo}
              alt="VoxPro Hub"
              className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <h1 className="font-semibold text-lg md:text-xl text-blue-600 tracking-wide">
              VOXPRO HUB
            </h1>
          </div>

          {/* Menu Desktop */}
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
                className={`relative hover:text-blue-600 transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 ${
                  item.name === "Kontak" ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Menu Mobile */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden bg-white/90 backdrop-blur-md overflow-hidden transition-all duration-500 ${
            open ? "max-h-56 py-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-gray-700 font-medium text-sm">
            {["Beranda", "Booking", "Fasilitas", "Kontak"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="hover:text-blue-600 transition"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* === BAGIAN UTAMA === */}
      <section className="flex flex-col items-center justify-center px-6 md:px-24 pt-36 pb-20 max-w-5xl w-full mx-auto text-center relative min-h-[calc(100vh-80px)]">
        {/* Subjudul */}
        <div className="flex items-center gap-3 mb-4 justify-center">
          <div className="w-12 h-[2px] bg-blue-600"></div>
          <p className="text-gray-700 font-semibold text-lg">Kami Siap Membantu Anda</p>
        </div>

        {/* Judul Utama */}
        <h1 className="text-5xl md:text-6xl font-bold leading-snug mb-6 text-gray-900 drop-shadow-sm">
          Hubungi Kami untuk Pemesanan, <br />
          Pertanyaan Fasilitas, atau Kolaborasi Bisnis
        </h1>

        {/* Deskripsi */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
          Tim kami siap memberikan informasi dan dukungan terbaik untuk setiap
          kebutuhan Anda. Jangan ragu untuk menghubungi kami melalui media di bawah ini.
        </p>

        {/* Tombol & Kontak */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
          <a
            href="https://wa.me/6285242008058"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition transform hover:-translate-y-1 hover:scale-105"
          >
            <FaWhatsapp className="text-2xl" />
            Hubungi Kami
          </a>

          <p className="text-gray-700 text-base md:text-lg">
            Ikuti kami di{" "}
            <a
              href="https://instagram.com/voxprohub"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              @voxprohub
            </a>
          </p>
        </div>

        <div className="mt-6 text-gray-600 flex items-center gap-3 justify-center">
          <FaEnvelope className="text-blue-600 text-xl" />
          <span className="text-sm md:text-base">
            Email:{" "}
            <a
              href="mailto:voxprohub@gmail.com"
              className="underline hover:text-blue-700"
            >
              voxprohub@gmail.com
            </a>
          </span>
        </div>

        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10"></div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#f0f4ff] text-gray-700 text-center py-10 w-full rounded-t-3xl shadow-inner font-[Poppins]">
        <h2 className="text-lg font-semibold mb-2 tracking-wide text-blue-600">
          VOXPRO HUB
        </h2>
        <p className="text-sm max-w-md mx-auto mb-3">
          Ruang untuk berkreasi, berinovasi, dan berkolaborasi — karena setiap
          ide layak untuk diwujudkan.
        </p>
        <div className="flex justify-center gap-5 text-gray-500 text-lg mb-2">
          <a
            href="https://instagram.com/voxprohub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/6285242008058"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            <FaWhatsapp />
          </a>
          <a
            href="mailto:voxprohub@gmail.com"
            className="hover:text-blue-600 transition"
          >
            <FaEnvelope />
          </a>
        </div>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} VoxPro Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
