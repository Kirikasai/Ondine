import { useState } from "react";
import { authAPI } from "../Services/api";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar mensaje de error cuando el usuario empiece a escribir
    if (mensaje) setMensaje("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!form.correo || !form.contrasena) {
      setMensaje("❌ Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      console.log("🔄 Iniciando proceso de login...");
      
      const res = await authAPI.login(form);
      
      console.log("✅ Login exitoso:", res);
      
      //  Guardar token con clave consistente (usa 'token', no 'auth_token')
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('auth_token', res.token); // backup para compatibilidad
        if (res.usuario) {
          localStorage.setItem('user', JSON.stringify(res.usuario));
        }
      }

      setMensaje("✅ Sesión iniciada correctamente");
      
      setTimeout(() => {
        window.location.href = "/perfil"; // fuerza recarga para que Header se actualice
      }, 500);
      
    } catch (err) {
      console.error("❌ Error completo en login:", err);
      
      let errorMessage = "Error al iniciar sesión";
      
      if (err.message && (err.message.includes("401") || err.message.includes("Credenciales"))) {
        errorMessage = "❌ Correo o contraseña incorrectos";
      } else if (err.message && (err.message.includes("Network") || err.message.includes("conexión"))) {
        errorMessage = "❌ Error de conexión. Verifica tu internet.";
      } else {
        errorMessage = `❌ ${err.message || 'Error desconocido'}`;
      }
      
      setMensaje(errorMessage);
    } finally {
      setLoading(false);
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

        <div className="space-y-4">
          <div>
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#E4D9F9]/10 border border-[#A56BFA]/30 text-[#E4D9F9] placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-[#E4D9F9]/10 border border-[#A56BFA]/30 text-[#E4D9F9] placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] focus:border-transparent"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A56BFA] hover:text-[#7B3FE4] transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              disabled={loading}
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6B] text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Iniciando sesión...
            </>
          ) : (
            "Entrar"
          )}
        </button>

        {mensaje && (
          <p className={`text-center text-sm mt-2 ${
            mensaje.includes("✅") ? "text-green-400" : "text-red-400"
          }`}>
            {mensaje}
          </p>
        )}

        <div className="text-center">
          <p className="text-[#A593C7] text-sm">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#A56BFA] hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

