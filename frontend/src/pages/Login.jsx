import { useState } from "react";
import api from "../services/apiServer";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginForm() {
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      setMensaje("✅ Sesión iniciada");
    } catch (err) {
      setMensaje("❌ Error: " + (err.response?.data?.error || "Error en login"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B1128] via-[#2D1B3A] to-[#7B3FE4]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#2D1B3A]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-[#7B3FE4]/30"
      >
        <h2 className="text-3xl font-bold text-[#E4D9F9] text-center mb-2">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          onChange={handleChange}
          className="px-4 py-2 rounded-md bg-[#E4D9F9]/10 border border-[#A56BFA]/30 text-[#E4D9F9] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="contrasena"
            placeholder="Contraseña"
            onChange={handleChange}
            className="px-4 py-2 w-full pr-12 rounded-md bg-[#E4D9F9]/10 border border-[#A56BFA]/30 text-[#E4D9F9] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
            required
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A56BFA] cursor-pointer"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white font-bold py-2 rounded-md shadow-lg transition-all"
        >
          Entrar
        </button>

        {mensaje && (
          <p className="text-center text-sm mt-2 text-[#A593C7]">{mensaje}</p>
        )}
      </form>
    </div>
  );
}

