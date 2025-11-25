import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../Services/api";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeClosed,
  Save,
  Shield,
  Edit,
} from "lucide-react";

function Avatar({ user }) {
  const [imageError, setImageError] = useState(false);

  if (user?.foto_perfil_url && !imageError) {
    return (
      <img
        src={user.foto_perfil_url}
        alt={user.nombre_usuario}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  }

  const iniciales = user?.nombre_usuario
    ? user.nombre_usuario.split(" ").slice(0, 2).map((n) => n.charAt(0)).join("").toUpperCase()
    : "U";

  return (
    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
      {iniciales}
    </div>
  );
}

export default function EditProfile() {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo: "",
    contrasena_actual: "",
    nueva_contrasena: "",
    confirmar_contrasena: "",
    foto_perfil: null,
  });
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("informacion");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      setUserLoading(true);
      const userData = await authAPI.getUser();
      const usuario = userData.usuario || userData;
      setUser(usuario);
      setFormData((prev) => ({
        ...prev,
        nombre_usuario: usuario.nombre_usuario || "",
        correo: usuario.correo || "",
      }));
    } catch (err) {
      console.error("Error cargando usuario:", err);
      setMessage("❌ No se pudo cargar la información del usuario");
    } finally {
      setUserLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto_perfil") {
      setFormData((prev) => ({ ...prev, foto_perfil: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validaciones básicas
    if (formData.nueva_contrasena || formData.confirmar_contrasena) {
      if (formData.nueva_contrasena.length > 0 && formData.nueva_contrasena.length < 6) {
        setMessage("❌ La nueva contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }
      if (formData.nueva_contrasena !== formData.confirmar_contrasena) {
        setMessage("❌ Las nuevas contraseñas no coinciden");
        setLoading(false);
        return;
      }
      if (!formData.contrasena_actual) {
        setMessage("❌ Debes ingresar tu contraseña actual para cambiarla");
        setLoading(false);
        return;
      }
    }

    try {
      let payload;
      const useFormData = !!formData.foto_perfil || !!formData.nueva_contrasena;

      if (useFormData) {
        payload = new FormData();
        payload.append("nombre_usuario", formData.nombre_usuario);
        payload.append("correo", formData.correo);
        if (formData.contrasena_actual) payload.append("contrasena_actual", formData.contrasena_actual);
        if (formData.nueva_contrasena) payload.append("nueva_contrasena", formData.nueva_contrasena);
        if (formData.foto_perfil) payload.append("foto_perfil", formData.foto_perfil);
      } else {
        payload = {
          nombre_usuario: formData.nombre_usuario,
          correo: formData.correo,
        };
      }

      await authAPI.updateProfile(payload);
      setMessage("✅ Perfil actualizado correctamente");
      // refrescar datos mostrados
      await cargarUsuario();
      setTimeout(() => navigate("/perfil"), 1000);
    } catch (err) {
      console.error("❌ Error actualizando perfil:", err);
      setMessage(`❌ ${err.message || "Error al actualizar el perfil"}`);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header similar a Profile */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#2E1A3A] to-[#1B0E2A] rounded-full overflow-hidden flex items-center justify-center">
                <div className="w-full h-full">
                  <Avatar user={user} />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                Editar: {user?.nombre_usuario || "Usuario"}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 text-[#A593C7] mb-4">
                <Mail size={16} />
                <span>{user?.correo || "No especificado"}</span>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-[#7B3FE4]/20 px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="text-[#A56BFA] font-bold">
                    {user?.reputacion ?? 0}
                  </span>
                  <span className="text-[#A593C7]">Reputación</span>
                </div>

                <div className="bg-[#7B3FE4]/20 px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="text-[#A593C7]">
                    Miembro desde{" "}
                    {user?.creado_en
                      ? new Date(user.creado_en).toLocaleDateString("es-ES")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/perfil")}
                className="flex items-center gap-2 bg-transparent border border-[#7B3FE4] text-[#7B3FE4] px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft size={16} /> Volver
              </button>
              <button
                form="editar-perfil-form"
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save size={16} /> Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Tabs (igual que en Profile) */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 mb-8 p-3">
          <div className="md:hidden mb-3">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full bg-[#1b1530] text-[#E4D9F9] p-2 rounded-md border border-[#3b2853]/30"
            >
              <option value="informacion">Información Personal</option>
              <option value="seguridad">Seguridad</option>
            </select>
          </div>

          <div className="hidden md:flex flex-wrap gap-2 justify-center md:justify-start">
            {[
              { id: "informacion", label: "Información Personal", icon: User },
              { id: "seguridad", label: "Seguridad", icon: Shield },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors border ${
                    activeSection === section.id
                      ? "bg-[#7B3FE4]/10 border-[#A56BFA] text-[#A56BFA]"
                      : "bg-transparent border-transparent text-[#A593C7] hover:bg-[#7B3FE4]/5 hover:text-[#E4D9F9]"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form container */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8">
          <form id="editar-perfil-form" onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  message.includes("✅")
                    ? "bg-green-900/20 border-green-700 text-green-400"
                    : "bg-red-900/20 border-red-700 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            {/* Información */}
            {activeSection === "informacion" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#E4D9F9] mb-2">Nombre de Usuario</label>
                  <input
                    name="nombre_usuario"
                    value={formData.nombre_usuario}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
                    minLength="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E4D9F9] mb-2">Correo Electrónico</label>
                  <input
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#E4D9F9] mb-2">Foto de Perfil (opcional)</label>
                  <input
                    type="file"
                    name="foto_perfil"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
                  />
                </div>
              </div>
            )}

            {/* Seguridad */}
            {activeSection === "seguridad" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#E4D9F9] mb-2">Contraseña Actual</label>
                  <div className="relative">
                    <input
                      name="contrasena_actual"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.contrasena_actual}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A56BFA]"
                      disabled={loading}
                    >
                      {showCurrentPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E4D9F9] mb-2">Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      name="nueva_contrasena"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.nueva_contrasena}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A56BFA]"
                      disabled={loading}
                    >
                      {showNewPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E4D9F9] mb-2">Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      name="confirmar_contrasena"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmar_contrasena}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4]"
                      placeholder="Repite tu nueva contraseña"
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A56BFA]"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="bg-[#7B3FE4]/20 p-4 rounded-lg">
                  <p className="text-[#A593C7] text-sm">
                    <strong>Nota:</strong> Para cambiar tu contraseña, debes ingresar tu contraseña actual y luego la nueva contraseña dos veces.
                  </p>
                </div>
              </div>
            )}

            {/* Acción principal (visible en mobile) */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/perfil")}
                disabled={loading}
                className="px-6 py-3 border border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4] hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6L] text-white font-medium px-6 py-3 rounded-lg transition-colors flex-1 justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#A593C7] text-sm">
            ¿Necesitas ayuda?{" "}
            <Link to="/soporte" className="text-[#A56BFA] hover:underline">
              Contacta con soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}