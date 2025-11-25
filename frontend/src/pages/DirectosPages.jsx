import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../Services/api";
import { 
  Radio, 
  User, 
  Eye, 
  Twitch, 
  Youtube,
  ExternalLink,
  Play
} from "lucide-react";

export default function DirectosPage() {
  const [transmisiones, setTransmisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const navigate = useNavigate();

  useEffect(() => {
    cargarTransmisiones();
  }, []);

  const cargarTransmisiones = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await authAPI.get('/transmisiones');
      setTransmisiones(response.data || []);
      
    } catch (err) {
      console.error("❌ Error cargando transmisiones:", err);
      setError("No se pudieron cargar las transmisiones");
      setTransmisiones([]); // Asegurar que sea array
    } finally {
      setLoading(false);
    }
  };

  const transmisionesFiltradas = transmisiones.filter(transmision => {
    if (!transmision) return false;
    if (filtro === "todos") return true;
    if (filtro === "en-vivo") return transmision.en_vivo;
    return transmision.plataforma === filtro;
  });

  const getPlatformIcon = (plataforma) => {
    switch (plataforma) {
      case 'twitch':
        return <Twitch size={20} className="text-purple-400" />;
      case 'youtube':
        return <Youtube size={20} className="text-red-400" />;
      default:
        return <Radio size={20} className="text-[#A56BFA]" />;
    }
  };

  const getPlatformColor = (plataforma) => {
    switch (plataforma) {
      case 'twitch':
        return 'border-purple-500/30 bg-purple-500/10';
      case 'youtube':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-[#7B3FE4]/30 bg-[#7B3FE4]/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1128] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto mb-4"></div>
            <p className="text-[#A593C7]">Cargando transmisiones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio size={48} className="text-[#A56BFA]" />
            <h1 className="text-4xl font-bold text-white">Directos en Vivo</h1>
          </div>
          <p className="text-[#A593C7] text-lg max-w-2xl mx-auto">
            Mira las transmisiones en vivo de nuestra comunidad gaming
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtro === "todos"
                ? "bg-[#7B3FE4] text-white"
                : "bg-[#2D1B3A] text-[#A593C7] hover:bg-[#7B3FE4] hover:text-white"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro("en-vivo")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtro === "en-vivo"
                ? "bg-green-600 text-white"
                : "bg-[#2D1B3A] text-[#A593C7] hover:bg-green-600 hover:text-white"
            }`}
          >
            En Vivo
          </button>
          <button
            onClick={() => setFiltro("twitch")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtro === "twitch"
                ? "bg-purple-600 text-white"
                : "bg-[#2D1B3A] text-[#A593C7] hover:bg-purple-600 hover:text-white"
            }`}
          >
            <Twitch size={18} className="inline mr-2" />
            Twitch
          </button>
          <button
            onClick={() => setFiltro("youtube")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtro === "youtube"
                ? "bg-red-600 text-white"
                : "bg-[#2D1B3A] text-[#A593C7] hover:bg-red-600 hover:text-white"
            }`}
          >
            <Youtube size={18} className="inline mr-2" />
            YouTube
          </button>
        </div>

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Grid de Transmisiones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transmisionesFiltradas.map((transmision) => (
            <div
              key={transmision.id}
              className={`bg-[#2D1B3A] rounded-2xl shadow-xl border-2 ${
                transmision.en_vivo 
                  ? 'border-green-500 animate-pulse' 
                  : getPlatformColor(transmision.plataforma)
              } overflow-hidden hover:scale-105 transition-transform duration-300`}
            >
              {/* Thumbnail/Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#7B3FE4] to-[#A56BFA] relative">
                {transmision.en_vivo && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    EN VIVO
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={48} className="text-white opacity-80" />
                </div>
              </div>
              
              {/* Información */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {getPlatformIcon(transmision.plataforma)}
                  <span className="text-white font-medium capitalize">{transmision.plataforma}</span>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                  {transmision.usuario?.nombre_usuario || 'Usuario'}'s Stream
                </h3>
                
                <div className="flex items-center justify-between text-[#A593C7] text-sm">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{transmision.usuario?.nombre_usuario || 'Usuario'}</span>
                  </div>
                  
                  {transmision.en_vivo && (
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>En vivo</span>
                    </div>
                  )}
                </div>
                
                <a
                  href={transmision.canal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-[#7B3FE4] hover:bg-[#A56BFA] text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <ExternalLink size={18} />
                  Ver Canal
                </a>
              </div>
            </div>
          ))}
        </div>

        {transmisionesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <Radio size={64} className="mx-auto text-[#A593C7] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay transmisiones</h3>
            <p className="text-[#A593C7]">
              {filtro === "en-vivo" 
                ? "No hay transmisiones en vivo en este momento" 
                : "No se encontraron transmisiones con los filtros seleccionados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}