import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from '../Services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo: "",
    contrasena: "",
    contrasena_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones del frontend
    if (formData.contrasena !== formData.contrasena_confirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (formData.nombre_usuario.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);

    try {
      console.log("📝 Registrando usuario:", formData);

      const response = await authAPI.register(formData);

      console.log("✅ Registro exitoso:", response);

      // Mostrar mensaje de éxito
      setError("✅ Cuenta creada exitosamente! Redirigiendo...");

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error("❌ Error en registro:", err);
      
      let errorMessage = "Error al registrar usuario";
      
      if (err.message) {
        // Manejar diferentes tipos de errores
        if (err.message.includes("422") || err.message.includes("validation")) {
          errorMessage = "Datos inválidos. Verifica la información.";
        } else if (err.message.includes("409") || err.message.includes("unique")) {
          errorMessage = "El nombre de usuario o correo ya está en uso";
        } else if (err.message.includes("Network") || err.message.includes("conexión")) {
          errorMessage = "Error de conexión. Verifica tu internet.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1128] via-[#2D1B3A] to-[#7B3FE4] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#E4D9F9]">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-[#A593C7]">
            Únete a la comunidad de Ondine
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6 bg-[#2D1B3A]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#7B3FE4]/30" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nombre de Usuario */}
            <div>
              <label htmlFor="nombre_usuario" className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Nombre de Usuario
              </label>
              <input
                id="nombre_usuario"
                name="nombre_usuario"
                type="text"
                required
                value={formData.nombre_usuario}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] focus:border-transparent transition-colors"
                placeholder="Tu nombre de usuario"
                minLength="3"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Correo electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                required
                value={formData.correo}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] focus:border-transparent transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Contraseña
              </label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                required
                value={formData.contrasena}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] focus:border-transparent transition-colors"
                placeholder="Mínimo 6 caracteres"
                minLength="6"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="contrasena_confirmation" className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Confirmar Contraseña
              </label>
              <input
                id="contrasena_confirmation"
                name="contrasena_confirmation"
                type="password"
                required
                value={formData.contrasena_confirmation}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] focus:border-transparent transition-colors"
                placeholder="Repite tu contraseña"
                minLength="6"
              />
            </div>
          </div>

          {/* Mensaje de Error/Éxito */}
          {error && (
            <div className={`px-4 py-3 rounded-lg text-sm border ${
              error.includes("✅") 
                ? "bg-green-900/20 border-green-700 text-green-400" 
                : "bg-red-900/20 border-red-700 text-red-400"
            }`}>
              {error}
            </div>
          )}

          {/* Botón de Registro */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6B] text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </div>

          {/* Enlace a Login */}
          <div className="text-center">
            <p className="text-sm text-[#A593C7]">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-[#A56BFA] hover:text-[#7B3FE4] transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}