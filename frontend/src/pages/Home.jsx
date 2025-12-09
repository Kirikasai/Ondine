import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { rawgAPI } from "../Services/api";  // ← Cambiar aquí
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
        console.log("🔄 Cargando juegos destacados desde RAWG...");
        const data = await rawgAPI.getJuegos({  // ← Cambiar aquí
          limite: 3,
          pagina: 1,
        });

        const juegos = data.data || data.juegos || [];

        console.log("✅ Juegos RAWG encontrados:", juegos.length, juegos);
        setFeaturedGames(juegos);

        if (juegos.length === 0) {
          setError("No se pudieron cargar los juegos destacados");
        }
      } catch (error) {
        console.error("❌ Error cargando juegos RAWG:", error);
        try {
          console.log("🔄 Intentando carga alternativa de RAWG...");
          const dataAlternativa = await rawgAPI.getJuegos({ limite: 3 });  // ← Cambiar aquí
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
/* Obtener Imgen del Juego */
  const getImage = (game) => {
    if (game?.background_image) {
      return game.background_image;
    }

    if (game?.cover?.image_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
    }

    if (game?.cover?.url) {
      const imageId = game.cover.url.split("/").pop()?.replace(".jpg", "");
      if (imageId) {
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
      }
    }
    return "/placeholder-game.jpg";
  };
/* Obtener Nombre del Juego */
  const getName = (game) => {
    if (!game || !game.name) {
      return "Nombre no disponible";
    }
    return game.name;
  };
/* Obtener Descrpcion del Juego */
  const getDescription = (game) => {
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
      if (game.genres[0]?.name) {
        return game.genres.map((genre) => genre.name).slice(0, 2);
      }
      return game.genres.slice(0, 2);
    }

    return ["Sin género"];
  };

  // Función para obtener ID del juego
  const getGameId = (game) => {
    return game?.id || game?.giantbomb_appid || game?.slug || Math.random();
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
        </div>
      </section>

      {/* Sección de características */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <div className="bg-[#2D1B3A]/80 rounded-2xl p-6 border border-[#7B3FE4]/30 transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(123,63,228,0.25)] hover:ring-4 hover:ring-[#7B3FE4]/10">
          <div className="text-3xl flex place-content-center mb-3">🎮</div>
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">
            Catálogo de Juegos
          </h3>
          <p className="text-[#A593C7]">
            Explora miles de juegos con información detallada, ratings y reseñas
            de la comunidad.
          </p>
        </div>

        <div className="bg-[#2D1B3A]/80 rounded-2xl p-6 border border-[#7B3FE4]/30 transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(123,63,228,0.25)] hover:ring-4 hover:ring-[#7B3FE4]/10">
          <div className="text-3xl mb-3">📰</div>
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">
            Noticias Actualizadas
          </h3>
          <p className="text-[#A593C7]">
            Mantente informado con las últimas noticias del mundo gaming y
            descubre nuevos lanzamientos.
          </p>
        </div>

        <div className="bg-[#2D1B3A]/80 rounded-2xl p-6 border border-[#7B3FE4]/30 transform transition duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(255,195,60,0.20)] hover:ring-4 hover:ring-[#FFD34C]/10">
          <div className="text-3xl mb-3">⭐</div>
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">
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
                      src={getImage(game)}
                      alt={getName(game)}
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
                      {getName(game)}
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
                      {getDescription(game)}
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
