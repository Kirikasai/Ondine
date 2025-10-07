import { useState } from "react";
import api from "../Services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    contrasena: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      setMensaje("✅ Registro exitoso. ¡Bienvenido a Ondine!");
    } catch (err) {
      setMensaje("❌ Error: " + (err.response?.data?.error || "Error en registro"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B1128] via-[#2D1B3A] to-[#7B3FE4]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#2D1B3A]/90 rounded-2xl p-8 shadow-xl flex flex-col gap-6 border border-[#7B3FE4]/30"
      >
        <h2 className="text-3xl font-bold text-center text-[#E4D9F9] mb-2">
          Crear Cuenta
        </h2>

        <input
          type="text"
          name="nombre_usuario"
          placeholder="Nombre de usuario"
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md bg-[#E4D9F9]/10 border border-[#A56BFA]/30 text-[#E4D9F9] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md bg-[#E4D9F9]/10 border border-[#A56BFA]/30 text-[#E4D9F9] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
        />

        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md bg-[#E4D9F9]/10 border border-[#A56BFA]/30 text-[#E4D9F9] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
        />

        <button
          type="submit"
          className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white font-bold py-2 rounded-md shadow-md transition"
        >
          Registrarse
        </button>

        {mensaje && (
          <p className="text-center text-sm mt-2 text-[#A593C7]">{mensaje}</p>
        )}
      </form>
    </div>
  );
}
