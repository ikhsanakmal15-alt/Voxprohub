import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ Tambahkan ini
import image14 from "../assets/image14.png"; // Logo Voxpro Hub

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Semua kolom wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Pendaftaran berhasil! Silakan login.");
        navigate("/login");
      } else {
        alert(data.message || "Gagal mendaftar");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Efek blur dan bayangan seperti di login */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/40 blur-3xl rounded-full shadow-[0_0_50px_rgba(0,0,0,0.1)]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gray-300/30 blur-3xl rounded-full shadow-[0_0_60px_rgba(0,0,0,0.1)]"></div>
      <div className="relative bg-white/70 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-10 w-full max-w-md transform transition-all hover:shadow-[0_10px_50px_rgba(0,0,0,0.15)] hover:scale-[1.01]">


        {/* Header */}
        <div className="flex flex-col items-center mb-8 mt-6">
          <img src={image14} alt="Logo Voxpro Hub" className="w-16 h-16 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            VOXPRO HUB
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Buat akun baru untuk melanjutkan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-800 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-800 transition-transform duration-200 hover:scale-110"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Konfirmasi Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-800 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-800 transition-transform duration-200 hover:scale-110"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl shadow-md hover:bg-gray-900 hover:shadow-lg transition transform hover:-translate-y-1"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-gray-800 hover:underline font-semibold"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
}
