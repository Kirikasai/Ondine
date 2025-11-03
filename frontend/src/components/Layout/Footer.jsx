export default function Footer() {
  return (
    <footer className="bg-[#1B1128] text-[#A593C7] text-center py-8 border-t border-[#7B3FE4]/30">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        <p className="font-semibold tracking-wide text-[#E4D9F9]">
          © 2024 Ondine. Creado por Nuria Monroy Lorente.
        </p>
        <p className="text-sm text-[#A56BFA]">
          Forjado en la pasión por los videojuegos 🎮
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-[#A593C7] hover:text-[#A56BFA] transition-colors">
            Términos
          </a>
          <a href="#" className="text-[#A593C7] hover:text-[#A56BFA] transition-colors">
            Privacidad
          </a>
          <a href="#" className="text-[#A593C7] hover:text-[#A56BFA] transition-colors">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
