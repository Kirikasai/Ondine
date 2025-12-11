import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../Services/api";
import {
  User,
  Edit,
  LogOut,
  Bookmark,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Award,
  Mail,
  Star,
  Clock,
  Radio, 
  Twitch, 
  Youtube 
} from "lucide-react";

function Avatar({ user, size = 128 }) {
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
    ? user.nombre_usuario.split(' ').slice(0,2).map(n => n.charAt(0)).join('').toUpperCase()
    : "U";

  return (
    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
      {iniciales}
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("perfil");
  const [stats, setStats] = useState({
    blogs: 0,
    guias: 0,
    hilos: 0,
    respuestas: 0,
    favoritos: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Cargando información del usuario...");
      const response = await authAPI.getUser();

      // Manejar diferentes estructuras de respuesta
      const userData = response.usuario || response.data || response;
      console.log("📊 Datos del usuario recibidos:", userData);

      if (!userData) {
        throw new Error("No se recibieron datos del usuario");
      }

      setUser(userData);

      // Cargar estadísticas (en una implementación real, esto vendría del backend)
      cargarEstadisticas(userData.id);
    } catch (err) {
      console.error("❌ Error cargando usuario:", err);
      let errorMsg = "No se pudo cargar la información del usuario";

      if (
        err.message?.includes("401") ||
        err.message?.includes("autenticado")
      ) {
        errorMsg = "Sesión expirada. Por favor, inicia sesión nuevamente.";
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async (userId) => {
    try {
      // Simular carga de estadísticas
      setStats({
        blogs: 12,
        guias: 5,
        hilos: 8,
        respuestas: 23,
        favoritos: 7,
      });
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
      // valores por defecto si hay error
      setStats({
        blogs: 0,
        guias: 0,
        hilos: 0,
        respuestas: 0,
        favoritos: 0,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Error en logout:", err);
      // Forzar logout incluso si hay error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto mb-4"></div>
          <p className="text-[#A593C7]">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={cargarUsuario}
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4] hover:text-white px-6 py-2 rounded-lg transition-colors"
            >
              Ir al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            No se encontró información del usuario
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del Perfil */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#2E1A3A] to-[#1B0E2A] rounded-full overflow-hidden flex items-center justify-center">
                <div className="w-full h-full">
                  <Avatar user={user} />
                </div>
              </div>
            </div>
            {/* Información del Usuario */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.nombre_usuario || "Usuario"}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 text-[#A593C7] mb-4">
                <Mail size={16} />
                <span>{user.correo || "No especificado"}</span>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-[#7B3FE4]/20 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Star size={16} className="text-[#A56BFA]" />
                  <span className="text-[#A56BFA] font-bold">
                    {user.reputacion || 0}
                  </span>
                  <span className="text-[#A593C7]">Reputación</span>
                </div>

                <div className="bg-[#7B3FE4]/20 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Clock size={16} className="text-[#A56BFA]" />
                  <span className="text-[#A593C7]">
                    Miembro desde{" "}
                    {user.creado_en
                      ? new Date(user.creado_en).toLocaleDateString("es-ES")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/editar-perfil")}
                className="flex items-center gap-2 bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit size={16} />
                Editar Perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Navegación por Pestañas */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 mb-8 p-3">
          {/* Mobile: select limpio */}
          <div className="md:hidden mb-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-[#1b1530] text-[#E4D9F9] p-2 rounded-md border border-[#3b2853]/30"
            >
              <option value="perfil">Perfil</option>
              <option value="blogs">Mis Blogs</option>
              <option value="guias">Mis Guías</option>
              <option value="foros">Foros</option>
              <option value="favoritos">Favoritos</option>
              <option value="clanes">Clanes</option>
              <option value="eventos">Eventos</option>
              <option value="directos">Mis Directos</option>
              <option value="configuracion">Configuración</option>
            </select>
          </div>

          {/* Desktop / Tablet: pestañas sin scroll, wrap multi-fila */}
          <div className="hidden md:flex flex-wrap gap-2 justify-center md:justify-start">
            {[
              { id: "perfil", label: "Perfil", icon: User },
              { id: "blogs", label: "Mis Blogs", icon: FileText },
              { id: "guias", label: "Mis Guías", icon: Bookmark },
              { id: "foros", label: "Foros", icon: MessageSquare },
              { id: "favoritos", label: "Favoritos", icon: Award },
              { id: "clanes", label: "Clanes", icon: Users },
              { id: "eventos", label: "Eventos", icon: Calendar },
              { id: "directos", label: "Mis Directos", icon: Radio },
              { id: "configuracion", label: "Configuración", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors border ${
                    activeTab === tab.id
                      ? "bg-[#7B3FE4]/10 border-[#A56BFA] text-[#A56BFA]"
                      : "bg-transparent border-transparent text-[#A593C7] hover:bg-[#7B3FE4]/5 hover:text-[#E4D9F9]"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido de la Pestaña Activa */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8">
          {renderTabContent(activeTab, user, stats)}
        </div>
      </div>
    </div>
  );
}

// Componente para renderizar el contenido de cada pestaña
function renderTabContent(activeTab, user, stats) {
  switch (activeTab) {
    case "perfil":
      return <PerfilTab user={user} stats={stats} />;
    case "blogs":
      return <BlogsTab />;
    case "guias":
      return <GuiasTab />;
    case "foros":
      return <ForosTab />;
    case "favoritos":
      return <FavoritosTab />;
    case "clanes":
      return <ClanesTab />;
    case "eventos":
      return <EventosTab />;
    case "directos":
      return <DirectosTab />;
    case "configuracion":
      return <ConfiguracionTab />;
    default:
      return <PerfilTab user={user} stats={stats} />;
  }
}

// Componentes para cada pestaña
function PerfilTab({ user, stats }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Información del Perfil
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Información Básica */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#A56BFA] border-b border-[#7B3FE4]/30 pb-2">
            Información Básica
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[#7B3FE4]/10">
              <span className="text-[#A593C7]">Nombre de Usuario</span>
              <span className="text-white font-medium">
                {user.nombre_usuario}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[#7B3FE4]/10">
              <span className="text-[#A593C7]">Correo Electrónico</span>
              <span className="text-white font-medium">{user.correo}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[#7B3FE4]/10">
              <span className="text-[#A593C7]">Reputación</span>
              <span className="text-[#A56BFA] font-bold">
                {user.reputacion || 0}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-[#A593C7]">Miembro desde</span>
              <span className="text-white font-medium">
                {user.creado_en
                  ? new Date(user.creado_en).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#A56BFA] border-b border-[#7B3FE4]/30 pb-2">
            Estadísticas de Actividad
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#7B3FE4]/20 p-4 rounded-lg text-center hover:bg-[#7B3FE4]/30 transition-colors">
              <div className="text-2xl font-bold text-[#A56BFA]">
                {stats.blogs}
              </div>
              <div className="text-[#A593C7] text-sm mt-1">
                Blogs Publicados
              </div>
            </div>

            <div className="bg-[#7B3FE4]/20 p-4 rounded-lg text-center hover:bg-[#7B3FE4]/30 transition-colors">
              <div className="text-2xl font-bold text-[#A56BFA]">
                {stats.guias}
              </div>
              <div className="text-[#A593C7] text-sm mt-1">Guías Creadas</div>
            </div>

            <div className="bg-[#7B3FE4]/20 p-4 rounded-lg text-center hover:bg-[#7B3FE4]/30 transition-colors">
              <div className="text-2xl font-bold text-[#A56BFA]">
                {stats.hilos}
              </div>
              <div className="text-[#A593C7] text-sm mt-1">Hilos Creados</div>
            </div>

            <div className="bg-[#7B3FE4]/20 p-4 rounded-lg text-center hover:bg-[#7B3FE4]/30 transition-colors">
              <div className="text-2xl font-bold text-[#A56BFA]">
                {stats.respuestas}
              </div>
              <div className="text-[#A593C7] text-sm mt-1">Respuestas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="mt-8 pt-6 border-t border-[#7B3FE4]/30">
        <h3 className="text-lg font-semibold text-[#A56BFA] mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          <div className="bg-[#7B3FE4]/10 p-4 rounded-lg hover:bg-[#7B3FE4]/20 transition-colors">
            <p className="text-white">
              Completaste la raid "Mausoleo de Sombras" en dificultad Legendaria — logro desbloqueado: <strong>Sombras Conquistadas</strong>
            </p>
            <p className="text-[#A593C7] text-sm mt-1">Hace 2 horas</p>
          </div>

          <div className="bg-[#7B3FE4]/10 p-4 rounded-lg hover:bg-[#7B3FE4]/20 transition-colors">
            <p className="text-white">
              Alcanzaste nivel 100 con <strong>Archer</strong> — recibiste un paquete épico como recompensa
            </p>
            <p className="text-[#A593C7] text-sm mt-1">Ayer</p>
          </div>

          <div className="bg-[#7B3FE4]/10 p-4 rounded-lg hover:bg-[#7B3FE4]/20 transition-colors">
            <p className="text-white">
              Publicaste una nueva guía: "Estrategia para derrotar al Jefe Volcánico" —  pasos, builds y consejos
            </p>
            <p className="text-[#A593C7] text-sm mt-1">Hace 3 días</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectosTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Mis Transmisiones</h3>
        <button className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-2 rounded-lg transition-colors">
          Configurar Directo
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#1B1128] rounded-lg p-6 border border-[#7B3FE4]/20">
          <div className="flex items-center gap-3 mb-4">
            <Twitch size={24} className="text-purple-400" />
            <h4 className="text-white font-semibold">Twitch</h4>
          </div>
          <p className="text-[#A593C7] mb-4">No conectado</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            Conectar Twitch
          </button>
        </div>
        
        <div className="bg-[#1B1128] rounded-lg p-6 border border-[#7B3FE4]/20">
          <div className="flex items-center gap-3 mb-4">
            <Youtube size={24} className="text-red-400" />
            <h4 className="text-white font-semibold">YouTube</h4>
          </div>
          <p className="text-[#A593C7] mb-4">No conectado</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            Conectar YouTube
          </button>
        </div>
      </div>
    </div>
  );
}

// Los demás componentes de pestañas permanecen igual...
function BlogsTab() {
  return (
    <div className="text-center py-12">
      <FileText size={48} className="mx-auto text-[#A593C7] mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Mis Blogs</h3>
      <p className="text-[#A593C7]">Aquí aparecerán tus blogs publicados</p>
    </div>
  );
}

function GuiasTab() {
  return (
    <div className="text-center py-12">
      <Bookmark size={48} className="mx-auto text-[#A593C7] mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Mis Guías</h3>
      <p className="text-[#A593C7]">Aquí aparecerán tus guías creadas</p>
    </div>
  );
}

function ForosTab() {
  return (
    <div className="text-center py-12">
      <MessageSquare size={48} className="mx-auto text-[#A593C7] mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        Mi Actividad en Foros
      </h3>
      <p className="text-[#A593C7]">Aquí aparecerán tus hilos y respuestas</p>
    </div>
  );
}

function FavoritosTab() {
  return (
    <div className="text-center py-12">
      <Award size={48} className="mx-auto text-[#A593C7] mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Mis Favoritos</h3>
      <p className="text-[#A593C7]">Aquí aparecerán tus elementos favoritos</p>
    </div>
  );
}

function ClanesTab() {
  return (
    <div className="text-center py-12">
      <Users size={48} className="mx-auto text-[#A593C7] mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Mis Clanes</h3>
      <p className="text-[#A593C7]">
        Aquí aparecerán los clanes a los que perteneces
      </p>
    </div>
  );
}

function EventosTab() {
  return (
    <div className="text-center py-12">
      <Calendar size={48} className="mx-auto text-[#A593C7] mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Mis Eventos</h3>
      <p className="text-[#A593C7]">
        Aquí aparecerán los eventos a los que asistirás
      </p>
    </div>
  );
}

function ConfiguracionTab() {
  return (
    <div className="text-center py-12">
      <Settings size={48} className="mx-auto text-[#A593C7] mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Configuración</h3>
      <p className="text-[#A593C7]">
        Configura tus preferencias y ajustes de cuenta
      </p>
    </div>
  );
}