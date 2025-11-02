import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import image14 from "../assets/image14.png"; // logo

export default function DetailLayanan() {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const [layanan, setLayanan] = useState([]);
  const [selected, setSelected] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/layanan")
      .then((res) => setLayanan(res.data))
      .catch((err) => console.error("Gagal mengambil data layanan:", err));

    axios
      .get("http://localhost:5000/api/settings/hero-image")
      .then((res) => setHeroImage(res.data.image))
      .catch(() => setHeroImage(null));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] to-[#f2efec] text-gray-800 font-[Poppins] overflow-x-hidden">

      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll ? "bg-white/80 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={image14} alt="Logo" className="w-8 h-8" />
            <h1 className="font-bold text-lg text-blue-600 tracking-wide">VOXPRO HUB</h1>
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
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            open ? "max-h-64 py-4" : "max-h-0"
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

      {/* === HERO IMAGE === */}
      {heroImage && (
        <div className="relative w-full h-[480px] md:h-[520px] overflow-hidden mt-16">
          <img
            src={`http://localhost:5000/uploads/${heroImage}`}
            alt="Hero"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white text-center px-4 leading-tight drop-shadow-lg"
            >
              Inspirasi, Kreativitas, dan Kolaborasi
            </motion.h1>
          </div>
        </div>
      )}

      {/* === LAYANAN === */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-5 text-blue-600"
        >
          Layanan Kami
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center text-gray-600 italic mb-12 text-lg md:text-xl font-normal"
        >
          Ruang penuh inspirasi dan fungsi — pilih yang sesuai kebutuhanmu ↓
        </motion.p>

        <div className="flex flex-wrap justify-center gap-6">
          {layanan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelected(item)}
              className="cursor-pointer w-[270px] md:w-[290px] bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-500"
            >
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.title}
                className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="p-5 flex flex-col justify-between h-[250px]">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.title}</h3>
                  <p className="text-base text-gray-700 font-regular line-clamp-4">{item.desc}</p>
                </div>
                <button className="mt-3 text-sm text-blue-600 font-semibold hover:underline">
                  Lihat Detail →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* === MODAL DETAIL === */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 max-w-lg w-[90%] relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>
                <img
                  src={`http://localhost:5000/uploads/${selected.image}`}
                  alt={selected.title}
                  className="w-full h-[250px] object-cover rounded-xl mb-4"
                />
                <h2 className="text-2xl font-bold text-blue-600 mb-3">{selected.title}</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{selected.desc}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#fbfbfb] text-gray-700 text-center py-10 mt-16 rounded-t-3xl shadow-inner">
        <h2 className="text-2xl font-bold mb-2 tracking-wide text-blue-600">VOXPRO HUB</h2>
        <p className="text-sm md:text-base max-w-md mx-auto mb-3 font-regular leading-relaxed text-gray-600">
          Ruang untuk berkreasi, berinovasi, dan berkolaborasi — karena setiap ide layak untuk diwujudkan.
        </p>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} VoxPro Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
