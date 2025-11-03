import { useEffect, useState, useCallback } from "react";
import { steamAPI } from "../services/api";

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

    console.log('🎮 Iniciando carga de juegos...');
    console.log('📋 Filtros actuales:', {
      searchTerm,
      generoSeleccionado,
      plataformaSeleccionada,
      pagina: paginacion.pagina
    });

    let data;

    // Si hay término de búsqueda, usar la función de búsqueda
    if (searchTerm.trim()) {
      console.log('🔍 Usando búsqueda:', searchTerm);
      data = await steamAPI.buscarJuegos(searchTerm);
    }
    // Caso general: obtener todos los juegos con paginación
    else {
      const params = {
        pagina: paginacion.pagina,
        limite: 20,
      };

      // Agregar filtros solo si no son los valores por defecto
      if (generoSeleccionado !== "todos") {
        params.genero = generoSeleccionado;
      }
      
      if (plataformaSeleccionada !== "todas") {
        params.plataforma = plataformaSeleccionada;
      }

      console.log('📊 Parámetros para API:', params);
      data = await steamAPI.getJuegos(params);
    }

    console.log('📦 Datos recibidos de API:', data);

    // ✅ Manejar diferentes estructuras de respuesta
    const juegosData = data.juegos || data.data || [];
    const total = data.paginacion?.total_juegos || data.total || data.meta?.total || 1000;
    const paginaActual = data.paginacion?.pagina_actual || data.pagina || data.meta?.current_page || 1;
    const totalPaginas = data.paginacion?.total_paginas || data.totalPaginas || data.meta?.last_page || Math.ceil(total / 20);

    console.log('📊 Estadísticas:', {
      juegosRecibidos: juegosData.length,
      total,
      paginaActual,
      totalPaginas
    });

    setJuegos(juegosData);
    setPaginacion({
      pagina: paginaActual,
      total: total,
      totalPaginas: totalPaginas,
    });

    console.log(`✅ ${juegosData.length} juegos cargados desde IGDB`);
    
  } catch (err) {
    console.error("❌ Error cargando juegos:", err);
    setError(err.message || "No se pudieron cargar los juegos");
    setJuegos([]);
  } finally {
    setLoading(false);
  }
}, [searchTerm, generoSeleccionado, plataformaSeleccionada, paginacion.pagina]);

  // Cargar juegos cuando cambien los filtros o página
  useEffect(() => {
    cargarJuegos();
  }, [cargarJuegos]);

  const cargarGeneros = async () => {
    try {
      const data = await steamAPI.getGeneros();
      console.log("📊 Datos de géneros recibidos:", data);
      
      let generos = [];
      
      if (Array.isArray(data)) {
        generos = data;
      } else if (data?.data && Array.isArray(data.data)) {
        generos = data.data;
      } else if (data?.generos && Array.isArray(data.generos)) {
        generos = data.generos;
      }
      
      const generosProcesados = generos.map(genero => {
        if (typeof genero === 'string') return genero;
        if (genero?.name) return { id: genero.id, nombre: genero.name };
        if (genero?.nombre) return { id: genero.id, nombre: genero.nombre };
        return { id: genero.id, nombre: String(genero) };
      }).filter(genero => genero.nombre); 
      
      console.log("🎯 Géneros procesados:", generosProcesados);
      setGenerosDisponibles(generosProcesados);
      
    } catch (err) {
      console.error('Error cargando géneros:', err);

      setGenerosDisponibles([
        { id: "action", nombre: "Action" },
        { id: "adventure", nombre: "Adventure" },
        { id: "rpg", nombre: "RPG" },
        { id: "strategy", nombre: "Strategy" },
        { id: "simulation", nombre: "Simulation" },
        { id: "sports", nombre: "Sports" },
        { id: "racing", nombre: "Racing" },
        { id: "indie", nombre: "Indie" }
      ]);
    }
  };

  const cargarPlataformas = async () => {
    try {
      const data = await steamAPI.getPlataformas();
      console.log("🎮 Datos de plataformas recibidos:", data);
      
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
      
      console.log("🖥️ Plataformas procesadas:", plataformasProcesadas);
      setPlataformasDisponibles(plataformasProcesadas);
      
    } catch (err) {
      console.error('Error cargando plataformas:', err);

      setPlataformasDisponibles([
        { id: "4", nombre: "PC" },
        { id: "187", nombre: "PlayStation 5" },
        { id: "18", nombre: "PlayStation 4" },
        { id: "1", nombre: "Xbox Series X" },
        { id: "7", nombre: "Nintendo Switch" }
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

  const getSafeImage = (game) => {

    if (game?.background_image) {
      return game.background_image;
    }
    

    if (game?.cover?.image_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
    }
    
    if (game?.cover?.url) {
      const imageId = game.cover.url.split('/').pop()?.replace('.jpg', '');
      if (imageId) {
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
      }
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

  const getRating = (game) => {
    if (!game || !game.rating) {
      return "N/A";
    }
    return game.rating.toFixed(1);
  };

  const getReleaseDate = (game) => {
    if (!game || !game.released) {
      return "Próximamente";
    }
    return new Date(game.released).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short'
    });
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
            Explora miles de juegos con información detallada de IGDB
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
              "Cargando juegos desde IGDB..."
            ) : (
              <>
                Mostrando <span className="text-[#A56BFA] font-bold">{juegos.length}</span> de{" "}
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
            <p className="mt-4 text-[#A593C7]">Cargando juegos desde IGDB...</p>
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
                  key={game?.id || index}
                  className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform group"
                >
                  {/* Imagen del Juego */}
                  <div className="relative">
                    <img
                      src={getSafeImage(game)}
                      alt={getSafeName(game)}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop";
                      }}
                    />
                    {/* Rating */}
                    {game.rating && (
                      <div className="absolute top-3 right-3 bg-[#7B3FE4] text-white px-2 py-1 rounded-full text-sm font-bold">
                        ⭐ {getRating(game)}
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#A56BFA] transition-colors line-clamp-2">
                      {getSafeName(game)}
                    </h3>

                    {/* Fecha de lanzamiento */}
                    <div className="mb-2">
                      <span className="bg-[#4A2B6B] text-[#A593C7] px-2 py-1 rounded text-xs">
                        🗓️ {getReleaseDate(game)}
                      </span>
                    </div>

                    {/* Géneros */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {getGenerosJuego(game).map((genero, idx) => (
                        <span
                          key={idx}
                          className="bg-[#7B3FE4]/20 text-[#A56BFA] px-2 py-1 rounded text-xs"
                        >
                          {genero}
                        </span>
                      ))}
                    </div>

                    {/* Plataformas */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {getPlataformasJuego(game).map((plataforma, idx) => (
                        <span
                          key={idx}
                          className="bg-[#A56BFA]/20 text-[#E4D9F9] px-2 py-1 rounded text-xs"
                        >
                          {plataforma}
                        </span>
                      ))}
                    </div>

                    <p className="text-[#A593C7] text-sm mb-4 line-clamp-2">
                      {getSafeDescription(game)}
                    </p>

                    <button
                      onClick={() => window.open(`https://www.igdb.com/games/${game.slug || game.id}`, '_blank')}
                      className="w-full bg-[#7B3FE4] hover:bg-[#A56BFA] text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      Ver en IGDB
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

        {/* Información de la API */}
        <div className="mt-12 text-center">
          <p className="text-[#A593C7] text-sm">
            Datos proporcionados por <a href="https://www.igdb.com" target="_blank" rel="noopener noreferrer" className="text-[#A56BFA] hover:underline">IGDB API</a>
          </p>
        </div>
      </div>
    </div>
  );
}