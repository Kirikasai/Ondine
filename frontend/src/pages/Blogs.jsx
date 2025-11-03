import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      // Datos de ejemplo
      setBlogs([
        {
          id: 1,
          titulo: "Mi experiencia de 100 horas en Elden Ring: Guía para no sufrir",
          contenido: "Después de completar Elden Ring con más de 100 horas de juego, quiero compartir mis consejos para los nuevos jugadores que se aventuran en las Tierras Intermedias...",
          etiquetas: "eldenring,rpg,fromsoftware,guia,consejos",
          usuario: { nombre_usuario: "GamerPro" },
          creado_en: "2024-01-15T10:30:00"
        },
        {
          id: 2,
          titulo: "Cómo mejorar tu stream en Twitch: Lecciones de 2 años transmitiendo",
          contenido: "Después de 2 años haciendo streams diarios y creciendo hasta 5,000 seguidores, he aprendido algunas lecciones valiosas que quiero compartir...",
          etiquetas: "twitch,streaming,contenido,crecimiento,consejos",
          usuario: { nombre_usuario: "StreamMaster" },
          creado_en: "2024-01-14T14:20:00"
        }
      ]);
    } catch (err) {
      console.error(err);
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

  if (loading) return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto"></div>
        <p className="mt-4 text-[#A593C7]">Cargando blogs...</p>
      </div>
    </div>
  );

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

        <div className="space-y-6">
          {blogs.map(blog => (
            <article key={blog.id} className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-6 hover:border-[#A56BFA]/50 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#A56BFA] transition-colors mb-2">
                    {blog.titulo}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-[#A593C7]">
                    <span>Por: <strong className="text-[#A56BFA]">{blog.usuario.nombre_usuario}</strong></span>
                    <span>•</span>
                    <span>{formatFecha(blog.creado_en)}</span>
                  </div>
                </div>
              </div>

              <p className="text-[#A593C7] mb-4 line-clamp-3">
                {blog.contenido}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {blog.etiquetas.split(',').map((etiqueta, index) => (
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