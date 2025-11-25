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
  Shield
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

  useEffect(() => {
    cargarBlog();
    cargarComentarios();
  }, [id]);

  const cargarBlog = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Cargando blog gaming con ID:", id);

      const response = await authAPI.get(`/blogs/${id}`);
      console.log("📊 Respuesta de blog:", response);

      const blogData = response.data || response;
      console.log("📋 Datos del blog:", blogData);

      if (!blogData) {
        throw new Error("No se recibieron datos del blog");
      }

      setBlog(blogData);
      
      // Cargar información del usuario
      if (blogData.usuario_id) {
        try {
          const userResponse = await authAPI.get(`/usuarios/${blogData.usuario_id}`);
          const userData = userResponse.data || userResponse;
          setUsuario(userData);
        } catch (userError) {
          console.error("Error cargando usuario:", userError);
        }
      }
      
    } catch (err) {
      console.error("❌ Error cargando blog:", err);
      setError("No se pudo cargar el blog solicitado");

      // Sólo usar datos de ejemplo en desarrollo o si se pide demo via ?demo=1
      const isDev = process.env.NODE_ENV === "development";
      const urlParams = new URLSearchParams(window.location.search);
      const demoMode = urlParams.get("demo") === "1";

      if (isDev || demoMode) {
        // datos de ejemplo (mantén el array que ya tenías)
        const blogsGaming = [
          {
            id: 1,
            titulo: "Guía Completa: Build Óptimo de Mago en Elden Ring - Parche 1.10",
            contenido: `
              <h2>🎯 Introducción</h2>
              <p>Esta build de mago te permitirá dominar Elden Ring desde el early game hasta los jefes finales. Enfocada en daño a distancia y control de combate.</p>
              
              <h2>⚡ Atributos Recomendados</h2>
              <div class="bg-[#1B1128] p-4 rounded-lg my-4 border border-[#7B3FE4]/30">
                <ul class="space-y-2">
                  <li class="flex items-center gap-2"><strong>Inteligencia:</strong> <span class="text-[#A56BFA]">80</span> (Máximo daño de hechizos)</li>
                  <li class="flex items-center gap-2"><strong>Vigor:</strong> <span class="text-[#A56BFA]">50</span> (Supervivencia)</li>
                  <li class="flex items-center gap-2"><strong>Mente:</strong> <span class="text-[#A56BFA]">40</span> (FP para hechizos)</li>
                  <li class="flex items-center gap-2"><strong>Destreza:</strong> <span class="text-[#A56BFA]">18</span> (Requerimiento de armas)</li>
                </ul>
              </div>
              
              <h2>🔮 Hechizos Esenciales</h2>
              <h3>S-Tier (Imprescindibles)</h3>
              <ul>
                <li><strong>Cometa de Azur:</strong> Daño masivo a jefes</li>
                <li><strong>Roca Brillante:</strong> Daño rápido y eficiente</li>
                <li><strong>Niebla de la noche:</strong> Ignora escudos enemigos</li>
                <li><strong>Lluvia de estrellas:</strong> Excelente contra grupos</li>
              </ul>
              
              <h2>⚔️ Equipamiento</h2>
              <h3>Armas Principales</h3>
              <ul>
                <li><strong>Báculo de Lusat:</strong> +10% daño de hechizos (consumo extra de FP)</li>
                <li><strong>Báculo de la Prisionera:</strong> Scaling S en Inteligencia</li>
                <li><strong>Báculo de Carian:</strong> Mejor para hechizos de espadas</li>
              </ul>
              
              <h3>Talismanes</h3>
              <ul>
                <li><strong>Icono de la Diosa Velada:</strong> Regeneración continua de FP</li>
                <li><strong>Escarabeo de Graven-Masa:</strong> +8% daño de hechizos</li>
                <li><strong>Anillo de Filigrana de Dios:</strong> -25% coste de FP</li>
                <li><strong>Sello de Radagon:</strong> +30 a casting speed</li>
              </ul>
              
              <h2>🎮 Estrategias de Combate</h2>
              <h3>Contra Jefes Ágiles (Malenia, Maliketh)</h3>
              <p>Usa <strong>Niebla de la noche</strong> seguido de <strong>Roca Brillante</strong> para daño constante que no puede esquivar.</p>
              
              <h3>Contra Grupos</h3>
              <p><strong>Explosión de Cristal</strong> seguido de <strong>Lluvia de estrellas</strong> para control de área efectivo.</p>
              
              <h3>Contra Jefes Grandes (Dragones, Gigantes)</h3>
              <p><strong>Cometa de Azur</strong> con Física de Fuerza Desatada para daño masivo.</p>
              
              <h2>🌟 Consejos Avanzados</h2>
              <ul>
                <li>Usa el Frasco de Lágrima Cerúlea para recuperar FP en peleas largas</li>
                <li>Aprende a esquivar hacia adelante para mantener distancia óptima</li>
                <li>Combina hechizos con armas encantadas para versatilidad</li>
              </ul>
            `,
            usuario_id: 1,
            etiquetas: "Elden Ring, Build, Mago, PvE, Guía",
            creado_en: new Date().toISOString(),
            vistas: 12500,
            likes: 890,
            juego: "Elden Ring",
            dificultad: "Media",
            tiempo_lectura: "8 min"
          },
          {
            id: 2,
            titulo: "Análisis Técnico: Optimización de Cyberpunk 2077 2.1 para PC Media",
            contenido: `
              <h2>🎮 Introducción</h2>
              <p>Con la actualización 2.1 de Cyberpunk 2077, muchos jugadores buscan el equilibrio perfecto entre gráficos y rendimiento. Este análisis te ayudará a maximizar tu experiencia.</p>
              
              <h2>💻 Configuraciones Recomendadas por Hardware</h2>
              
              <h3>🟢 PC Baja Gama (GTX 1660, RX 580)</h3>
              <div class="bg-[#1B1128] p-4 rounded-lg my-4 border border-[#7B3FE4]/30">
                <ul>
                  <li><strong>Calidad Gráfica:</strong> Medio/Bajo</li>
                  <li><strong>DLSS/FSR:</strong> Calidad</li>
                  <li><strong>Sombras:</strong> Medio</li>
                  <li><strong>Reflejos:</strong> Bajo</li>
                  <li><strong>Población:</strong> Medio</li>
                  <li><strong>FPS Esperados:</strong> 45-60</li>
                </ul>
              </div>
              
              <h3>🟡 PC Media (RTX 3060, RX 6700 XT)</h3>
              <div class="bg-[#1B1128] p-4 rounded-lg my-4 border border-[#7B3FE4]/30">
                <ul>
                  <li><strong>Calidad Gráfica:</strong> Alto</li>
                  <li><strong>DLSS/FSR:</strong> Calidad</li>
                  <li><strong>Ray Tracing:</strong> Desactivado</li>
                  <li><strong>Sombras:</strong> Alto</li>
                  <li><strong>FPS Esperados:</strong> 60-80</li>
                </ul>
              </div>
              
              <h2>⚙️ Configuraciones Críticas para Rendimiento</h2>
              
              <h3>Opciones que MÁS afectan el FPS</h3>
              <ul>
                <li><strong>Contacto con las Sombras:</strong> Alto impacto - Recomendado: Medio</li>
                <li><strong>Calidad de Sombras:</strong> Alto impacto - Recomendado: Alto</li>
                <li><strong>Nivel de Detalle:</strong> Medio impacto - Recomendado: Alto</li>
                <li><strong>Densidad de Población:</strong> Medio impacto - Recomendado: Alto</li>
              </ul>
              
              <h2>🔧 Tweaks Avanzados</h2>
              
              <h3>Archivo de Configuración (Cyberpunk 2077\\engine\\config)</h3>
              <pre><code>[Streaming]
MaxMemoryInPool = 4096
MemoryLimit = 8192</code></pre>
              
              <h3>Configuración NVIDIA Control Panel</h3>
              <ul>
                <li>Low Latency Mode: Ultra</li>
                <li>Power Management: Prefer Maximum Performance</li>
                <li>Texture Filtering: High Performance</li>
              </ul>
              
              <h2>📊 Resultados de Benchmark</h2>
              <p>Con RTX 3060 + Ryzen 5 5600X:</p>
              <ul>
                <li><strong>1080p Alto + DLSS Calidad:</strong> 75 FPS promedio</li>
                <li><strong>1080p Ultra + DLSS Calidad:</strong> 62 FPS promedio</li>
                <li><strong>1440p Alto + DLSS Calidad:</strong> 55 FPS promedio</li>
              </ul>
            `,
            usuario_id: 2,
            etiquetas: "Cyberpunk 2077, Optimización, PC, Rendimiento, Guía",
            creado_en: new Date().toISOString(),
            vistas: 8400,
            likes: 450,
            juego: "Cyberpunk 2077",
            dificultad: "Baja",
            tiempo_lectura: "6 min"
          },
          {
            id: 3,
            titulo: "Meta Actual en Valorant: Mejores Agentes y Composición Ideal Episodio 7",
            contenido: `
              <h2>🎯 Meta del Episodio 7 Acto 2</h2>
              <p>El meta actual de Valorant ha evolucionado significativamente con las últimas actualizaciones. Te presentamos el análisis completo.</p>
              
              <h2>🏆 Tier List de Agentes</h2>
              
              <h3>S-Tier (Must Pick)</h3>
              <div class="bg-green-500/10 p-4 rounded-lg my-4 border border-green-500/30">
                <ul class="space-y-2">
                  <li><strong>Jett:</strong> Sigue siendo la duelista definitiva</li>
                  <li><strong>Omen:</strong> Versatilidad y movilidad incomparables</li>
                  <li><strong>Killjoy:</strong> Control de zona absoluto</li>
                  <li><strong>Skye:</strong> Información y curación combinadas</li>
                </ul>
              </div>
              
              <h3>A-Tier (Muy Fuertes)</h3>
              <div class="bg-blue-500/10 p-4 rounded-lg my-4 border border-blue-500/30">
                <ul class="space-y-2">
                  <li><strong>Raze:</strong> Daño explosivo y movilidad</li>
                  <li><strong>Viper:</strong> Control de mapa definitivo</li>
                  <li><strong>Sova:</strong> Información constante</li>
                  <li><strong>Fade:</strong> Alternativa agresiva a Sova</li>
                </ul>
              </div>
              
              <h2>🎮 Composición de Equipo Ideal</h2>
              
              <h3>Composición Meta Actual</h3>
              <div class="bg-[#1B1128] p-4 rounded-lg my-4 border border-[#7B3FE4]/30">
                <ul>
                  <li><strong>Duelista:</strong> Jett/Raze</li>
                  <li><strong>Iniciador:</strong> Skye/Sova</li>
                  <li><strong>Controlador:</strong> Omen/Viper</li>
                  <li><strong>Centinela:</strong> Killjoy/Cypher</li>
                </ul>
              </div>
              
              <h2>🗺️ Mejores Agentes por Mapa</h2>
              
              <h3>Bind</h3>
              <ul>
                <li><strong>S-Tier:</strong> Viper, Raze, Skye</li>
                <li><strong>A-Tier:</strong> Omen, Killjoy, Jett</li>
              </ul>
              
              <h3>Ascent</h3>
              <ul>
                <li><strong>S-Tier:</strong> Killjoy, Omen, Jett</li>
                <li><strong>A-Tier:</strong> Sova, Skye, Cypher</li>
              </ul>
              
              <h3>Haven</h3>
              <ul>
                <li><strong>S-Tier:</strong> Omen, Jett, Skye</li>
                <li><strong>A-Tier:</strong> Killjoy, Sova, Raze</li>
              </ul>
              
              <h2>💡 Estrategias de Meta</h2>
              
              <h3>Default Setup</h3>
              <p>La configuración por defecto más efectiva incluye:</p>
              <ul>
                <li>Controlador estableciendo humos tempranos</li>
                <li>Centinela preparando setups defensivos</li>
                <li>Iniciador buscando información</li>
                <li>Duelista listo para entrar</li>
              </ul>
              
              <h3>Execute Plays</h3>
              <p>Coordinación ideal para executes:</p>
              <ul>
                <li>Humos del controlador</li>
                <li>Revelaciones del iniciador</li>
                <li>Utilidad de daño de la duelista</li>
                <li>Flancos del segundo duelista</li>
              </ul>
              
              <h2>📈 Consejos para Subir de Rango</h2>
              <ul>
                <li>Enfócate en 2-3 agentes máximo</li>
                <li>Aprende line ups básicos para cada mapa</li>
                <li>Mejora tu comunicación de callouts</li>
                <li>Analiza tus demos para identificar errores</li>
              </ul>
            `,
            usuario_id: 3,
            etiquetas: "Valorant, Meta, Esports, Estrategia, Competitive",
            creado_en: new Date().toISOString(),
            vistas: 15600,
            likes: 1200,
            juego: "Valorant",
            dificultad: "Alta",
            tiempo_lectura: "10 min"
          }
        ];

        const blogEjemplo = blogsGaming.find(b => b.id === parseInt(id)) || blogsGaming[0];
        setBlog(blogEjemplo);
        
        // Simular usuario también (como ya hacía antes)
        setUsuario({
          id: blogEjemplo.usuario_id,
          nombre_usuario: "GameMaster",
          reputacion: 500
        });
      } else {
        // en producción no usar fallback: dejar blog null para mostrar error al usuario
        setBlog(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const cargarComentarios = async () => {
    try {
      const response = await authAPI.get(`/blogs/${id}/comentarios`);
      const comentariosData = response.data || response || [];
      setComentarios(Array.isArray(comentariosData) ? comentariosData : []);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      
      // Comentarios de ejemplo GAMING
      const comentariosEjemplo = {
        1: [
          {
            id: 1,
            contenido: "Excelente guía! Solo añadiría que el talismán de Radagon es imprescindible para el casting speed. Sin él, los hechizos son muy lentos contra jefes como Malenia.",
            usuario_id: 4,
            usuario: {
              id: 4,
              nombre_usuario: "SoulsVeteran",
              reputacion: 320
            },
            creado_en: new Date().toISOString(),
            likes: 25
          },
          {
            id: 2,
            contenido: "¿Recomiendas algún hechizo específico para Radagon/Elden Beast? Esa pelea me está costando mucho con mi build de mago.",
            usuario_id: 5,
            usuario: {
              id: 5,
              nombre_usuario: "TarnishedNoob",
              reputacion: 45
            },
            creado_en: new Date().toISOString(),
            likes: 8
          }
        ],
        2: [
          {
            id: 3,
            contenido: "Los tweaks del archivo de configuración me subieron 15 FPS en áreas densas. Gran descubrimiento!",
            usuario_id: 6,
            usuario: {
              id: 6,
              nombre_usuario: "PCOptimizer",
              reputacion: 180
            },
            creado_en: new Date().toISOString(),
            likes: 18
          }
        ],
        3: [
          {
            id: 4,
            contenido: "Falta mencionar a Astra en el tier list. Después de los buffs está volviendo al meta en mapas como Split y Pearl.",
            usuario_id: 7,
            usuario: {
              id: 7,
              nombre_usuario: "ValorantAnalyst",
              reputacion: 290
            },
            creado_en: new Date().toISOString(),
            likes: 32
          }
        ]
      };

      setComentarios(comentariosEjemplo[parseInt(id)] || []);
    }
  };

  const handleLike = async () => {
    try {
      await authAPI.post(`/blogs/${id}/like`);
      // Recargar blog para actualizar contadores
      cargarBlog();
    } catch (err) {
      console.error("Error dando like:", err);
    }
  };

  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      await authAPI.post(`/blogs/${id}/comentarios`, {
        contenido: nuevoComentario
      });

      setNuevoComentario("");
      cargarComentarios();
    } catch (err) {
      console.error("Error enviando comentario:", err);
    }
  };

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

          {blog?.etiquetas && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.etiquetas.split(',').map((etiqueta, index) => (
                <span
                  key={index}
                  className="bg-[#7B3FE4]/20 text-[#A56BFA] px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  <Tag size={14} />
                  {etiqueta.trim()}
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
              className="flex items-center gap-2 hover:text-[#A56BFA] transition-colors"
            >
              <Heart size={18} />
              <span className="text-white font-medium">{blog?.likes || 0}</span>
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
              className="flex items-center gap-2 bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Heart size={18} />
              Me Gusta
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
              <p className="text-[#A593C7] text-sm mt-1">Sé el primero en comentar</p>
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