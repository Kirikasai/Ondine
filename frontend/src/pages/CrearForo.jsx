import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../Services/api";
import { ArrowLeft, Save, MessageSquare } from "lucide-react";

export default function CrearForo() {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "general"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const categorias = [
    { id: "general", label: "General" },
    { id: "ayuda", label: "Ayuda y Soporte" },
    { id: "estrategia", label: "Estrategia y Tácticas" },
    { id: "eventos", label: "Eventos" },
    { id: "comunidad", label: "Comunidad" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
    if (form.contenido.length < 20) {
      setError("El contenido debe tener al menos 20 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/foros', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: form.titulo,
          contenido: form.contenido,
          categoria: form.categoria
        })
      }).then(r => r.json());

      if (response.error) throw new Error(response.error);

      setSuccess("✅ Tema creado exitosamente");
      setTimeout(() => navigate(`/foros/${response.foro?.id || response.data?.id}`), 1500);
    } catch (err) {
      console.error("Error creando foro:", err);
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/foros")}
            className="p-2 hover:bg-[#7B3FE4]/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#A56BFA]">Crear nuevo tema</h1>
            <p className="text-[#A593C7]">Inicia una conversación con la comunidad</p>
          </div>
        </div>

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

        <div className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Categoría
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
              >
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Escribe una pregunta o tema de discusión"
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
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="contenido"
                value={form.contenido}
                onChange={handleChange}
                placeholder="Desarrolla tu pregunta o tema con detalles"
                rows={8}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors resize-none"
                disabled={loading}
              />
              <p className="text-xs text-[#A593C7] mt-1">
                {form.contenido.length}/5000 caracteres (mínimo 20)
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/foros")}
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
                    <MessageSquare size={18} />
                    Crear Tema
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