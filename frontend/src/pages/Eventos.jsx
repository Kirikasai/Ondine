import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    cargarEventos();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  };

  const cargarEventos = async () => {
    try {
      setLoading(true);
      // Datos de ejemplo
      setEventos([
        {
          id: 1,
          titulo: "Torneo Amateur de Valorant - Copa Ondine",
          descripcion: "¡Primer torneo oficial de la comunidad Ondine! Torneo amateur de Valorant abierto a todos los rangos.",
          fecha_evento: "2024-02-10T18:00:00",
          creador: { nombre_usuario: "GamerPro" },
          asistentes_count: 45,
          creado_en: "2024-01-15T10:30:00"
        },
        {
          id: 2,
          titulo: "Q&A Especial: Desarrollador Indie de 'Cosmic Journey'",
          descripcion: "Charla exclusiva con el desarrollador indie sobre su próximo juego 'Cosmic Journey'.",
          fecha_evento: "2024-02-06T20:00:00",
          creador: { nombre_usuario: "IndieDev" },
          asistentes_count: 23,
          creado_en: "2024-01-16T14:20:00"
        },
        {
          id: 3,
          titulo: "Maratón Coop: Deep Rock Galactic",
          descripcion: "¡Noche de cooperativo en Deep Rock Galactic! Unámonos para minar, combatir bichos y gritar 'Rock and Stone!'",
          fecha_evento: "2024-02-08T19:30:00",
          creador: { nombre_usuario: "EventLover" },
          asistentes_count: 34,
          creado_en: "2024-01-14T16:45:00"
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDiasRestantes = (fecha) => {
    const ahora = new Date();
    const fechaEvento = new Date(fecha);
    const diferencia = fechaEvento - ahora;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return "Hoy";
    if (dias === 1) return "Mañana";
    if (dias < 0) return "Finalizado";
    return `En ${dias} días`;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto"></div>
        <p className="mt-4 text-[#A593C7]">Cargando eventos...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#A56BFA] mb-2">Eventos de la Comunidad</h1>
            <p className="text-[#A593C7]">Participa en torneos, charlas y actividades organizadas por la comunidad</p>
          </div>
          {isAuthenticated ? (
            <Link
              to="/eventos/crear"
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🎯 Crear Evento
            </Link>
          ) : (
            <div className="text-[#A593C7] text-sm bg-[#2D1B3A] px-4 py-2 rounded-lg">
              <Link to="/login" className="text-[#A56BFA] hover:underline font-medium">
                Inicia sesión
              </Link> para crear eventos
            </div>
          )}
        </div>

        {/* Lista de Eventos */}
        <div className="space-y-6">
          {eventos.map(evento => (
            <div key={evento.id} className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-6 hover:border-[#A56BFA]/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-white mb-2">{evento.titulo}</h2>
                  <p className="text-[#A593C7] mb-3">{evento.descripcion}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-[#A593C7]">
                    <div className="flex items-center space-x-2">
                      <span>📅</span>
                      <span>{formatFecha(evento.fecha_evento)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>👤</span>
                      <span>Creado por: <strong className="text-[#A56BFA]">{evento.creador.nombre_usuario}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>👥</span>
                      <span>{evento.asistentes_count} asistentes</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0 ml-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    getDiasRestantes(evento.fecha_evento) === 'Finalizado' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-[#7B3FE4] text-white'
                  }`}>
                    {getDiasRestantes(evento.fecha_evento)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#7B3FE4]/20">
                <div className="text-[#A593C7] text-sm">
                  Creado el {new Date(evento.creado_en).toLocaleDateString('es-ES')}
                </div>
                
                {isAuthenticated ? (
                  <button className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-2 rounded-lg transition-colors font-medium">
                    Asistiré ✅
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="bg-[#4A2B6B] text-[#A593C7] px-4 py-2 rounded-lg transition-colors"
                  >
                    Inicia sesión para participar
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay eventos */}
        {eventos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-[#A56BFA] mb-2">No hay eventos programados</h3>
            <p className="text-[#A593C7] mb-4">Sé el primero en organizar un evento para la comunidad</p>
            {isAuthenticated ? (
              <Link
                to="/eventos/crear"
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg inline-block"
              >
                Crear primer evento
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg inline-block"
              >
                Únete para organizar
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}