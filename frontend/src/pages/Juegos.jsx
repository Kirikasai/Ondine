import { useEffect, useState, useCallback } from "react";
import { rawgAPI } from "../Services/api";  // ← Cambiar aquí

export default function Juegos() {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [generoSeleccionado, setGeneroSeleccionado] = useState("todos");
  const [plataformaSeleccionada, setPlataformaSeleccionada] = useState("todas");
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    total: 0,
    totalPaginas: 0,
  });
  const [generosDisponibles, setGenerosDisponibles] = useState([]);
  const [plataformasDisponibles, setPlataformasDisponibles] = useState([]);

  // Cargar géneros y plataformas al inicio
  useEffect(() => {
    cargarGeneros();
    cargarPlataformas();
  }, []);

  const cargarJuegos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎮 Iniciando carga de juegos desde RAWG...');
      console.log('📋 Filtros actuales:', {
        searchTerm,
        generoSeleccionado,
        plataformaSeleccionada,
        pagina: paginacion.pagina
      });

      let data;

      if (searchTerm.trim()) {
        console.log('🔍 Usando búsqueda RAWG:', searchTerm);
        data = await rawgAPI.buscarJuegos(searchTerm);  // ← Cambiar aquí
      } else {
        const params = {
          pagina: paginacion.pagina,
          limite: 20,
        };

        if (generoSeleccionado !== "todos") {
          params.genero = generoSeleccionado;
        }
        
        if (plataformaSeleccionada !== "todas") {
          params.plataforma = plataformaSeleccionada;
        }

        console.log('📡 Parámetros para RAWG:', params);
        data = await rawgAPI.getJuegos(params);  // ← Cambiar aquí
      }

      console.log('✅ Datos recibidos de RAWG:', data);

      const juegosData = data.juegos || data.data || [];
      const total = data.paginacion?.total_juegos || data.total || data.meta?.total || 0;
      const paginaActual = data.paginacion?.pagina_actual || data.pagina || data.meta?.current_page || 1;
      const totalPaginas = data.paginacion?.total_paginas || data.totalPaginas || data.meta?.last_page || Math.ceil(total / 20);

      console.log('✅ Juegos procesados:', juegosData.length);

      setJuegos(juegosData);
      setPaginacion({
        pagina: paginaActual,
        total: total,
        totalPaginas: totalPaginas,
      });

    } catch (err) {
      console.error("❌ Error cargando juegos:", err);
      setError(err.message || "No se pudieron cargar los juegos");
      setJuegos([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, generoSeleccionado, plataformaSeleccionada, paginacion.pagina]);

  useEffect(() => {
    cargarJuegos();
  }, [cargarJuegos]);

  const cargarGeneros = async () => {
    try {
      const data = await rawgAPI.getGeneros();  // ← Cambiar aquí
      console.log("✅ Géneros RAWG recibidos:", data);
      
      let generos = [];
      
      if (Array.isArray(data)) {
        generos = data;
      } else if (data?.data && Array.isArray(data.data)) {
        generos = data.data;
      } else if (data?.generos && Array.isArray(data.generos)) {
        generos = data.generos;
      }
      
      const generosProcesados = generos.map(genero => {
        if (typeof genero === 'string') return { id: genero, nombre: genero };
        if (genero?.name) return { id: genero.id, nombre: genero.name };
        if (genero?.nombre) return { id: genero.id, nombre: genero.nombre };
        return { id: genero.id, nombre: String(genero) };
      }).filter(genero => genero.nombre); 
      
      console.log("✅ Géneros procesados:", generosProcesados);
      setGenerosDisponibles(generosProcesados);
      
    } catch (err) {
      console.error('❌ Error cargando géneros:', err);
      // Géneros por defecto de RAWG
      setGenerosDisponibles([
        { id: "4", nombre: "Action" },
        { id: "3", nombre: "Adventure" },
        { id: "5", nombre: "RPG" },
        { id: "10", nombre: "Strategy" },
        { id: "2", nombre: "Shooter" },
        { id: "14", nombre: "Simulation" },
        { id: "7", nombre: "Puzzle" },
        { id: "11", nombre: "Arcade" },
        { id: "83", nombre: "Platformer" },
        { id: "1", nombre: "Racing" }
      ]);
    }
  };

  const cargarPlataformas = async () => {
    try {
      const data = await rawgAPI.getPlataformas();  // ← Cambiar aquí
      console.log("✅ Plataformas RAWG recibidas:", data);
      
      let plataformas = [];
      
      if (Array.isArray(data)) {
        plataformas = data;
      } else if (data?.data && Array.isArray(data.data)) {
        plataformas = data.data;
      } else if (data?.plataformas && Array.isArray(data.plataformas)) {
        plataformas = data.plataformas;
      }
      
      const plataformasProcesadas = plataformas.map(plat => {
        if (typeof plat === 'string') return { id: plat, nombre: plat };
        if (plat?.name) return { id: plat.id, nombre: plat.name };
        if (plat?.nombre) return { id: plat.id, nombre: plat.nombre };
        return { id: plat.id, nombre: String(plat) };
      }).filter(plat => plat.nombre);
      
      console.log("✅ Plataformas procesadas:", plataformasProcesadas);
      setPlataformasDisponibles(plataformasProcesadas);
      
    } catch (err) {
      console.error('❌ Error cargando plataformas:', err);
      // Plataformas por defecto de RAWG
      setPlataformasDisponibles([
        { id: "1", nombre: "PC" },
        { id: "2", nombre: "PlayStation" },
        { id: "3", nombre: "Xbox" },
        { id: "4", nombre: "Nintendo" },
        { id: "5", nombre: "macOS" },
        { id: "6", nombre: "Linux" },
        { id: "7", nombre: "iOS" },
        { id: "8", nombre: "Android" }
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

  const handlePlataformaChange = (e) => {
    setPlataformaSeleccionada(e.target.value);
    setPaginacion((prev) => ({ ...prev, pagina: 1 }));
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.totalPaginas) {
      setPaginacion((prev) => ({ ...prev, pagina: nuevaPagina }));
    }
  };

  const placeholder = "https://via.placeholder.com/400x225?text=Sin+Imagen";

  const getGameImage = (game) => {
    return game?.background_image 
      || game?.background_image_additional 
      || game?.short_screenshots?.[0]?.image 
      || placeholder;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-400";
    if (rating >= 3) return "text-yellow-400";
    if (rating >= 2) return "text-orange-400";
    return "text-red-400";
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < fullStars ? "text-yellow-400" : "text-gray-600"}>
            {i < fullStars ? "★" : (i === fullStars && hasHalf ? "⯨" : "☆")}
          </span>
        ))}
      </div>
    );
  };

  const getSafeImage = (game) => {
    // GiantBomb usa image.medium_url o image.small_url
    if (game?.background_image) {
      return game.background_image;
    }
    
    if (game?.image?.medium_url) {
      return game.image.medium_url;
    }
    
    if (game?.image?.small_url) {
      return game.image.small_url;
    }
    
    if (game?.cover?.image_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
    }

    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop";
  };

  const getSafeName = (game) => {
    if (!game || !game.name) {
      return "Nombre no disponible";
    }
    return game.name;
  };

  const getSafeDescription = (game) => {
    // GiantBomb usa 'deck' en lugar de 'summary'
    if (game?.deck) {
      return game.deck.length > 120 
        ? `${game.deck.substring(0, 120)}...` 
        : game.deck;
    }
    if (game?.summary) {
      return game.summary.length > 120 
        ? `${game.summary.substring(0, 120)}...` 
        : game.summary;
    }
    if (game?.short_description) {
      return game.short_description;
    }
    return "Descripción no disponible";
  };

  const getGenerosJuego = (game) => {
    if (!game || !game.genres || game.genres.length === 0) {
      return ["Sin género"];
    }

    const generos = game.genres.map((genero) => {
      if (typeof genero === "string") {
        return genero;
      }
      if (genero && genero.name) {
        return genero.name;
      }
      return "Género";
    });

    return generos.slice(0, 2); 
  };

  const getPlataformasJuego = (game) => {
    if (!game || !game.platforms || game.platforms.length === 0) {
      return ["Sin plataforma"];
    }

    const plataformas = game.platforms.map((plat) => {
      if (typeof plat === "string") {
        return plat;
      }
      if (plat && plat.name) {
        return plat.name;
      }
      return "Plataforma";
    });

    return plataformas.slice(0, 2); 
  };

  const getReleaseDate = (game) => {
    // GiantBomb usa original_release_date
    if (game?.released) {
      return new Date(game.released).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short'
      });
    }
    
    if (game?.original_release_date) {
      return new Date(game.original_release_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short'
      });
    }
    
    return "Próximamente";
  };

  const handleVerDetalles = (game) => {
    // GiantBomb usa site_detail_url
    if (game?.giantbomb_url) {
      window.open(game.giantbomb_url, '_blank');
    } else if (game?.site_detail_url) {
      window.open(game.site_detail_url, '_blank');
    } else {
      window.open('https://www.giantbomb.com', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#A56BFA]">
            Catálogo de Videojuegos
          </h1>
          <p className="text-lg text-[#A593C7] max-w-2xl mx-auto">
            Explora miles de juegos con información detallada de RAWG 
          </p>
        </div>

        {/* Controles de Búsqueda y Filtro */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              🎯 Género
            </label>
            <select
              value={generoSeleccionado}
              onChange={handleGeneroChange}
              className="w-full p-4 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl text-white focus:outline-none focus:border-[#A56BFA]"
            >
              <option value="todos">Todos los géneros</option>
              {generosDisponibles.map((genero) => (
                <option key={genero.id} value={genero.id}>
                  {genero.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Plataforma */}
          <div>
            <label className="block text-[#A56BFA] font-medium mb-2">
              🖥️ Plataforma
            </label>
            <select
              value={plataformaSeleccionada}
              onChange={handlePlataformaChange}
              className="w-full p-4 bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl text-white focus:outline-none focus:border-[#A56BFA]"
            >
              <option value="todas">Todas las plataformas</option>
              {plataformasDisponibles.map((plat) => (
                <option key={plat.id} value={plat.id}>
                  {plat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de Resultados */}
        <div className="text-center mb-8">
          <p className="text-[#A593C7]">
            {loading ? (
              <>Cargando juegos desde RAWG...</>
            ) : (
              <>
                Mostrando <span className="text-[#A56BFA] font-bold">{juegos.length}</span> de{" "}
                <span className="text-white font-bold">
                  {(paginacion.total ?? 0).toLocaleString()}
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
                    <span className="text-white">
                      {generosDisponibles.find(g => g.id === generoSeleccionado)?.nombre}
                    </span>
                  </>
                )}
                {plataformaSeleccionada !== "todas" && (
                  <>
                    {" "}
                    • Plataforma:{" "}
                    <span className="text-white">
                      {plataformasDisponibles.find(p => p.id === plataformaSeleccionada)?.nombre}
                    </span>
                  </>
                )}
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
            <p className="mt-4 text-[#A593C7]">Cargando juegos desde RAWG...</p> {/* ← Cambiar aquí */}
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
                  key={game.id}
                  className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl overflow-hidden hover:border-[#A56BFA]/50 transition-all transform hover:scale-105 shadow-xl"
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getGameImage(game)}
                      alt={game.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = placeholder;
                      }}
                    />
                    {/* Rating badge overlay */}
                    {game.rating > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className={`font-bold ${getRatingColor(game.rating)}`}>
                          {game.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-xs">/5</span>
                      </div>
                    )}
                    {/* Metacritic badge */}
                    {game.metacritic && (
                      <div className="absolute top-2 left-2 bg-green-600/90 px-2 py-1 rounded text-white text-xs font-bold">
                        MC {game.metacritic}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Título */}
                    <h3 className="text-lg font-bold text-white line-clamp-2 min-h-[3.5rem]">
                      {game.name}
                    </h3>

                    {/* Rating con estrellas */}
                    <div className="flex items-center justify-between">
                      {getRatingStars(game.rating)}
                      <span className="text-xs text-[#A593C7]">
                        {game.ratings_count || 0} reseñas
                      </span>
                    </div>

                    {/* Fecha de lanzamiento */}
                    {game.released && (
                      <p className="text-sm text-[#A593C7]">
                        📅 {new Date(game.released).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}

                    {/* Descripción corta */}
                    {game.short_description && (
                      <p className="text-sm text-[#A593C7] line-clamp-2">
                        {game.short_description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    {/* Géneros */}
                    {game.genres && game.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {game.genres.slice(0, 3).map((genero, index) => (
                          <span
                            key={index}
                            className="bg-[#7B3FE4]/20 text-[#A56BFA] px-2 py-1 rounded text-xs"
                          >
                            {genero.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Plataformas */}
                    {game.platforms && game.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {game.platforms.slice(0, 4).map((plataforma, index) => (
                          <span
                            key={index}
                            className="bg-[#E4D9F9]/10 text-[#A593C7] px-2 py-1 rounded text-xs"
                            title={plataforma.name}
                          >
                            {plataforma.name}
                          </span>
                        ))}
                        {game.platforms.length > 4 && (
                          <span className="text-xs text-[#A593C7] px-2 py-1">
                            +{game.platforms.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tiempo de juego */}
                    {game.playtime > 0 && (
                      <p className="text-xs text-[#A593C7]">
                        ⏱️ ~{game.playtime}h de juego promedio
                      </p>
                    )}

                    {/* Botón */}
                    <button
                      onClick={() => handleVerDetalles(game)}
                      className="w-full bg-[#7B3FE4] hover:bg-[#A56BFA] text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      Ver en RAWG
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {paginacion.totalPaginas > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => cambiarPagina(paginacion.pagina - 1)}
                  disabled={paginacion.pagina === 1}
                  className="bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6L] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Anterior
                </button>

                <span className="text-[#A593C7]">
                  Página {paginacion.pagina} de {paginacion.totalPaginas}
                </span>

                <button
                  onClick={() => cambiarPagina(paginacion.pagina + 1)}
                  disabled={paginacion.pagina === paginacion.totalPaginas}
                  className="bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6L] text-white px-6 py-2 rounded-lg transition-colors"
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

        {/* Información de la API */}
        <div className="mt-12 text-center">
          <p className="text-[#A593C7] text-sm">
            Datos proporcionados por <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-[#A56BFA] hover:underline">RAWG API</a>
          </p>
        </div>
      </div>
    </div>
  );
}