import { useState } from "react";
import api from "../Services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({ nombre_usuario: "", correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/registro", form);
      setMensaje("✅ Usuario registrado correctamente");
    } catch (err) {
      setMensaje("❌ Error: " + (err.response?.data?.error || "Error al registrar"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#14192f] via-[#012340] to-[#0455BF]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">Registro</h2>
        <input
          type="text"
          name="nombre_usuario"
          placeholder="Usuario"
          onChange={handleChange}
          className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          onChange={handleChange}
          className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          onChange={handleChange}
          className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2 rounded-lg shadow hover:scale-105 transition-transform"
        >
          Registrarse
        </button>
        {mensaje && (
          <p className="text-center text-sm mt-2 text-white">{mensaje}</p>
        )}
      </form>
    </div>
  );
}
