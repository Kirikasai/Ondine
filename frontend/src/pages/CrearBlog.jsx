import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../Services/api";
import { ArrowLeft, Save } from "lucide-react";

export default function CrearBlog() {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    etiquetas: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!form.titulo.trim()) {
      setError("El título es requerido");
      return;
    }
    if (form.titulo.length < 5) {
      setError("El título debe tener al menos 5 caracteres");
      return;
    }
    if (!form.contenido.trim()) {
      setError("El contenido es requerido");
      return;
    }
    if (form.contenido.length < 100) {
      setError("El contenido debe tener al menos 100 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.get('/blogs', {
        method: 'POST',
        body: {
          titulo: form.titulo,
          contenido: form.contenido,
          etiquetas: form.etiquetas
        }
      });
      setSuccess("✅ Blog creado exitosamente");
      setTimeout(() => navigate(`/blogs/${response.blog.id}`), 1500);
    } catch (err) {
      console.error("Error creando blog:", err);
      setError(`❌ ${err.message || "Error al crear el blog"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/blogs")}
            className="p-2 hover:bg-[#7B3FE4]/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#A56BFA]">Crear nuevo Blog</h1>
            <p className="text-[#A593C7]">Comparte tu conocimiento con la comunidad</p>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/20 border border-green-700 text-green-400 rounded-lg p-4 mb-6">
            {success}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Título del Blog <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Escribe un título atractivo y descriptivo"
                maxLength={255}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
                disabled={loading}
              />
              <p className="text-xs text-[#A593C7] mt-1">
                {form.titulo.length}/255 caracteres
              </p>
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Contenido <span className="text-red-500">*</span>
              </label>
              <textarea
                name="contenido"
                value={form.contenido}
                onChange={handleChange}
                placeholder="Escribe el contenido de tu blog (mínimo 100 caracteres). Puedes usar HTML para formato."
                rows={12}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors resize-none"
                disabled={loading}
              />
              <p className="text-xs text-[#A593C7] mt-1">
                {form.contenido.length}/5000 caracteres (mínimo 100)
              </p>
              <p className="text-xs text-[#A593C7] mt-2">
                💡 Consejo: Usa &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, etc. para estructurar tu contenido.
              </p>
            </div>

            {/* Etiquetas */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Etiquetas (opcional)
              </label>
              <input
                type="text"
                name="etiquetas"
                value={form.etiquetas}
                onChange={handleChange}
                placeholder="Elden Ring, Build, Guía (separadas por comas)"
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
                disabled={loading}
              />
              <p className="text-xs text-[#A593C7] mt-1">
                Separa las etiquetas con comas para que otros las encuentren fácilmente
              </p>
            </div>

            {/* Vista previa */}
            {form.titulo && (
              <div className="bg-[#1B1128] p-4 rounded-lg border border-[#7B3FE4]/20">
                <p className="text-xs text-[#A593C7] mb-2">📋 Vista previa:</p>
                <h3 className="text-lg font-bold text-white mb-2">{form.titulo}</h3>
                <p className="text-sm text-[#A593C7] line-clamp-3">
                  {form.contenido.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4]/10 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#7B3FE4] hover:bg-[#A56BFA] disabled:bg-[#4A2B6B] text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Publicar Blog
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}