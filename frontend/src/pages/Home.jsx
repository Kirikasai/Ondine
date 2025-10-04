import logo from "../assets/ondine.png";
import { Link } from "react-router-dom";
import { Swords, Waves, ScrollText } from "lucide-react";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-serif  bg-gradient-to-br from-[#14192f] via-[#012340] to-[#0455BF]">
        <section className="flex flex-col items-center justify-center text-center flex-grow py-20 px-4 z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-pulse pointer-events-none" />
            <img
              src={logo}
              alt="Ondine Logo"
              className="w-36 md:w-48 p-2 relative z-10"
              style={{ background: "none", boxShadow: "none" }}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-widest text-blue-100 flex items-center justify-center gap-4 uppercase">
            Bienvenido a <span className="golden-glow">Ondine</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl text-blue-200 font-semibold">
            Donde los videojuegos se convierten en{" "}
            <span className="golden-glow">leyenda</span>.
          </p>
          <Link
            to="/register"
            className="golden-btn px-10 py-3 rounded-xl font-extrabold shadow-lg border-2 border-yellow-300 hover:scale-110 transition-all duration-200 text-lg tracking-widest"
          >
            ¡Únete a la leyenda!
          </Link>
        </section>

        <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-12">
          <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 flex flex-col items-center border-2 border-blue-400/40 hover:scale-105 transition-transform duration-200 group">
            <Waves className="w-10 h-10 mb-3 text-blue-400 animate-float" />
            <h2 className="text-lg font-bold mb-2 text-blue-100 uppercase tracking-widest">
              Foros
            </h2>
            <p className="text-blue-200 text-center font-serif">
              Comparte tus historias y leyendas con otros navegantes.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 flex flex-col items-center border-2 border-yellow-300/40 hover:scale-105 transition-transform duration-200 group">
            <ScrollText className="w-10 h-10 mb-3 text-yellow-300 animate-float" />
            <h2 className="text-lg font-bold mb-2 text-blue-100 uppercase tracking-widest">
              Blogs
            </h2>
            <p className="text-blue-200 text-center font-serif">
              Escribe tus aventuras y comparte tu sabiduría ancestral.
            </p>
          </div>
          <div className="bg-white/10 text-white backdrop-blur-lg shadow-xl rounded-2xl p-8 flex flex-col items-center border-2 border-yellow-400/40 hover:scale-105 transition-transform duration-200 group">
            <Swords className="w-10 h-10 mb-3 text-yellow-400 animate-float" />
            <h2 className="text-lg font-bold mb-2 text-blue-100 uppercase tracking-widest">
              Eventos
            </h2>
            <p className="text-blue-200 text-center font-serif">
              Participa en desafíos y torneos dignos de héroes.
            </p>
          </div>
        </section>
    </div>
  );
}
