import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../Services/api";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MessageCircle,
  ThumbsUp,
  Share2,
  Reply,
  Gamepad2,
  Tag,
  Users,
  Trophy
} from "lucide-react";

export default function HiloDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hilo, setHilo] = useState(null);
  const [foro, setForo] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nuevaRespuesta, setNuevaRespuesta] = useState("");

  useEffect(() => {
    cargarHilo();
    cargarRespuestas();
  }, [id]);

  const cargarHilo = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🔄 Cargando hilo gaming con ID:", id);
      
      const response = await authAPI.get(`/hilos/${id}`);
      console.log("📊 Respuesta de hilo:", response);
      
      const hiloData = response.data || response;
      console.log("📋 Datos del hilo:", hiloData);
      
      if (!hiloData) {
        throw new Error("No se recibieron datos del hilo");
      }
      
      setHilo(hiloData);
      
      // Cargar información del foro
      if (hiloData.foro_id) {
        try {
          const foroResponse = await authAPI.get(`/foros/${hiloData.foro_id}`);
          const foroData = foroResponse.data || foroResponse;
          setForo(foroData);
        } catch (foroError) {
          console.error("Error cargando foro:", foroError);
        }
      }
      
      // Cargar información del usuario
      if (hiloData.usuario_id) {
        try {
          const userResponse = await authAPI.get(`/usuarios/${hiloData.usuario_id}`);
          const userData = userResponse.data || userResponse;
          setUsuario(userData);
        } catch (userError) {
          console.error("Error cargando usuario:", userError);
        }
      }
      
    } catch (err) {
      console.error("❌ Error cargando hilo:", err);
      setError("No se pudo cargar el hilo solicitado");
      
      // Datos de ejemplo GAMING para desarrollo
      const hilosGaming = [
        {
          id: 1,
          titulo: "¿Cuál es el mejor build para Mago en Elden Ring? - Parche 1.10",
          cuerpo: `Estoy teniendo problemas para crear un build de mago efectivo en Elden Ring después del último parche. 

**Mi configuración actual:**
- Nivel: 125
- Inteligencia: 70
- Vigor: 40  
- Mente: 30

**Hechizos que uso:**
- Cometa de Azur
- Roca Brillante
- Niebla de la noche

**Problemas:**
1. El daño contra Malenia es muy bajo
2. Me quedo sin FP rápido en jefes largos
3. Muy vulnerable a ataques rápidos

¿Alguien tiene recomendaciones para mejorar este build? ¿Debería cambiar algunos hechizos o redistribuir atributos?`,
          foro_id: 1,
          usuario_id: 1,
          creado_en: new Date().toISOString(),
          juego: "Elden Ring",
          etiquetas: ["build", "mago", "pve"]
        },
        {
          id: 2,
          titulo: "Problemas de rendimiento en Cyberpunk 2077: Phantom Liberty - RTX 3060",
          cuerpo: `Hola comunidad, tengo una RTX 3060 y estoy experimentando bajones de FPS en Night City después de la actualización 2.1.

**Mi configuración:**
- CPU: Ryzen 5 5600X
- GPU: RTX 3060 12GB
- RAM: 16GB DDR4
- SSD: NVMe 1TB

**Configuración gráfica:**
- Calidad: Alto
- Ray Tracing: Desactivado
- DLSS: Calidad
- Resolución: 1080p

**Problemas:**
- FPS entre 45-60 en áreas densas
- Stuttering al conducir rápido
- Caídas bruscas en Dogtown

¿Alguien más tiene estos problemas? ¿Hay alguna configuración que recomienden?`,
          foro_id: 2,
          usuario_id: 2,
          creado_en: new Date().toISOString(),
          juego: "Cyberpunk 2077",
          etiquetas: ["rendimiento", "nvidia", "optimización"]
        },
        {
          id: 3,
          titulo: "Consejos para ranked en Valorant - Ascendente a Immortal",
          cuerpo: `Llegué a Ascendente 3 pero estoy atascado. Busco consejos para dar el salto a Immortal.

**Mi rol principal:** Controlador (Omen, Brimstone)
**Agentes secundarios:** Iniciador (Sova, Fade)

**Fortalezas:**
- Buen game sense
- Comunicación en equipo
- Utilidad básica decente

**Debilidades:**
- Toma de decisiones bajo presión
- Aim inconsistente en rounds clave
- Poco impacto cuando el equipo va perdiendo

¿Qué debo enfocar para mejorar? ¿Debería cambiar de rol o especializarme más en controladores?`,
          foro_id: 3,
          usuario_id: 3,
          creado_en: new Date().toISOString(),
          juego: "Valorant",
          etiquetas: ["ranked", "consejos", "competitive"]
        }
      ];

      const hiloEjemplo = hilosGaming.find(h => h.id === parseInt(id)) || hilosGaming[0];
      setHilo(hiloEjemplo);
      
      setUsuario({
        id: hiloEjemplo.usuario_id,
        nombre_usuario: "GamerPro",
        reputacion: 250
      });
      
      setForo({
        id: hiloEjemplo.foro_id,
        titulo: "Ayuda y Guías",
        descripcion: "Comparte tus problemas y encuentra soluciones"
      });
      
    } finally {
      setLoading(false);
    }
  };

  const cargarRespuestas = async () => {
    try {
      const response = await authAPI.get(`/hilos/${id}/respuestas`);
      const respuestasData = response.data || response || [];
      setRespuestas(Array.isArray(respuestasData) ? respuestasData : []);
    } catch (err) {
      console.error("Error cargando respuestas:", err);
      
      // Respuestas de ejemplo GAMING
      const respuestasEjemplo = {
        1: [
          {
            id: 1,
            cuerpo: "Para Malenia te recomiendo cambiar Cometa de Azur por Niebla de la noche. Ignora sus esquivaciones y hace daño constante. También sube Mente a 40 para tener más FP en la pelea.",
            usuario_id: 4,
            usuario: {
              id: 4,
              nombre_usuario: "SoulsMaster",
              reputacion: 420
            },
            creado_en: new Date().toISOString(),
            likes: 15
          },
          {
            id: 2,
            cuerpo: "No olvides el talismán de Radagon para casting speed y el Icono de la Diosa Velada para regeneración de FP. Con esa combinación + Niebla de la noche, Malenia se vuelve mucho más manejable.",
            usuario_id: 5,
            usuario: {
              id: 5,
              nombre_usuario: "EldenLoreExpert",
              reputacion: 380
            },
            creado_en: new Date().toISOString(),
            likes: 8
          }
        ],
        2: [
          {
            id: 3,
            cuerpo: "Prueba bajar las sombras a medio y desactivar el contacto con las sombras. En Night City esas dos opciones consumen mucho rendimiento con la 3060.",
            usuario_id: 6,
            usuario: {
              id: 6,
              nombre_usuario: "PCMasterRace",
              reputacion: 310
            },
            creado_en: new Date().toISOString(),
            likes: 12
          }
        ],
        3: [
          {
            id: 4,
            cuerpo: "Como controlador, enfócate en aprender line ups de humos para cada mapa. Un buen humo puede ganar rounds por sí solo. También practica tu comunicación - call outs precisos son clave en Ascendente+.",
            usuario_id: 7,
            usuario: {
              id: 7,
              nombre_usuario: "ValorantCoach",
              reputacion: 290
            },
            creado_en: new Date().toISOString(),
            likes: 20
          }
        ]
      };

      setRespuestas(respuestasEjemplo[parseInt(id)] || []);
    }
  };

  const handleRespuestaSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaRespuesta.trim()) return;

    try {
      await authAPI.post(`/hilos/${id}/respuestas`, {
        cuerpo: nuevaRespuesta
      });

      setNuevaRespuesta("");
      cargarRespuestas();
    } catch (err) {
      console.error("Error enviando respuesta:", err);
      alert("Error al enviar la respuesta. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A56BFA] mx-auto mb-4"></div>
          <p className="text-[#A593C7]">Cargando hilo...</p>
        </div>
      </div>
    );
  }

  if (error && !hilo) {
    return (
      <div className="min-h-screen bg-[#1B1128] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/foros')}
            className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a Foros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navegación */}
        <div className="flex items-center gap-2 text-sm text-[#A593C7] mb-8">
          <button
            onClick={() => navigate('/foros')}
            className="hover:text-[#E4D9F9] transition-colors"
          >
            Foros
          </button>
          <span>/</span>
          {foro && (
            <>
              <button
                onClick={() => navigate(`/foros/${foro.id}`)}
                className="hover:text-[#E4D9F9] transition-colors"
              >
                {foro.titulo}
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-[#E4D9F9]">Hilo</span>
        </div>

        {/* Hilo Principal */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-6">
          {/* Encabezado con info del juego */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-[#7B3FE4]/20 px-3 py-1 rounded-full">
              <Gamepad2 size={16} className="text-[#A56BFA]" />
              <span className="text-[#A56BFA] text-sm font-medium">
                {hilo?.juego || "Videojuego"}
              </span>
            </div>
            
            {hilo?.etiquetas && hilo.etiquetas.map((etiqueta, index) => (
              <span
                key={index}
                className="bg-[#7B3FE4]/10 text-[#A593C7] px-2 py-1 rounded-full text-xs"
              >
                <Tag size={12} className="inline mr-1" />
                {etiqueta}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-white mb-6">
            {hilo?.titulo || "Título no disponible"}
          </h1>
          
          {/* Info del Autor */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-[#1B1128] rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7B3FE4] to-[#A56BFA] rounded-full flex items-center justify-center text-white font-bold">
              {usuario?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{usuario?.nombre_usuario || 'Usuario'}</p>
              <div className="flex items-center gap-2 text-[#A593C7] text-sm">
                <Trophy size={14} />
                <span>{usuario?.reputacion || 0} reputación</span>
              </div>
            </div>
            <div className="text-[#A593C7] text-sm">
              <Calendar size={16} className="inline mr-1" />
              {hilo?.creado_en ? new Date(hilo.creado_en).toLocaleDateString('es-ES') : 'Fecha no disponible'}
            </div>
          </div>
          
          {/* Contenido del Hilo */}
          <div className="prose prose-invert max-w-none mb-6">
            <div className="text-[#E4D9F9] whitespace-pre-line leading-relaxed">
              {hilo?.cuerpo || "Contenido no disponible"}
            </div>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-4 pt-6 border-t border-[#7B3FE4]/30">
            <button className="flex items-center gap-2 text-[#A593C7] hover:text-[#A56BFA] transition-colors">
              <ThumbsUp size={18} />
              <span>Me Gusta</span>
            </button>
            
            <button className="flex items-center gap-2 text-[#A593C7] hover:text-[#A56BFA] transition-colors">
              <Share2 size={18} />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Respuestas */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={24} className="text-[#A56BFA]" />
            <h2 className="text-2xl font-bold text-white">
              Respuestas ({respuestas.length})
            </h2>
          </div>
          
          <div className="space-y-6">
            {respuestas.map((respuesta) => (
              <div key={respuesta.id} className="bg-[#1B1128] rounded-lg p-6 border border-[#7B3FE4]/20 hover:border-[#A56BFA]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7B3FE4] to-[#A56BFA] rounded-full flex items-center justify-center text-white font-bold">
                      {respuesta.usuario?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">
                        {respuesta.usuario?.nombre_usuario || 'Usuario'}
                      </h3>
                      <div className="flex items-center gap-1 text-[#A593C7] text-sm">
                        <Trophy size={14} />
                        <span>{respuesta.usuario?.reputacion || 0}</span>
                      </div>
                      <span className="text-[#A593C7] text-sm">
                        {respuesta.creado_en ? new Date(respuesta.creado_en).toLocaleDateString('es-ES') : 'Fecha no disponible'}
                      </span>
                    </div>
                    
                    <p className="text-[#E4D9F9] mb-4 whitespace-pre-line leading-relaxed">
                      {respuesta.cuerpo}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-[#A593C7] hover:text-[#A56BFA] transition-colors">
                        <ThumbsUp size={16} />
                        <span>{respuesta.likes || 0}</span>
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

          {respuestas.length === 0 && (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-[#A593C7] mb-4" />
              <p className="text-[#A593C7]">Aún no hay respuestas</p>
              <p className="text-[#A593C7] text-sm mt-1">Sé el primero en responder</p>
            </div>
          )}
        </div>

        {/* Formulario de Respuesta */}
        <div className="bg-[#2D1B3A] rounded-2xl shadow-xl border border-[#7B3FE4]/30 p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Reply size={20} />
            Tu Respuesta
          </h3>
          
          <form onSubmit={handleRespuestaSubmit}>
            <textarea
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              placeholder="Comparte tu experiencia, consejos o solución..."
              rows="6"
              className="w-full bg-[#1B1128] border border-[#7B3FE4]/30 rounded-lg p-4 text-white placeholder-[#A593C7] focus:outline-none focus:border-[#A56BFA] resize-none"
            />
            
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!nuevaRespuesta.trim()}
                className="flex items-center gap-2 bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#7B3FE4]/50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Reply size={18} />
                Publicar Respuesta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}