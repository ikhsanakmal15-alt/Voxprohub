import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔹 Import semua halaman
import LandingPage from "./landingPage";
import Fasilitas from "./pages/Fasilitas";
import Lokasi from "./pages/Lokasi";
import Booking from "./pages/Booking";
import Kontak from "./pages/Kontak";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DetailLayanan from "./pages/detail-layanan";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";


// 🔹 Import style
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🌐 Redirect root ke login atau home */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Halaman publik */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/fasilitas" element={<Fasilitas />} />
        <Route path="/lokasi" element={<Lokasi />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detail-layanan" element={<DetailLayanan />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* 🌐 Redirect fallback jika route tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
