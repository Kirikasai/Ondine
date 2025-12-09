import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../Services/api";
import { FileText, Plus } from "lucide-react";

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
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  };

  const cargarBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🔄 Cargando blogs del backend...");
      const response = await authAPI.get('/blogs');
      console.log("📊 Respuesta de blogs:", response);

      // Manejar distintos formatos de respuesta del backend
      let blogsList = [];

      if (Array.isArray(response)) {
        blogsList = response;
      } else if (Array.isArray(response.blogs)) {
        blogsList = response.blogs;
      } else if (response.blogs?.data && Array.isArray(response.blogs.data)) {
        blogsList = response.blogs.data;
      } else if (Array.isArray(response.data)) {
        blogsList = response.data;
      } else if (response.data?.blogs?.data && Array.isArray(response.data.blogs.data)) {
        blogsList = response.data.blogs.data;
      } else if (response.data?.blogs && Array.isArray(response.data.blogs)) {
        blogsList = response.data.blogs;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        blogsList = response.data.data;
      }

      console.log("✅ Blogs cargados:", blogsList);
      setBlogs(blogsList);
    } catch (err) {
      console.error("❌ Error cargando blogs:", err);
      setError("No se pudieron cargar los blogs");
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseTags = (etiquetas) => {
    if (!etiquetas) return [];
    if (Array.isArray(etiquetas)) return etiquetas.map(String);
    if (typeof etiquetas === 'string') {
      const raw = etiquetas.trim();
      try {
        if (raw.startsWith('[') || raw.startsWith('{')) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.map(String);
        }
      } catch (e) {}
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
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
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Crear Blog
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
          <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-lg p-4 mb-8">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {blogs.length > 0 ? (
            blogs.map(blog => (
              <article key={blog.id} className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-6 hover:border-[#A56BFA]/50 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white group-hover:text-[#A56BFA] transition-colors mb-2">
                      {blog.titulo}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-[#A593C7] flex-wrap gap-2">
                      <span>Por: <strong className="text-[#A56BFA]">{blog.usuario?.nombre_usuario || 'Usuario'}</strong></span>
                      <span>•</span>
                      <span>{formatFecha(blog.creado_en)}</span>
                      {blog.tiempo_lectura && (
                        <>
                          <span>•</span>
                          <span>⏱️ {blog.tiempo_lectura}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {blog.vistas && (
                    <div className="text-right text-[#A593C7] text-sm">
                      👁️ {blog.vistas.toLocaleString()} vistas
                    </div>
                  )}
                </div>

                {blog.contenido && (
                  <p className="text-[#A593C7] mb-4 line-clamp-3">
                    {typeof blog.contenido === 'string' 
                      ? blog.contenido.replace(/<[^>]*>/g, '') 
                      : blog.contenido}
                  </p>
                )}

                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {parseTags(blog.etiquetas).map((etiqueta, index) => (
                      <span 
                        key={index}
                        className="bg-[#7B3FE4]/20 text-[#A56BFA] px-3 py-1 rounded-full text-sm"
                      >
                        #{etiqueta}
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
            ))
          ) : (
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto text-[#A593C7] mb-4" />
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
    </div>
  );
}