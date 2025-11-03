import { useEffect, useState, useCallback } from "react";
import { newsAPI } from "../services/api";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoria, setCategoria] = useState("videojuegos");
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    total: 0,
    totalPaginas: 0
  });
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  // Cargar categorías disponibles al inicio
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarNoticias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📰 Cargando noticias de: ${categoria}, página: ${paginacion.pagina}`);
      
      const data = await newsAPI.getNoticias({
        categoria: categoria,
        pagina: paginacion.pagina,
        limite: 9
      });
      
      const noticiasData = data.noticias || data.data || [];
      const total = data.paginacion?.total_noticias || data.total || 0;
      const paginaActual = data.paginacion?.pagina_actual || data.pagina || 1;
      const totalPaginas = data.paginacion?.total_paginas || data.totalPaginas || 1;
      
      setNoticias(noticiasData);
      setPaginacion({
        pagina: paginaActual,
        total: total,
        totalPaginas: totalPaginas
      });
      
      console.log(`✅ ${noticiasData.length} noticias cargadas`);
      
    } catch (err) {
      console.error('Error cargando noticias:', err);
      setError(err.message || 'No se pudieron cargar las noticias');
      setNoticias([]);
    } finally {
      setLoading(false);
    }
  }, [categoria, paginacion.pagina]);

  useEffect(() => {
    cargarNoticias();
  }, [cargarNoticias]);

  const cargarCategorias = async () => {
    try {
      const data = await newsAPI.getCategorias();
      
      if (data.categorias && Array.isArray(data.categorias)) {
        const categoriasIds = data.categorias.map(cat => cat.id);
        setCategoriasDisponibles(categoriasIds);
      } else {
        
        setCategoriasDisponibles([
          "videojuegos", "esports", "playstation", "xbox", "nintendo", 
          "pc-gaming", "mobile-gaming", "realidad-virtual"
        ]);
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setCategoriasDisponibles([
        "videojuegos", "esports", "playstation", "xbox", "nintendo", 
        "pc-gaming", "mobile-gaming", "realidad-virtual"
      ]);
    }
  };

  const handleCategoriaChange = (nuevaCategoria) => {
    setCategoria(nuevaCategoria);
    setPaginacion(prev => ({ ...prev, pagina: 1 }));
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.totalPaginas) {
      setPaginacion(prev => ({ ...prev, pagina: nuevaPagina }));
    }
  };

  const getCategoriaNombre = (catId) => {
    const categoriasMap = {
      "videojuegos": "🎮 Videojuegos",
      "esports": "🏆 eSports", 
      "playstation": "🎯 PlayStation",
      "xbox": "🟩 Xbox",
      "nintendo": "🔴 Nintendo",
      "pc-gaming": "💻 PC Gaming",
      "mobile-gaming": "📱 Mobile Gaming",
      "realidad-virtual": "🥽 Realidad Virtual",
      "gaming": "🎮 Gaming General"
    };

    const categoriaId = typeof catId === 'string' ? catId : String(catId);
    
    return categoriasMap[categoriaId] || `📰 ${categoriaId.charAt(0).toUpperCase() + categoriaId.slice(1)}`;
  };

  // Función para formatear fecha
  const formatFecha = (fechaString) => {
    try {
      if (!fechaString) return "Fecha no disponible";
      
      const fecha = new Date(fechaString);
      const ahora = new Date();
      const diferencia = ahora - fecha;
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      
      if (dias === 0) {
        return "Hoy";
      } else if (dias === 1) {
        return "Ayer";
      } else if (dias < 7) {
        return `Hace ${dias} días`;
      } else {
        return fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch {
      return "Fecha no disponible";
    }
  };

  // Función para obtener imagen 
  const getSafeImage = (noticia) => {
    if (noticia.urlToImage && noticia.urlToImage !== "null") {
      return noticia.urlToImage;
    }
    if (noticia.image_url) {
      return noticia.image_url;
    }
    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop";
  };

  // Función para obtener título 
  const getSafeTitle = (noticia) => {
    return noticia.title || "Título no disponible";
  };

  // Función para obtener descripción 
  const getSafeDescription = (noticia) => {
    return noticia.description || noticia.content || "Descripción no disponible";
  };

  // Función para obtener fuente 
  const getSafeSource = (noticia) => {
    if (noticia.source?.name) {
      return noticia.source.name;
    }
    if (noticia.source_name) {
      return noticia.source_name;
    }
    return "Fuente";
  };

  // Función para obtener URL 
  const getSafeUrl = (noticia) => {
    return noticia.url || noticia.article_url || "#";
  };

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#A56BFA]">
            Noticias de Gaming
          </h1>
          <p className="text-lg text-[#A593C7] max-w-2xl mx-auto">
            Las últimas noticias y novedades del mundo de los videojuegos
          </p>
        </div>

        {/* Filtros de Categorías */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categoriasDisponibles.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoriaChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoria === cat
                  ? "bg-[#7B3FE4] text-white shadow-lg"
                  : "bg-[#2D1B3A] text-[#A593C7] hover:bg-[#3D2B4A] border border-[#7B3FE4]/30"
              }`}
            >
              {getCategoriaNombre(cat)}
            </button>
          ))}
        </div>

        {/* Información de Resultados */}
        <div className="text-center mb-8">
          <p className="text-[#A593C7]">
            {loading ? (
              "Cargando noticias..."
            ) : (
              <>
                Categoría: <span className="text-white font-bold">{getCategoriaNombre(categoria)}</span>
                {paginacion.total > 0 && (
                  <> • <span className="text-[#A56BFA] font-bold">{noticias.length}</span> de <span className="text-white">{paginacion.total}</span> noticias</>
                )}
                <> • Página <span className="text-white">{paginacion.pagina}</span> de <span className="text-white">{paginacion.totalPaginas}</span></>
              </>
            )}
          </p>
        </div>

        {/* Estado de Carga */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA]"></div>
            <p className="mt-4 text-[#A593C7]">Buscando noticias sobre {getCategoriaNombre(categoria)}...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8 bg-red-900/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-red-400 text-lg mb-2">❌ {error}</p>
            <button
              onClick={cargarNoticias}
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de Noticias */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticias.map((noticia, index) => (
                <article
                  key={noticia?.id || index}
                  className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform group h-full flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative overflow-hidden flex-shrink-0">
                    <img
                      src={getSafeImage(noticia)}
                      alt={getSafeTitle(noticia)}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#7B3FE4] text-white px-3 py-1 rounded-full text-xs font-medium">
                        {getSafeSource(noticia)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatFecha(noticia.publishedAt || noticia.published_at)}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-3">
                      <span className="text-[#A56BFA] text-sm font-medium">
                        {getCategoriaNombre(categoria).toUpperCase()}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-white group-hover:text-[#A56BFA] transition-colors line-clamp-2 flex-grow-0">
                      {getSafeTitle(noticia)}
                    </h2>

                    <p className="text-[#A593C7] text-sm mb-4 line-clamp-3 flex-grow">
                      {getSafeDescription(noticia)}
                    </p>

                    <div className="flex justify-between items-center mt-auto">
                      <a
                        href={getSafeUrl(noticia)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
                      >
                        Leer Noticia
                      </a>
                      <span className="text-[#A593C7] text-xs max-w-[100px] truncate">
                        {getSafeSource(noticia)}
                      </span>
                    </div>
                  </div>
                </article>
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
        {!loading && !error && noticias.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[#A593C7] text-lg mb-2">No se encontraron noticias</p>
            <p className="text-[#A593C7] text-sm">
              No hay noticias disponibles para {getCategoriaNombre(categoria)} en este momento.
            </p>
            <button
              onClick={() => handleCategoriaChange("videojuegos")}
              className="mt-4 bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Ver noticias generales
            </button>
          </div>
        )}

        {/* Información de la API */}
        <div className="mt-12 text-center">
          <p className="text-[#A593C7] text-sm">
            Noticias proporcionadas por <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-[#A56BFA] hover:underline">NewsAPI</a>
          </p>
        </div>
      </div>
    </div>
  );
}