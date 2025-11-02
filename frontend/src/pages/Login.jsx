import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import image14 from "../assets/image14.png";
import googleLogo from "../assets/google-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // === ADMIN LOGIN KONFIGURASI ===
  const ADMIN_EMAIL = "voxprohub@gmail.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    // === LOGIN ADMIN LOKAL ===
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      alert("Login berhasil sebagai Admin!");
      localStorage.setItem("role", "admin");
      localStorage.setItem("name", "Administrator");
      navigate("/admin-dashboard");
      return;
    }

    // === LOGIN USER BIASA VIA API ===
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const userRole = data.role || "user"; // fallback jika role tidak ada
        alert(`Login berhasil sebagai ${userRole}!`);

        // Simpan data ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("name", data.name);

        // Arahkan berdasarkan role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login gagal!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server!");
    }
  };

  // === LOGIN GOOGLE (SIMULASI) ===
  const handleGoogleSignIn = () => {
    alert("Login dengan Google berhasil (simulasi)!");
    localStorage.setItem("role", "user");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden">
      {/* Efek blur lembut */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>

      {/* Efek bayangan 3D halus */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/40 blur-3xl rounded-full shadow-[0_0_50px_rgba(0,0,0,0.1)]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gray-300/30 blur-3xl rounded-full shadow-[0_0_60px_rgba(0,0,0,0.1)]"></div>

      {/* Card Login */}
      <div className="relative bg-white/70 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-10 w-full max-w-md transform transition-all hover:shadow-[0_10px_50px_rgba(0,0,0,0.15)] hover:scale-[1.01]">

        {/* Header */}
        <div className="flex flex-col items-center mb-8 mt-6">
          <img src={image14} alt="Logo Voxpro Hub" className="w-16 h-16 mb-3 drop-shadow-sm" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            VOXPRO HUB
          </h1>
          <p className="text-gray-500 text-sm mt-1">Silakan masuk ke akun Anda</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:outline-none pr-10 text-gray-800"
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

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl shadow-md hover:bg-gray-900 hover:shadow-lg transition transform hover:-translate-y-1"
          >
            Masuk
          </button>
        </form>

        {/* Pemisah */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">atau</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
        >
          <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
          <span className="text-gray-700 font-medium">Masuk dengan Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-gray-800 hover:underline font-semibold"
          >
            Daftar Sekarang
          </button>
        </p>
      </div>
    </div>
  );
}
