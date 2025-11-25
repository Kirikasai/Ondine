import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../Services/api";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
    cargarBlogs();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  };

  const cargarBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Usar tu API real
      const response = await authAPI.get('/blogs');
      console.log("📊 Respuesta de API:", response);
      
      // Manejar diferentes formatos de respuesta
      const blogsData = response.data?.blogs || response.data || response;
      
      if (Array.isArray(blogsData)) {
        setBlogs(blogsData);
      } else {
        console.error("Formato de respuesta inesperado:", blogsData);
        setBlogs([]);
      }
      
    } catch (err) {
      console.error("❌ Error cargando blogs:", err);
      setError("No se pudieron cargar los blogs");
      
      // En desarrollo, mostrar datos de ejemplo como fallback
      if (process.env.NODE_ENV === 'development') {
        console.log("🔄 Usando datos de ejemplo en desarrollo");
        setBlogs([
          {
            id: 1,
            titulo: "Guía Completa de Elden Ring: Consejos para Superar a los Jefes Más Difíciles",
            contenido: "Elden Ring ha revolucionado el género de los souls-like con su mundo abierto inmenso y lleno de secretos...",
            etiquetas: "elden ring,guías,jefes,rpg,souls-like,from software",
            usuario: { nombre_usuario: "GameMaster" },
            creado_en: new Date().toISOString(),
            vistas: 12500
          },
          {
            id: 2,
            titulo: "Cyberpunk 2077: Un Análisis Profundo Después del Lanzamiento de Phantom Liberty",
            contenido: "Cyberpunk 2077 ha tenido uno de los viajes más interesantes en la historia de los videojuegos...",
            etiquetas: "cyberpunk 2077,análisis,phantom liberty,cd projekt red,rpg,futurista",
            usuario: { nombre_usuario: "CyberReviewer" },
            creado_en: new Date().toISOString(),
            vistas: 8400
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para extraer texto plano del HTML para el preview
  const extractTextFromHTML = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Función para limitar el texto del preview
  const limitarTexto = (texto, limite = 150) => {
    if (!texto) return '';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto"></div>
        <p className="mt-4 text-[#A593C7]">Cargando blogs...</p>
      </div>
    </div>
  );

  if (error && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Error al cargar blogs</h3>
          <p className="text-[#A593C7] mb-6">{error}</p>
          <button
            onClick={cargarBlogs}
            className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#A56BFA] mb-2">Blogs de la Comunidad</h1>
            <p className="text-[#A593C7]">Descubre las experiencias y conocimientos compartidos por nuestra comunidad</p>
          </div>
          {isAuthenticated ? (
            <Link
              to="/blogs/crear"
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ✏️ Crear Blog
            </Link>
          ) : (
            <div className="text-[#A593C7] text-sm">
              <Link to="/login" className="text-[#A56BFA] hover:underline font-medium">
                Inicia sesión
              </Link> para crear blogs
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {blogs.map(blog => (
            <article key={blog.id} className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-6 hover:border-[#A56BFA]/50 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#A56BFA] transition-colors mb-2">
                    {blog.titulo}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-[#A593C7]">
                    <span>Por: <strong className="text-[#A56BFA]">{blog.usuario?.nombre_usuario || 'Usuario'}</strong></span>
                    <span>•</span>
                    <span>{formatFecha(blog.creado_en)}</span>
                    {blog.vistas && (
                      <>
                        <span>•</span>
                        <span>{blog.vistas} vistas</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[#A593C7] mb-4 line-clamp-3">
                {limitarTexto(extractTextFromHTML(blog.contenido))}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {blog.etiquetas && blog.etiquetas.split(',').map((etiqueta, index) => (
                    <span 
                      key={index}
                      className="bg-[#7B3FE4]/20 text-[#A56BFA] px-3 py-1 rounded-full text-sm"
                    >
                      #{etiqueta.trim()}
                    </span>
                  ))}
                </div>
                
                <Link
                  to={`/blogs/${blog.id}`}
                  className="text-[#A56BFA] hover:text-[#7B3FE4] font-medium text-sm transition-colors"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-[#A56BFA] mb-2">No hay blogs aún</h3>
            <p className="text-[#A593C7] mb-4">Sé el primero en compartir tu experiencia con la comunidad</p>
            {isAuthenticated ? (
              <Link
                to="/blogs/crear"
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg inline-block"
              >
                Crear primer blog
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg inline-block"
              >
                Únete para escribir
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}