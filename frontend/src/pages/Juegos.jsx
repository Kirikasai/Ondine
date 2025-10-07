import { useEffect, useState } from "react";
import { getGameDetails, getAppList } from "../Services/steamApi";

export default function Juegos() {
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  const gamesPerPage = 9;

  // Obtener la lista completa de juegos (solo nombres e IDs)
  useEffect(() => {
    async function fetchAllGames() {
      try {
        setInitialLoad(true);
        console.log("Cargando lista completa de juegos...");
        const appList = await getAppList();
        console.log("Lista cargada:", appList.length, "juegos");
        setAllGames(appList);
      } catch (error) {
        console.error("Error cargando lista de juegos:", error);
      } finally {
        setInitialLoad(false);
      }
    }
    fetchAllGames();
  }, []);

  // Cargar detalles SOLO de los juegos de la página actual
  useEffect(() => {
    async function fetchCurrentPageGames() {
      if (allGames.length === 0) return;

      const startIndex = (currentPage - 1) * gamesPerPage;
      const endIndex = startIndex + gamesPerPage;
      
      // Filtrar juegos si hay término de búsqueda
      let gamesToShow = allGames;
      if (searchTerm) {
        gamesToShow = allGames.filter(game => 
          game.name && game.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const currentPageGames = gamesToShow.slice(startIndex, endIndex);

      try {
        setLoading(true);
        console.log("Cargando detalles de", currentPageGames.length, "juegos...");
        
        // Cargar detalles SOLO de los juegos de esta página
        const promises = currentPageGames.map(game => getGameDetails(game.appid));
        const results = await Promise.all(promises);
        
        // Filtrar juegos válidos
        const validGames = results.filter(game => 
          game !== null && 
          game !== undefined && 
          game.name && 
          game.steam_appid
        );
        
        setGames(validGames);
        console.log("Detalles cargados:", validGames.length, "juegos válidos");
      } catch (error) {
        console.error("Error cargando detalles de juegos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentPageGames();
  }, [allGames, currentPage, searchTerm]);

  const totalPages = Math.ceil(
    (searchTerm 
      ? allGames.filter(game => 
          game.name && game.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length 
      : allGames.length) / gamesPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-10">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-[#A56BFA]">
        Todos los Juegos de Steam
      </h2>

      {/* Barra de búsqueda */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Buscar entre todos los juegos de Steam..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-4 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA]"
        />
      </div>

      {/* Información de resultados */}
      <div className="text-center mb-6 text-[#A593C7]">
        {initialLoad ? (
          <p>Cargando lista completa de juegos...</p>
        ) : searchTerm ? (
          <p>
            Mostrando {games.length} de {
              allGames.filter(game => 
                game.name && game.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).length
            } resultados para "{searchTerm}"
          </p>
        ) : (
          <p>Total de juegos disponibles: {allGames.length.toLocaleString()}</p>
        )}
      </div>

      {loading ? (
        <div className="text-center text-xl text-[#A56BFA]">
          Cargando detalles de los juegos...
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {games.map((game, index) => (
              <div
                key={game?.steam_appid || index}
                className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition"
              >
                <img
                  src={getSafeImage(game)}
                  alt={getSafeName(game)}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-game.jpg";
                  }}
                />
                <div className="p-5">
                  <h3 className="text-2xl font-bold mb-2 text-[#A56BFA]">
                    {getSafeName(game)}
                  </h3>
                  <p className="text-[#A593C7] text-sm mb-3 line-clamp-3">
                    {getSafeDescription(game)}
                  </p>
                  <a
                    href={`https://store.steampowered.com/app/${getSafeAppId(game)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-2 rounded-md inline-block transition"
                  >
                    Ver en Steam
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mostrar mensaje si no hay juegos */}
          {!loading && games.length === 0 && !initialLoad && (
            <div className="text-center text-[#A593C7] text-lg mt-8">
              {searchTerm ? 
                "No se encontraron juegos con ese nombre." : 
                "No se pudieron cargar los juegos."
              }
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6B] text-white px-6 py-2 rounded-md transition"
              >
                Anterior
              </button>
              
              <span className="text-[#A593C7] flex items-center">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6B] text-white px-6 py-2 rounded-md transition"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}