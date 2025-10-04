import { useState } from "react";
import api from "../Services/api";
import { Eye, EyeClosed} from "lucide-react";

export default function LoginForm() {
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#14192f] via-[#012340] to-[#0455BF]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Iniciar Sesión
        </h2>
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          onChange={handleChange}
          className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="contrasena"
            placeholder="Contraseña"
            onChange={handleChange}
            className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary w-full pr-12"
            required
            autoComplete="current-password"
          />
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-2xl cursor-pointer select-none transition-all duration-300 ${
              form.contrasena
                ? "scale-110 rotate-12"
                : "scale-100 rotate-0"
            }`}
            onClick={() => setShowPassword((v) => !v)}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword
                ? <EyeClosed/>
                : <Eye/>
              }
          </span>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2 rounded-lg shadow hover:scale-105 transition-transform"
        >
          Entrar
        </button>
        {mensaje && (
          <p className="text-center text-sm mt-2 text-white">{mensaje}</p>
        )}
      </form>
    </div>
  );
}
