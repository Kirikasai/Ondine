import logo from "../../assets/ondine.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#1B1128]/95 text-[#E4D9F9] px-8 py-4 flex justify-between items-center border-b border-[#7B3FE4]/30 shadow-md fixed top-0 w-full z-50 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src={logo}
          alt="Ondine Logo"
          className="w-14 h-14 transition-transform group-hover:scale-105"
        />
        <span className="text-2xl font-bold tracking-widest text-[#A56BFA] group-hover:text-[#E4D9F9] transition-colors">
          ONDINE
        </span>
      </Link>

      <nav className="flex text-lg gap-6 font-medium">
        <Link to="/" className="hover:text-[#A56BFA] transition-colors">
          Inicio
        </Link>
        <Link to="/juegos" className="hover:text-[#A56BFA] transition-colors">
          Juegos
        </Link>

        <Link to="/foros" className="hover:text-[#A56BFA] transition-colors">
          Foros
        </Link>
        <Link to="/blogs" className="hover:text-[#A56BFA] transition-colors">
          Blogs
        </Link>
        <Link to="/eventos" className="hover:text-[#A56BFA] transition-colors">
          Eventos
        </Link>
        <Link to="/login" className="hover:text-[#A56BFA] transition-colors">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-1 rounded-md font-semibold shadow-md transition-all"
        >
          Registro
        </Link>
      </nav>
    </header>
  );
}
