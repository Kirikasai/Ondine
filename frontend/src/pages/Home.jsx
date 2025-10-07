import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGameDetails } from "../Services/steamApi";
import logo from "../assets/ondine.png";

// IDs de juegos destacados - usando juegos que sabemos que existen
const FEATURED_GAME_IDS = [570, 730, 440]; // Dota 2, CS2, Team Fortress 2

export default function Home() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedGames() {
      try {
        setLoading(true);
        setError(null);
        console.log("Starting to fetch featured games...");
        
        const promises = FEATURED_GAME_IDS.map((id) => getGameDetails(id));
        const results = await Promise.all(promises);
        
        // Filtrar juegos válidos y que no sean undefined
        const validGames = results.filter(game => 
          game !== null && 
          game !== undefined && 
          game.name && 
          game.steam_appid
        );
        
        console.log("Valid games found:", validGames);
        setFeaturedGames(validGames);
        
        if (validGames.length === 0) {
          setError("No se pudieron cargar los juegos destacados");
        }
      } catch (error) {
        console.error("Error in fetchFeaturedGames:", error);
        setError("Error al cargar los juegos destacados");
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedGames();
  }, []);

  // Función para obtener imagen segura
  const getSafeImage = (game) => {
    if (!game || !game.header_image) {
      return "/placeholder-game.jpg";
    }
    return game.header_image;
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
    if (!game || !game.short_description) {
      return "Descripción no disponible";
    }
    return game.short_description;
  };

  // Función para obtener appid seguro
  const getSafeAppId = (game) => {
    if (!game || !game.steam_appid) {
      return "#";
    }
    return game.steam_appid;
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
        <Link
          to="/register"
          className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          Únete a la comunidad
        </Link>
      </section>

      {/* Sección de características */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <div className="bg-[#2D1B3A]/80 rounded-2xl shadow-lg p-6 border border-[#7B3FE4]/30 hover:scale-[1.02] transition">
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">Foros</h3>
          <p className="text-[#A593C7]">
            Únete a debates sobre tus juegos favoritos y comparte tus
            estrategias con otros jugadores.
          </p>
        </div>

        <div className="bg-[#2D1B3A]/80 rounded-2xl shadow-lg p-6 border border-[#7B3FE4]/30 hover:scale-[1.02] transition">
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">Blogs y Guías</h3>
          <p className="text-[#A593C7]">
            Crea tus propias guías, walkthroughs o comparte experiencias sobre
            tus aventuras en los videojuegos.
          </p>
        </div>

        <div className="bg-[#2D1B3A]/80 rounded-2xl shadow-lg p-6 border border-[#7B3FE4]/30 hover:scale-[1.02] transition">
          <h3 className="text-2xl font-bold mb-3 text-[#A56BFA]">Eventos y Logros</h3>
          <p className="text-[#A593C7]">
            Participa en eventos, gana logros y mejora tu reputación dentro del
            Reino de Ondine.
          </p>
        </div>
      </section>

      {/* Sección tipo Steam "Destacados" */}
      <section className="bg-[#2D1B3A] py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#A56BFA]">
          Juegos Destacados
        </h2>
        
        {loading && (
          <div className="text-center text-xl text-[#A56BFA]">
            Cargando juegos destacados...
          </div>
        )}

        {error && (
          <div className="text-center text-xl text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredGames.map((game, index) => (
              <div
                key={game?.steam_appid || index}
                className="bg-[#1B1128] rounded-2xl overflow-hidden shadow-xl border border-[#7B3FE4]/30 hover:scale-[1.03] transition"
              >
                <img
                  src={getSafeImage(game)}
                  alt={getSafeName(game)}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-game.jpg";
                  }}
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 text-[#E4D9F9]">
                    {getSafeName(game)}
                  </h4>
                  <p className="text-sm text-[#A593C7] line-clamp-3">
                    {getSafeDescription(game)}
                  </p>
                  <a
                    href={`https://store.steampowered.com/app/${getSafeAppId(game)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-2 rounded-md transition inline-block"
                  >
                    Ver en Steam
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje si no hay juegos */}
        {!loading && !error && featuredGames.length === 0 && (
          <div className="text-center text-[#A593C7]">
            No se encontraron juegos destacados.
          </div>
        )}
      </section>
    </div>
  );
}

