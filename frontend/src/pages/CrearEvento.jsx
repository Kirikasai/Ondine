import { Link } from "react-router-dom";

export default function CrearEvento() {
  return (
    <div className="min-h-screen bg-[#1B1128] text-[#E4D9F9] py-32 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/eventos" className="text-[#A56BFA] hover:underline mb-6 inline-block">
          ← Volver a eventos
        </Link>
        <h1 className="text-3xl font-bold text-[#A56BFA] mb-8">Crear Nuevo Evento</h1>
        <div className="bg-[#2D1B3A] border border-[#7B3FE4]/30 rounded-2xl p-8">
          <p className="text-[#A593C7] text-center">Página en construcción - Funcionalidad de crear eventos próximamente</p>
        </div>
      </div>
    </div>
  );
}