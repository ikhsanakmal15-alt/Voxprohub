import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LokasiDanFooter() {
  return (
    <div className="w-full">
      {/* === MAPS === */}
      <section
        id="maps"
        className="bg-gradient-to-r from-orange-100 to-yellow-50 py-16 px-6 md:px-16 
                   grid grid-cols-1 md:grid-cols-2 gap-10 items-center scroll-mt-28"
      >
        {/* Peta Lokasi */}
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

        {/* Deskripsi Lokasi */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Lokasi Ruangan
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Terletak di kawasan strategis dengan akses mudah, parkir luas, serta
            dikelilingi kafe dan ATM.
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

      {/* === FOOTER === */}
      <footer className="bg-[#fbfbfb] text-gray-700 text-center py-10 mt-16 rounded-t-3xl shadow-inner">
        <h2 className="text-lg font-semibold mb-2 tracking-wide text-[#b85c2c]">
          VOXPRO HUB
        </h2>
        <p className="text-sm max-w-md mx-auto mb-3">
          Ruang untuk berkreasi, berinovasi, dan berkolaborasi — karena setiap
          ide layak untuk diwujudkan.
        </p>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} VoxPro Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
