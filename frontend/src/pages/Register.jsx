import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from '../services/apiServer'; // ✅ Importación corregida

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      console.log("📝 Registrando usuario...", formData);
      
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      console.log("✅ Registro exitoso:", response);

      // Guardar token y usuario en localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirigir al home
        navigate("/");
      } else {
        setError("No se recibió token de autenticación");
      }

    } catch (err) {
      console.error("❌ Error en registro:", err);
      
      // Manejar diferentes formatos de error
      if (err.message) {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrar usuario. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1128] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-[#E4D9F9]">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-[#A593C7]">
            Únete a la comunidad de Ondine
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#E4D9F9]">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA] focus:ring-1 focus:ring-[#A56BFA]"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#E4D9F9]">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA] focus:ring-1 focus:ring-[#A56BFA]"
                placeholder="tu@email.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#E4D9F9]">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA] focus:ring-1 focus:ring-[#A56BFA]"
                placeholder="Mínimo 6 caracteres"
                minLength="6"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-[#E4D9F9]">
                Confirmar Contraseña
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA] focus:ring-1 focus:ring-[#A56BFA]"
                placeholder="Repite tu contraseña"
                minLength="6"
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botón de Registro */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#7B3FE4] hover:bg-[#A56BFA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A56BFA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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