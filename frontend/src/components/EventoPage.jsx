import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../Services/api";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  Users,
  Share2,
  UserCheck,
  UserX
} from "lucide-react";

export default function EventoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [organizador, setOrganizador] = useState(null);
  const [asistentes, setAsistentes] = useState([]);
  const [miEstado, setMiEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarEvento();
    cargarAsistentes();
    cargarMiEstado();
  }, [id]);

  const cargarEvento = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await authAPI.get(`/eventos/${id}`);
      const eventoData = response.data;
      
      setEvento(eventoData);
      
      // Cargar información del organizador
      if (eventoData.creado_por) {
        const userResponse = await authAPI.get(`/usuarios/${eventoData.creado_por}`);
        setOrganizador(userResponse.data);
      }
      
    } catch (err) {
      console.error("❌ Error cargando evento:", err);
      setError("No se pudo cargar el evento solicitado");
    } finally {
      setLoading(false);
    }
  };

  const cargarAsistentes = async () => {
    try {
      const response = await authAPI.get(`/eventos/${id}/asistentes`);
      setAsistentes(response.data);
    } catch (err) {
      console.error("Error cargando asistentes:", err);
    }
  };

  const cargarMiEstado = async () => {
    try {
      const response = await authAPI.get(`/eventos/${id}/mi-estado`);
      setMiEstado(response.data.estado);
    } catch (err) {
      console.error("Error cargando mi estado:", err);
    }
  };

  const manejarAsistencia = async (estado) => {
    try {
      await authAPI.post(`/eventos/${id}/asistencia`, { estado });
      setMiEstado(estado);
      cargarAsistentes(); // Recargar lista de asistentes
    } catch (err) {
      console.error("Error actualizando asistencia:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto mb-4"></div>
          <p className="text-[#A593C7]">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error || "Evento no encontrado"}</p>
          <button
            onClick={() => navigate('/eventos')}
            className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    );
  }

  const fechaEvento = new Date(evento.fecha_evento);
  const ahora = new Date();
  const haPasado = fechaEvento < ahora;

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/eventos')}
          className="flex items-center gap-2 text-[#A593C7] hover:text-[#E4D9F9] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a Eventos
        </button>

        {/* Header del Evento */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">
            {evento.titulo}
          </h1>
          
          {/* Detalles del Evento */}
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-[#A56BFA]" />
                <div>
                  <p className="text-white font-medium">
                    {fechaEvento.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-[#A593C7] text-sm">
                    {fechaEvento.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-[#A56BFA]" />
                <span className="text-white">Evento Online</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-[#A56BFA]" />
                <div>
                  <p className="text-white font-medium">
                    {asistentes.filter(a => a.estado === 'asistire').length} asistentes confirmados
                  </p>
                  <p className="text-[#A593C7] text-sm">
                    {asistentes.filter(a => a.estado === 'interesado').length} interesados
                  </p>
                </div>
              </div>
              
              {organizador && (
                <div className="flex items-center gap-3">
                  <User size={20} className="text-[#A56BFA]" />
                  <div>
                    <p className="text-[#A593C7] text-sm">Organizado por</p>
                    <p className="text-white font-medium">{organizador.nombre_usuario}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estado de Asistencia */}
          {!haPasado && (
            <div className="flex flex-wrap gap-4 pt-6 border-t border-[#7B3FE4]/30">
              <button
                onClick={() => manejarAsistencia('asistire')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  miEstado === 'asistire'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white'
                }`}
              >
                <UserCheck size={18} />
                Asistiré
              </button>
              
              <button
                onClick={() => manejarAsistencia('interesado')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  miEstado === 'interesado'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white'
                }`}
              >
                <Clock size={18} />
                Interesado
              </button>
              
              <button
                onClick={() => manejarAsistencia('no_asistire')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  miEstado === 'no_asistire'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white'
                }`}
              >
                <UserX size={18} />
                No Asistiré
              </button>
              
              <button className="flex items-center gap-2 border border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4] hover:text-white px-4 py-2 rounded-lg transition-colors ml-auto">
                <Share2 size={18} />
                Compartir
              </button>
            </div>
          )}
        </div>

        {/* Descripción del Evento */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Descripción</h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-[#E4D9F9] whitespace-pre-line">{evento.descripcion}</p>
          </div>
        </div>

        {/* Asistentes */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Asistentes ({asistentes.filter(a => a.estado === 'asistire').length})
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {asistentes
              .filter(asistente => asistente.estado === 'asistire')
              .map((asistente) => (
                <div key={asistente.id} className="bg-[#1B1128] rounded-lg p-4 border border-[#7B3FE4]/20 hover:border-[#A56BFA] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7B3FE4] to-[#A56BFA] rounded-full flex items-center justify-center text-white font-bold">
                      {asistente.usuario?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{asistente.usuario?.nombre_usuario || 'Usuario'}</p>
                      <p className="text-[#A593C7] text-sm">{asistente.usuario?.reputacion || 0} reputación</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {asistentes.filter(a => a.estado === 'asistire').length === 0 && (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-[#A593C7] mb-4" />
              <p className="text-[#A593C7]">Aún no hay asistentes confirmados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}