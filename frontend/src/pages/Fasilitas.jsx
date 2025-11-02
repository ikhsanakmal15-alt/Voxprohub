import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import podcastRoom from "../assets/podcast-room.png";
import creativeStudio from "../assets/creative-studio.png";
import smallRoom from "../assets/small-room.png";
import meetingRoom from "../assets/meeting-room.png";
import loungeArea from "../assets/lounge-area.png";
import image14 from "../assets/image14.png";

export default function DetailLayanan() {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const layanan = [
    {
      id: 1,
      title: "Podcast Room",
      desc: "Ruang kedap suara eksklusif dengan mikrofon profesional dan pencahayaan lembut. Didesain untuk konten kreator, musisi, dan siapa pun yang ingin menghadirkan suara berkualitas tinggi dalam suasana nyaman.",
      image: podcastRoom,
    },
    {
      id: 2,
      title: "Creative Studio",
      desc: "Studio kreatif dengan pencahayaan adjustable, backdrop premium, serta area kerja fleksibel. Ideal untuk ide besar, photoshoot, atau video produksi profesional.",
      image: creativeStudio,
    },
    {
      id: 3,
      title: "Lounge Area",
      desc: "Tempat istirahat bergaya modern dengan aroma kopi hangat dan desain estetis. Diciptakan untuk kolaborasi santai, diskusi ringan, dan inspirasi tanpa tekanan.",
      image: loungeArea,
    },
    {
      id: 4,
      title: "Small Room",
      desc: "Ruang privat kecil namun fungsional, memberikan ketenangan bagi mereka yang fokus bekerja. Dilengkapi pencahayaan hangat dan kenyamanan optimal.",
      image: smallRoom,
    },
    {
      id: 5,
      title: "Meeting Room",
      desc: "Ruang rapat modern dengan tata ruang elegan dan konektivitas lancar. Tempat terbaik untuk merancang strategi dan mengambil keputusan besar.",
      image: meetingRoom,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4ff] text-gray-800 font-[Poppins] overflow-x-hidden">
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scroll ? "bg-white/80 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={image14} alt="Logo" className="w-8 h-8" />
            <h1 className="font-semibold text-lg text-blue-600 tracking-wide">
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
                  item.name === "Fasilitas" ? "text-blue-600 font-semibold" : ""
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

      {/* === HERO === */}
      <section className="relative h-[480px] md:h-[560px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent z-10" />
        <img
          src={podcastRoom}
          alt="Hero Background"
          className="object-cover w-full h-full brightness-90"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold tracking-wide drop-shadow-lg leading-tight"
          >
            Inspirasi, Kreativitas, dan Kolaborasi
          </motion.h1>
          <p className="mt-5 text-lg md:text-xl max-w-2xl text-gray-200 font-medium">
            Temukan ruang yang dirancang untuk mendukung setiap ide besar dan proses kreatifmu.
          </p>
        </div>
      </section>

      {/* === SHOWCASE === */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center text-gray-600 italic mb-12 text-sm"
        >
          Ruang penuh inspirasi dan fungsi — pilih yang sesuai kebutuhanmu ↓
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {layanan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              }}
              className="w-[260px] md:w-[280px] bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-500 hover:bg-[#e8f0ff]"
            >
              <div className="p-5 flex flex-col justify-between h-[520px]">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[280px] object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#e6edff] text-gray-700 text-center py-10 mt-16 rounded-t-3xl shadow-inner font-[Poppins]">
        <h2 className="text-lg font-semibold mb-2 tracking-wide text-blue-600">
          VOXPRO HUB
        </h2>
        <p className="text-sm max-w-md mx-auto mb-3">
          Ruang untuk berkreasi, berinovasi, dan berkolaborasi — karena setiap ide layak untuk diwujudkan.
        </p>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} VoxPro Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
