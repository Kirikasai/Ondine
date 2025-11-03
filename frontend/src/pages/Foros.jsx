import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Foros() {
  const [foros, setForos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    cargarForos();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  };

  const cargarForos = async () => {
    try {
      setLoading(true);
      // Datos de ejemplo
      setForos([
        {
          id: 1,
          titulo: "General Gaming",
          descripcion: "Discusiones generales sobre videojuegos, noticias y temas diversos del mundo gaming.",
          hilos_count: 156,
          creado_en: "2024-01-10T00:00:00"
        },
        {
          id: 2,
          titulo: "Noticias y Rumores", 
          descripcion: "Últimas noticias, anuncios y rumores del mundo de los videojuegos.",
          hilos_count: 89,
          creado_en: "2024-01-10T00:00:00"
        },
        {
          id: 3,
          titulo: "Búsqueda de Grupo",
          descripcion: "Encuentra compañeros para tus juegos favoritos y forma equipos.",
          hilos_count: 234,
          creado_en: "2024-01-10T00:00:00"
        },
        {
          id: 4,
          titulo: "Soporte Técnico",
          descripcion: "Ayuda con problemas técnicos, configuración y optimización de juegos.",
          hilos_count: 67,
          creado_en: "2024-01-10T00:00:00"
        },
        {
          id: 5,
          titulo: "Desarrollo de Juegos",
          descripcion: "Comunidad para desarrolladores indie y aspirantes a creadores de juegos.",
          hilos_count: 45,
          creado_en: "2024-01-10T00:00:00"
        },
        {
          id: 6,
          titulo: "eSports y Competitivo",
          descripcion: "Discusiones sobre torneos, equipos profesionales y juego competitivo.",
          hilos_count: 78,
          creado_en: "2024-01-10T00:00:00"
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIconoForo = (titulo) => {
    const iconos = {
      "General Gaming": "🎮",
      "Noticias y Rumores": "📰", 
      "Búsqueda de Grupo": "👥",
      "Soporte Técnico": "🔧",
      "Desarrollo de Juegos": "💻",
      "eSports y Competitivo": "🏆"
    };
    return iconos[titulo] || "💬";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto"></div>
        <p className="mt-4 text-[#A593C7]">Cargando foros...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#A56BFA] mb-2">Foros de la Comunidad</h1>
            <p className="text-[#A593C7]">Únete a las discusiones y comparte con otros gamers</p>
          </div>
          {!isAuthenticated && (
            <div className="text-[#A593C7] text-sm bg-[#2D1B3A] px-4 py-2 rounded-lg">
              <Link to="/login" className="text-[#A56BFA] hover:underline font-medium">
                Inicia sesión
              </Link> para participar
            </div>
          )}
        </div>

        {/* Grid de Foros */}
        <div className="grid md:grid-cols-2 gap-6">
          {foros.map(foro => (
            <div key={foro.id} className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-6 hover:border-[#A56BFA]/50 transition-all group">
              <Link to={`/foros/${foro.id}`} className="block">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {getIconoForo(foro.titulo)}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-white group-hover:text-[#A56BFA] transition-colors mb-2">
                      {foro.titulo}
                    </h2>
                    <p className="text-[#A593C7] text-sm mb-3 line-clamp-2">
                      {foro.descripcion}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#A56BFA] font-medium">
                        {foro.hilos_count} hilos
                      </span>
                      <span className="text-[#A593C7] group-hover:text-white transition-colors">
                        Ver foro →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Información para no registrados */}
        {!isAuthenticated && (
          <div className="mt-8 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-[#A56BFA] mb-2">¿Quieres participar?</h3>
            <p className="text-[#A593C7] mb-4">
              Únete a nuestra comunidad para crear hilos, responder y conectar con otros gamers
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Crear cuenta
              </Link>
              <Link
                to="/login"
                className="bg-transparent border border-[#7B3FE4] text-[#A56BFA] hover:bg-[#7B3FE4] hover:text-white px-6 py-2 rounded-lg transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}