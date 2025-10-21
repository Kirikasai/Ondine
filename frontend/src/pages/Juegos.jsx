// components/Juegos.jsx
import { useEffect, useState, useCallback } from "react";
import { steamAPI } from "../services/api";

export default function Juegos() {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [generoSeleccionado, setGeneroSeleccionado] = useState("todos");
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    total: 0,
    totalPaginas: 0,
  });
  const [generosDisponibles, setGenerosDisponibles] = useState([]);

  // Cargar géneros disponibles al inicio
  useEffect(() => {
    cargarGeneros();
  }, []);

  // ✅ Usar useCallback para memoizar cargarJuegos
  const cargarJuegos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;

      // Si hay término de búsqueda, usar la función de búsqueda
      if (searchTerm.trim()) {
        data = await steamAPI.buscarJuegos(
          searchTerm,
          generoSeleccionado !== "todos" ? generoSeleccionado : undefined
        );
      }
      // Si hay género seleccionado pero no búsqueda, usar filtro por género
      else if (generoSeleccionado !== "todos") {
        data = await steamAPI.getJuegosPorGenero(generoSeleccionado);
      }
      // Caso general: obtener todos los juegos con paginación
      else {
        const params = {
          pagina: paginacion.pagina,
          limite: 20,
        };

        console.log("🎮 Cargando juegos con params:", params);
        data = await steamAPI.getJuegos(params);
      }

      // Ajustar según la estructura de respuesta de la API
      const juegosData = data.data || data.juegos || [];
      const total = data.total || data.meta?.total || 0;
      const paginaActual = data.pagina || data.meta?.current_page || 1;
      const totalPaginas = data.totalPaginas || data.meta?.last_page || 1;

      setJuegos(juegosData);
      setPaginacion({
        pagina: paginaActual,
        total: total,
        totalPaginas: totalPaginas,
      });

      console.log(`✅ ${juegosData.length} juegos cargados`);
    } catch (err) {
      console.error("Error cargando juegos:", err);
      setError(err.message || "No se pudieron cargar los juegos");
      setJuegos([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, generoSeleccionado, paginacion.pagina]); // ✅ Dependencias incluidas

  // Cargar juegos cuando cambien los filtros o página
  useEffect(() => {
    cargarJuegos();
  }, [cargarJuegos]); // ✅ Ahora solo depende de cargarJuegos

  const cargarGeneros = async () => {
  try {
    const data = await steamAPI.getGeneros();
    console.log("📊 Datos de géneros recibidos:", data);
    
    // ✅ Manejar diferentes estructuras de respuesta
    let generos = [];
    
    if (Array.isArray(data)) {
      generos = data;
    } else if (data?.data && Array.isArray(data.data)) {
      generos = data.data;
    } else if (data?.generos && Array.isArray(data.generos)) {
      generos = data.generos;
    }
    
    // ✅ Asegurar que sean strings para el select
    const generosStrings = generos.map(genero => {
      if (typeof genero === 'string') return genero;
      if (genero?.name) return genero.name;
      if (genero?.description) return genero.description;
      return String(genero);
    }).filter(Boolean); // Remover valores vacíos
    
    console.log("🎯 Géneros procesados:", generosStrings);
    setGenerosDisponibles(generosStrings);
    
  } catch (err) {
    console.error('Error cargando géneros:', err);
    // Géneros por defecto
    setGenerosDisponibles([
      "Action", "Adventure", "RPG", "Strategy", 
      "Simulation", "Sports", "Racing", "Indie"
    ]);
  }
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPaginacion((prev) => ({ ...prev, pagina: 1 }));
  };

  const handleGeneroChange = (e) => {
    setGeneroSeleccionado(e.target.value);
    setPaginacion((prev) => ({ ...prev, pagina: 1 }));
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.totalPaginas) {
      setPaginacion((prev) => ({ ...prev, pagina: nuevaPagina }));
    }
  };

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
    const imageId = game.cover.url.split('/').pop()?.replace('.jpg', '');
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

  // ✅ FUNCIÓN CORREGIDA: Asegurar que siempre devuelva strings
  const getGenerosJuego = (game) => {
    if (!game || !game.genres || game.genres.length === 0) {
      return ["Sin género"];
    }

    // Manejar tanto array de objetos como array de strings
    const generos = game.genres.map((genero) => {
      if (typeof genero === "string") {
        return genero;
      }
      if (genero && genero.description) {
        return genero.description;
      }
      if (genero && genero.name) {
        return genero.name;
      }
      return "Género";
    });

    return generos.slice(0, 2); // Solo mostrar máximo 2 géneros
  };

  // Función para formatear precio
  const getPrecio = (game) => {
    if (!game || game.is_free) {
      return "Gratuito";
    }

    if (game.price_overview) {
      return `$${(game.price_overview.final / 100).toFixed(2)}`;
    }

    return "Precio no disponible";
  };

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#A56BFA]">
            Juegos de Steam
          </h1>
          <p className="text-lg text-[#A593C7] max-w-2xl mx-auto">
            Explora todos los juegos disponibles en Steam. Busca por nombre o
            filtra por género.
          </p>
        </div>

        {/* Controles de Búsqueda y Filtro */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Barra de Búsqueda */}
          <div>
            <label className="block text-[#A56BFA] font-medium mb-2">
              🔍 Buscar por Nombre
            </label>
            <input
              type="text"
              placeholder="Escribe el nombre del juego..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-4 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA]"
            />
          </div>

          {/* Filtro por Género */}
          <div>
            <label className="block text-[#A56BFA] font-medium mb-2">
              🎯 Filtrar por Género
            </label>
            <select
              value={generoSeleccionado}
              onChange={handleGeneroChange}
              className="w-full p-4 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl text-white focus:outline-none focus:border-[#A56BFA]"
            >
              <option value="todos">Todos los géneros</option>
              {generosDisponibles.map((genero) => {
                // ✅ Asegurar que la key sea única y sea string
                const generoKey =
                  typeof genero === "string"
                    ? genero
                    : genero.id || genero.name || JSON.stringify(genero);
                const generoNombre =
                  typeof genero === "string"
                    ? genero
                    : genero.name || genero.description || "Género";

                return (
                  <option key={generoKey} value={generoKey}>
                    {generoNombre}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Información de Resultados */}
        <div className="text-center mb-8">
          <p className="text-[#A593C7]">
            {loading ? (
              "Cargando juegos..."
            ) : (
              <>
                Total:{" "}
                <span className="text-white font-bold">
                  {paginacion.total.toLocaleString()}
                </span>{" "}
                juegos
                {searchTerm && (
                  <>
                    {" "}
                    • Buscando: "
                    <span className="text-white">{searchTerm}</span>"
                  </>
                )}
                {generoSeleccionado !== "todos" && (
                  <>
                    {" "}
                    • Género:{" "}
                    <span className="text-white">{generoSeleccionado}</span>
                  </>
                )}
                <>
                  {" "}
                  • Mostrando{" "}
                  <span className="text-[#A56BFA] font-bold">
                    {juegos.length}
                  </span>{" "}
                  juegos
                </>
                <>
                  {" "}
                  • Página{" "}
                  <span className="text-white">
                    {paginacion.pagina}
                  </span> de{" "}
                  <span className="text-white">{paginacion.totalPaginas}</span>
                </>
              </>
            )}
          </p>
        </div>

        {/* Estado de Carga */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA]"></div>
            <p className="mt-4 text-[#A593C7]">Cargando juegos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8 bg-red-900/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-red-400 text-lg mb-2">❌ {error}</p>
            <button
              onClick={cargarJuegos}
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de Juegos */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {juegos.map((game, index) => (
                <div
                  key={game?.steam_appid || game?.id || index}
                  className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform group"
                >
                  {/* Imagen del Juego */}
                  <img
                    src={getSafeImage(game)}
                    alt={getSafeName(game)}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placeholder-game.jpg";
                    }}
                  />

                  {/* Contenido */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#A56BFA] transition-colors line-clamp-2">
                      {getSafeName(game)}
                    </h3>

                    {/* Precio */}
                    <div className="mb-2">
                      <span className="bg-[#7B3FE4] text-white px-3 py-1 rounded-full text-sm font-bold">
                        {getPrecio(game)}
                      </span>
                    </div>

                    {/* ✅ Géneros CORREGIDOS - asegurar que sean strings */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {getGenerosJuego(game).map((genero, idx) => (
                        <span
                          key={idx}
                          className="bg-[#7B3FE4]/20 text-[#A56BFA] px-2 py-1 rounded text-xs"
                        >
                          {genero}
                        </span>
                      ))}
                    </div>

                    <p className="text-[#A593C7] text-sm mb-4 line-clamp-2">
                      {getSafeDescription(game)}
                    </p>

                    <a
                      href={`https://store.steampowered.com/app/${getSafeAppId(
                        game
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#7B3FE4] hover:bg-[#A56BFA] text-white text-center py-2 px-4 rounded-lg transition-colors font-medium block"
                    >
                      Ver en Steam
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación - Solo mostrar cuando no hay búsqueda activa */}
            {!searchTerm &&
              generoSeleccionado === "todos" &&
              paginacion.totalPaginas > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-4">
                  <button
                    onClick={() => cambiarPagina(paginacion.pagina - 1)}
                    disabled={paginacion.pagina === 1}
                    className="bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6B] text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Anterior
                  </button>

                  <span className="text-[#A593C7]">
                    Página {paginacion.pagina} de {paginacion.totalPaginas}
                  </span>

                  <button
                    onClick={() => cambiarPagina(paginacion.pagina + 1)}
                    disabled={paginacion.pagina === paginacion.totalPaginas}
                    className="bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6B] text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
          </>
        )}

        {/* Sin resultados */}
        {!loading && !error && juegos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[#A593C7] text-lg mb-2">
              No se encontraron juegos
            </p>
            <p className="text-[#A593C7] text-sm">
              {searchTerm
                ? `No hay resultados para "${searchTerm}". Intenta con otro nombre.`
                : "No hay juegos disponibles en este momento."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
