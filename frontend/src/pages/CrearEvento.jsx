import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Calendar } from "lucide-react";

export default function CrearEvento() {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    ubicacion: "",
    tipo: "online"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const tipos = [
    { id: "online", label: "Online" },
    { id: "presencial", label: "Presencial" },
    { id: "hibrido", label: "Híbrido" }
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
    if (!form.descripcion.trim()) {
      setError("La descripción es requerida");
      return;
    }
    if (!form.fecha) {
      setError("La fecha es requerida");
      return;
    }
    if (!form.hora) {
      setError("La hora es requerida");
      return;
    }
    if (form.tipo !== "online" && !form.ubicacion.trim()) {
      setError("La ubicación es requerida para eventos presenciales");
      return;
    }

    // Validar que la fecha sea futura
    const fechaEvento = new Date(`${form.fecha}T${form.hora}`);
    if (fechaEvento < new Date()) {
      setError("La fecha y hora del evento deben ser en el futuro");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/eventos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: form.titulo,
          descripcion: form.descripcion,
          fecha: form.fecha,
          hora: form.hora,
          ubicacion: form.ubicacion,
          tipo: form.tipo
        })
      }).then(r => r.json());

      if (response.error) throw new Error(response.error);

      setSuccess("✅ Evento creado exitosamente");
      setTimeout(() => navigate(`/eventos/${response.evento?.id || response.data?.id}`), 1500);
    } catch (err) {
      console.error("Error creando evento:", err);
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
            onClick={() => navigate("/eventos")}
            className="p-2 hover:bg-[#7B3FE4]/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#A56BFA]">Crear nuevo evento</h1>
            <p className="text-[#A593C7]">Organiza una actividad para la comunidad</p>
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
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Título del evento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej: Torneo de Valorant, Streaming cooperativo, etc."
                maxLength={255}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
                disabled={loading}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Tipo de evento
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
              >
                {tipos.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe el evento, qué harán, reglas, etc."
                rows={6}
                className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors resize-none"
                disabled={loading}
              />
              <p className="text-xs text-[#A593C7] mt-1">
                {form.descripcion.length}/5000 caracteres
              </p>
            </div>

            {/* Fecha y Hora */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                  Hora <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="hora"
                  value={form.hora}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Ubicación (solo si no es online) */}
            {form.tipo !== "online" && (
              <div>
                <label className="block text-sm font-medium text-[#E4D9F9] mb-2">
                  Ubicación {form.tipo !== "online" && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  placeholder="Dirección o ubicación del evento"
                  className="w-full px-4 py-3 bg-[#E4D9F9]/10 border border-[#A56BFA]/30 rounded-lg text-white placeholder-[#A593C7] focus:outline-none focus:ring-2 focus:ring-[#7B3FE4] transition-colors"
                  disabled={loading}
                />
              </div>
            )}

            {form.tipo === "online" && (
              <div className="bg-[#7B3FE4]/20 p-4 rounded-lg">
                <p className="text-sm text-[#A593C7]">
                  💡 Los participantes recibirán el enlace del evento en la descripción o por mensaje privado
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/eventos")}
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
                    <Calendar size={18} />
                    Crear Evento
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