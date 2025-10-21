import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { steamAPI } from "../services/api";
import logo from "../assets/ondine.png";

export default function Home() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedGames() {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Iniciando carga de juegos destacados...");

        // ✅ USAR RUTAS QUE SÍ EXISTEN EN TU BACKEND
        // Opción 1: Obtener juegos populares (si existe la ruta)
        // const data = await steamAPI.getJuegosPopulares(3);

        // Opción 2: Obtener juegos gratuitos (si existe la ruta)
        // const data = await steamAPI.getJuegosGratuitos(3);

        // Opción 3: Obtener juegos normales con límite
        const data = await steamAPI.getJuegos({
          limite: 3,
          pagina: 1,
        });

        // Manejar diferentes estructuras de respuesta
        const juegos = data.data || data.juegos || [];

        console.log("✅ Juegos encontrados:", juegos.length, juegos);
        setFeaturedGames(juegos);

        if (juegos.length === 0) {
          setError("No se pudieron cargar los juegos destacados");
        }
      } catch (error) {
        console.error("❌ Error cargando juegos destacados:", error);

        // Si falla, intentar con una ruta más básica
        try {
          console.log("🔄 Intentando carga alternativa...");
          const dataAlternativa = await steamAPI.getJuegos({ limite: 3 });
          const juegosAlternativos =
            dataAlternativa.data || dataAlternativa.juegos || [];

          if (juegosAlternativos.length > 0) {
            setFeaturedGames(juegosAlternativos);
            setError(null);
          } else {
            setError("No hay juegos disponibles en este momento");
          }
        } catch (fallbackError) {
          setError("No se pudieron cargar los juegos destacados");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedGames();
  }, []);

  const getSafeImage = (game) => {
    // ✅ Los juegos vienen con background_image directo
    if (game?.background_image) {
      return game.background_image;
    }

    // Si no, intentar con cover de IGDB
    if (game?.cover?.image_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
    }

    if (game?.cover?.url) {
      const imageId = game.cover.url.split("/").pop()?.replace(".jpg", "");
      if (imageId) {
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
      }
    }

    // Fallback
    return "/placeholder-game.jpg";
  };

  // Función para obtener nombre seguro
  const getSafeName = (game) => {
    if (!game || !game.name) {
      return "Nombre no disponible";
    }
    return game.name;
  };

  // Función para obtener descripción segura
  const getSafeDescription = (game) => {
    // IGDB usa 'summary', Steam usa 'short_description'
    if (game?.summary) {
      return game.summary.length > 120
        ? `${game.summary.substring(0, 120)}...`
        : game.summary;
    }

    if (game?.short_description) {
      return game.short_description.length > 120
        ? `${game.short_description.substring(0, 120)}...`
        : game.short_description;
    }

    return "Descripción no disponible";
  };

  // Función para obtener rating
  const getSafeRating = (game) => {
    if (game?.rating) {
      return Math.round(game.rating);
    }

    if (game?.total_positive && game?.total_negative) {
      const total = game.total_positive + game.total_negative;
      if (total > 0) {
        return Math.round((game.total_positive / total) * 100);
      }
    }

    return "N/A";
  };

  // Función para obtener géneros
  const getSafeGenres = (game) => {
    if (game?.genres && Array.isArray(game.genres)) {
      // Si es array de objetos con name
      if (game.genres[0]?.name) {
        return game.genres.map((genre) => genre.name).slice(0, 2);
      }
      // Si es array de strings
      return game.genres.slice(0, 2);
    }

    return ["Sin género"];
  };

  // Función para obtener ID del juego
  const getGameId = (game) => {
    return game?.id || game?.steam_appid || game?.slug || Math.random();
  };

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9]">
      {/* Hero principal */}
      <section className="flex flex-col items-center justify-center text-center pt-32 pb-24 bg-gradient-to-b from-[#2D1B3A] to-[#1B1128]">
        <img
          src={logo}
          alt="Ondine Logo"
          className="w-40 mb-6 drop-shadow-lg animate-pulse"
        />
        <h1 className="text-5xl font-extrabold mb-4 text-[#A56BFA] drop-shadow-lg">
          Bienvenido a Ondine
        </h1>
        <p className="text-lg max-w-2xl text-[#A593C7] mb-10">
          La plataforma donde los videojuegos, los foros, los eventos y los
          jugadores se unen en una comunidad única.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/register"
            className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            Únete a la comunidad
          </Link>
          <Link
            to="/juegos" 
            className="w-full bg-[#7B3FE4] hover:bg-[#A56BFA] text-white text-center py-2 px-4 rounded-lg transition-colors font-medium block"
          >
            Explorar Juegos
          </Link>
          <Link
            to="/noticias"
            className="bg-[#2D1B3A] hover:bg-[#3D2B4A] border border-[#7B3FE4] text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            Ver Noticias
          </Link>
        </div>
      </section>

      {/* Sección de características */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <div className="bg-[#2D1B3A]/80 rounded-2xl shadow-lg p-6 border border-[#7B3FE4]/30 hover:scale-[1.02] transition">
          <div className="text-3xl mb-3">🎮</div>
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">
            Catálogo de Juegos
          </h3>
          <p className="text-[#A593C7]">
            Explora miles de juegos con información detallada, ratings y reseñas
            de la comunidad.
          </p>
        </div>

        <div className="bg-[#2D1B3A]/80 rounded-2xl shadow-lg p-6 border border-[#7B3FE4]/30 hover:scale-[1.02] transition">
          <div className="text-3xl mb-3">📰</div>
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">
            Noticias Actualizadas
          </h3>
          <p className="text-[#A593C7]">
            Mantente informado con las últimas noticias del mundo gaming y
            descubre nuevos lanzamientos.
          </p>
        </div>

        <div className="bg-[#2D1B3A]/80 rounded-2xl shadow-lg p-6 border border-[#7B3FE4]/30 hover:scale-[1.02] transition">
          <div className="text-3xl mb-3">⭐</div>
          <h3 className="text-2xl font-bold mb-3 text{[#A56BFA]">
            Comunidad Activa
          </h3>
          <p className="text-[#A593C7]">
            Únete a foros, comparte tus logros y conecta con otros jugadores
            apasionados.
          </p>
        </div>
      </section>

      {/* Sección de juegos destacados */}
      <section className="bg-[#2D1B3A] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#A56BFA] mb-4">
              Juegos Destacados
            </h2>
            <p className="text-lg text-[#A593C7] max-w-2xl mx-auto">
              Descubre algunos de los juegos disponibles en nuestra plataforma
            </p>
          </div>

          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mb-4"></div>
              <p className="text-xl text-[#A56BFA]">
                Cargando juegos destacados...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center text-xl text-red-400 bg-red-900/20 py-4 rounded-lg max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {!loading && !error && featuredGames.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredGames.map((game, index) => (
                <div
                  key={getGameId(game)}
                  className="bg-[#1B1128] rounded-2xl overflow-hidden shadow-xl border border-[#7B3FE4]/30 hover:scale-[1.03] transition group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getSafeImage(game)}
                      alt={getSafeName(game)}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder-game.jpg";
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-[#7B3FE4] text-white px-2 py-1 rounded text-sm font-bold">
                      ⭐ {getSafeRating(game)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 text-[#E4D9F9] group-hover:text-[#A56BFA] transition-colors line-clamp-2">
                      {getSafeName(game)}
                    </h4>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {getSafeGenres(game).map((genre, idx) => (
                        <span
                          key={idx}
                          className="bg-[#7B3FE4]/20 text-[#A56BFA] px-2 py-1 rounded text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-[#A593C7] line-clamp-3 mb-4">
                      {getSafeDescription(game)}
                    </p>

                    <Link
                      to={`/juegos/${getGameId(game)}`}
                      className="w-full bg-[#7B3FE4] hover:bg-[#A56BFA] text-white text-center py-2 px-4 rounded-lg transition-colors font-medium block"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje si no hay juegos */}
          {!loading && !error && featuredGames.length === 0 && (
            <div className="text-center text-[#A593C7]">
              <p className="text-lg mb-4">
                No se encontraron juegos destacados.
              </p>
              <Link
                to="/juegos"
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Explorar todos los juegos
              </Link>
            </div>
          )}

          {/* Botón para ver más juegos */}
          {!loading && featuredGames.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/juegos"
                className="bg-[#2D1B3A] hover:bg-[#3D2B4A] border border-[#7B3FE4] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Ver Todos los Juegos
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
