import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DetalleForo() {
  const { id } = useParams();
  const [foro, setForo] = useState(null);
  const [hilos, setHilos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    cargarForoYHilos();
  }, [id]);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  };

  const cargarForoYHilos = async () => {
    try {
      setLoading(true);
      // Datos de ejemplo
      setForo({
        id: parseInt(id),
        titulo: "General Gaming",
        descripcion: "Discusiones generales sobre videojuegos, noticias y temas diversos del mundo gaming.",
        creado_en: "2024-01-10T00:00:00"
      });

      setHilos([
        {
          id: 1,
          titulo: "¿Qué están jugando este fin de semana?",
          cuerpo: "Compartan qué juegos van a disfrutar este fin de semana y por qué los recomiendan.",
          usuario: { nombre_usuario: "GamerPro" },
          respuestas_count: 15,
          creado_en: "2024-01-15T10:30:00"
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
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto"></div>
        <p className="mt-4 text-[#A593C7]">Cargando foro...</p>
      </div>
    </div>
  );

  if (!foro) return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Foro no encontrado</h1>
        <Link to="/foros" className="text-[#A56BFA] hover:underline">
          Volver a los foros
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <Link to="/foros" className="text-[#A56BFA] hover:underline text-sm mb-2 inline-block">
              ← Volver a foros
            </Link>
            <h1 className="text-4xl font-bold text-[#A56BFA] mb-2">{foro.titulo}</h1>
            <p className="text-[#A593C7] text-lg">{foro.descripcion}</p>
          </div>
          {isAuthenticated && (
            <Link
              to={`/foros/${id}/nuevo-hilo`}
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📝 Nuevo Hilo
            </Link>
          )}
        </div>

        {!isAuthenticated && (
          <div className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-4 mb-6">
            <p className="text-[#A593C7] text-center">
              <Link to="/login" className="text-[#A56BFA] hover:underline font-medium">
                Inicia sesión
              </Link> para crear hilos y participar en las discusiones
            </p>
          </div>
        )}

        <div className="space-y-4">
          {hilos.map(hilo => (
            <div key={hilo.id} className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-6 hover:border-[#A56BFA]/50 transition-all group">
              <Link to={`/hilos/${hilo.id}`} className="block">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-white group-hover:text-[#A56BFA] transition-colors mb-2">
                      {hilo.titulo}
                    </h2>
                    <p className="text-[#A593C7] mb-3 line-clamp-2">
                      {hilo.cuerpo}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-[#A593C7]">
                      <span>Por: <strong className="text-[#A56BFA]">{hilo.usuario.nombre_usuario}</strong></span>
                      <span>•</span>
                      <span>{formatFecha(hilo.creado_en)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="bg-[#7B3FE4] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mb-2">
                      {hilo.respuestas_count}
                    </div>
                    <div className="text-xs text-[#A593C7]">
                      respuestas
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {hilos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-[#A56BFA] mb-2">No hay hilos en este foro</h3>
            <p className="text-[#A593C7] mb-4">Sé el primero en iniciar una discusión</p>
            {isAuthenticated ? (
              <Link
                to={`/foros/${id}/nuevo-hilo`}
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg inline-block"
              >
                Crear primer hilo
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg inline-block"
              >
                Únete para participar
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}