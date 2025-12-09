import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../Services/api";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle,
  Share2,
  Bookmark,
  Tag,
  Clock,
  Gamepad2,
  Trophy,
  Star,
  Zap,
  Sword,
  Shield,
  Trash2
} from "lucide-react";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [likesInfo, setLikesInfo] = useState({ likes_count: 0, user_liked: false });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    cargarBlog();
    cargarComentarios();
    cargarLikesInfo();
  }, [id]);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  };

  const cargarBlog = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Cargando blog con ID:", id);
      
      // ✅ Usar authAPI.get en lugar de getBlog
      const response = await authAPI.get(`/blogs/${id}`);
      console.log("📊 Respuesta de blog:", response);

      // Manejar distintos formatos de respuesta
      let blogData = response.blog || response.data?.blog || response.data || response;

      if (!blogData || !blogData.id) {
        throw new Error("No se recibieron datos del blog válidos");
      }

      console.log("✅ Blog cargado:", blogData);
      setBlog(blogData);
      
      // Usar usuario incluido en la respuesta
      if (blogData.usuario) {
        setUsuario(blogData.usuario);
      }
      
    } catch (err) {
      console.error("❌ Error cargando blog:", err);
      setError("No se pudo cargar el blog solicitado");
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  const cargarComentarios = async () => {
    try {
      const response = await authAPI.getBlogComments(id);
      const comentariosData = Array.isArray(response) ? response : (response.data || []);
      setComentarios(comentariosData);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setComentarios([]);
    }
  };

  const cargarLikesInfo = async () => {
    try {
      const response = await authAPI.getBlogLikesInfo(id);
      setLikesInfo({
        likes_count: response.likes_count || 0,
        user_liked: response.user_liked || false
      });
    } catch (err) {
      console.error("Error cargando información de likes:", err);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await authAPI.likeBlog(id);
      
      setLikesInfo({
        likes_count: response.likes_count,
        user_liked: response.user_liked
      });
    } catch (err) {
      console.error("Error dando like:", err);
      if (err.message?.includes('401')) {
        navigate('/login');
      }
    }
  };

  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!nuevoComentario.trim()) return;

    try {
      const response = await authAPI.addBlogComment(id, nuevoComentario);

      const nuevoComentarioData = response.comentario || response.data?.comentario || response;
      
      // Agregar el nuevo comentario a la lista
      setComentarios(prev => [...prev, nuevoComentarioData]);
      setNuevoComentario("");
    } catch (err) {
      console.error("Error enviando comentario:", err);
      if (err.message?.includes('401')) {
        navigate('/login');
      }
    }
  };

  const handleEliminarComentario = async (comentarioId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    try {
      await authAPI.deleteBlogComment(id, comentarioId);
      setComentarios(prev => prev.filter(c => c.id !== comentarioId));
    } catch (err) {
      console.error("Error eliminando comentario:", err);
    }
  };

  function parseTags(etiquetas) {
    if (!etiquetas) return [];
    if (Array.isArray(etiquetas)) {
      return etiquetas.map(t => (typeof t === 'string' ? t : (t.name || t.label || JSON.stringify(t))));
    }
    if (typeof etiquetas === 'object') {
      return [etiquetas.name || etiquetas.label || JSON.stringify(etiquetas)];
    }
    if (typeof etiquetas === 'string') {
      const raw = etiquetas.trim();
      // try JSON array string first
      if (raw.startsWith('[') || raw.startsWith('{')) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.map(String);
          if (typeof parsed === 'object' && parsed !== null) return [parsed.name || parsed.label || JSON.stringify(parsed)];
        } catch (e) { /* not JSON */ }
      }
      // otherwise split by commas
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto mb-4"></div>
          <p className="text-[#A593C7]">Cargando blog...</p>
        </div>
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/blogs')}
            className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a Blogs
          </button>
        </div>
      </div>
    );
  }

  const etiquetas = parseTags(blog?.etiquetas);

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-[#A593C7] hover:text-[#E4D9F9] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a Blogs
        </button>

        {/* Header del Blog */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-8">
          {/* Encabezado Gaming */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-[#7B3FE4]/20 px-3 py-1 rounded-full">
              <Gamepad2 size={16} className="text-[#A56BFA]" />
              <span className="text-[#A56BFA] text-sm font-medium">
                {blog?.juego || "Videojuego"}
              </span>
            </div>
            
            {blog?.dificultad && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                blog.dificultad === "Alta" ? "bg-red-500/20 text-red-400" :
                blog.dificultad === "Media" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-green-500/20 text-green-400"
              }`}>
                <Zap size={14} />
                <span>Dificultad: {blog.dificultad}</span>
              </div>
            )}
          </div>

          {etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {etiquetas.map((etiqueta, idx) => (
                <span key={idx} className="bg-[#7B3FE4]/20 text-[#A56BFA] px-3 py-1 rounded-full text-sm">
                  #{etiqueta}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            {blog?.titulo || "Título no disponible"}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-[#A593C7] mb-6">
            {/* Autor */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7B3FE4] to-[#A56BFA] rounded-full flex items-center justify-center text-white font-bold">
                {usuario?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-white font-medium">{usuario?.nombre_usuario || 'Usuario'}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Trophy size={14} />
                  <span>{usuario?.reputacion || 0} reputación</span>
                </div>
              </div>
            </div>
            
            {/* Fecha */}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{blog?.creado_en ? new Date(blog.creado_en).toLocaleDateString('es-ES') : 'Fecha no disponible'}</span>
            </div>
            
            {/* Tiempo de lectura estimado */}
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{blog?.tiempo_lectura || Math.ceil(blog?.contenido?.length / 1000) || 5} min lectura</span>
            </div>
          </div>

          {/* Stats Gaming */}
          <div className="flex flex-wrap gap-6 pt-6 border-t border-[#7B3FE4]/30">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-[#A56BFA]" />
              <span className="text-white font-medium">{blog?.vistas?.toLocaleString() || '0'}</span>
              <span className="text-[#A593C7]">vistas</span>
            </div>
            
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                likesInfo.user_liked ? 'text-red-500' : 'text-[#A593C7] hover:text-red-400'
              }`}
            >
              <Heart size={18} fill={likesInfo.user_liked ? "currentColor" : "none"} />
              <span className="text-white font-medium">{likesInfo.likes_count}</span>
              <span className="text-[#A593C7]">likes</span>
            </button>
            
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-[#A56BFA]" />
              <span className="text-white font-medium">{comentarios.length}</span>
              <span className="text-[#A593C7]">comentarios</span>
            </div>
          </div>
        </div>

        {/* Contenido del Blog */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-8">
          <article 
            className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-[#E4D9F9] prose-strong:text-white prose-li:text-[#E4D9F9] prose-code:text-[#A56BFA] prose-pre:bg-[#1B1128] prose-pre:border prose-pre:border-[#7B3FE4]/30"
            dangerouslySetInnerHTML={{ __html: blog?.contenido || "Contenido no disponible" }}
          />
          
          {/* Acciones */}
          <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-[#7B3FE4]/30">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                likesInfo.user_liked 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-[#7B3FE4] hover:bg-[#A56BFA] text-white'
              }`}
            >
              <Heart size={18} fill={likesInfo.user_liked ? "currentColor" : "none"} />
              {likesInfo.user_liked ? 'Quitar Like' : 'Me Gusta'}
            </button>
            
            <button className="flex items-center gap-2 border border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4] hover:text-white px-4 py-2 rounded-lg transition-colors">
              <Bookmark size={18} />
              Guardar
            </button>
            
            <button className="flex items-center gap-2 border border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4] hover:text-white px-4 py-2 rounded-lg transition-colors">
              <Share2 size={18} />
              Compartir
            </button>
          </div>
        </div>

        {/* Sección de Comentarios */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <MessageCircle size={24} className="text-[#A56BFA]" />
            Comentarios ({comentarios.length})
          </h2>
          
          {/* Formulario de Comentario */}
          {!isAuthenticated ? (
            <div className="text-center py-8 mb-8">
              <MessageCircle size={48} className="mx-auto text-[#A593C7] mb-4" />
              <p className="text-[#A593C7] mb-4">Inicia sesión para comentar</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleComentarioSubmit} className="mb-8">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Comparte tu opinión, experiencia o preguntas sobre esta guía..."
                rows="4"
                className="w-full bg-[#1B1128] border border-[#7B3FE4]/30 rounded-lg p-4 text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA] resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={!nuevoComentario.trim()}
                  className="bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#7B3FE4]/50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Publicar Comentario
                </button>
              </div>
            </form>
          )}
          
          {/* Lista de Comentarios */}
          <div className="space-y-6">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="bg-[#1B1128] rounded-lg p-6 border border-[#7B3FE4]/20 hover:border-[#A56BFA] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7B3FE4] to-[#A56BFA] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comentario.usuario?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">
                        {comentario.usuario?.nombre_usuario || 'Usuario'}
                      </h3>
                      <div className="flex items-center gap-1 text-[#A593C7] text-sm">
                        <Trophy size={14} />
                        <span>{comentario.usuario?.reputacion || 0} reputación</span>
                      </div>
                      <span className="text-[#A593C7] text-sm">
                        {comentario.creado_en ? new Date(comentario.creado_en).toLocaleDateString('es-ES') : 'Fecha no disponible'}
                      </span>
                      
                      {/* Botón eliminar comentario (solo para el autor) */}
                      {isAuthenticated && comentario.usuario_id === usuario?.id && (
                        <button 
                          onClick={() => handleEliminarComentario(comentario.id)}
                          className="text-red-400 hover:text-red-300 transition-colors ml-auto"
                          title="Eliminar comentario"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-[#E4D9F9] mb-3">{comentario.contenido}</p>
                    
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-[#A593C7] hover:text-[#A56BFA] transition-colors">
                        <Heart size={16} />
                        <span>{comentario.likes || 0}</span>
                      </button>
                      <button className="text-[#A593C7] hover:text-[#A56BFA] transition-colors text-sm">
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comentarios.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-[#A593C7] mb-4" />
              <p className="text-[#A593C7]">Aún no hay comentarios</p>
              <p className="text-[#A593C7] text-sm mt-1">
                {isAuthenticated ? 'Sé el primero en comentar' : 'Inicia sesión para comentar'}
              </p>
            </div>
          )}
        </div>

        {/* Información del Autor */}
        {usuario && (
          <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <User size={24} className="text-[#A56BFA]" />
              Sobre el Autor
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7B3FE4] to-[#A56BFA] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {usuario.nombre_usuario.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{usuario.nombre_usuario}</h3>
                <div className="flex items-center gap-2 text-[#A593C7] mb-3">
                  <Trophy size={16} />
                  <span>{usuario.reputacion} puntos de reputación</span>
                </div>
                <p className="text-[#E4D9F9]">
                  Miembro desde {usuario.creado_en ? new Date(usuario.creado_en).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'fecha desconocida'}
                </p>
              </div>
              
              <button
                onClick={() => navigate(`/perfil/${usuario.id}`)}
                className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Ver Perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}