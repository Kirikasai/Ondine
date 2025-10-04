import logo from "../../assets/ondine.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#0a192f] via-[#0455BF] to-[#1e293b] bg-opacity-95 text-white px-8 py-4 flex justify-between items-center shadow-lg border-b border-blue-900/30 z-20 relative">
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src={logo}
          alt="Ondine Logo"
          className="w-20 h-20  p-1 group-hover:scale-105 transition-transform"
        />
        <span className="text-2xl font-bold tracking-widest drop-shadow-md group-hover:text-blue-200 transition-colors">
          ONDINE
        </span>
      </Link>
      <nav className="flex text-lg gap-6 md:gap-6">
        <Link to="/" className="hover:text-yellow-200 transition-colors">Inicio</Link>
        <Link to="/foros" className="hover:text-yellow-200 transition-colors">Foros</Link>
        <Link to="/blogs" className="hover:text-yellow-200 transition-colors">Blogs</Link>
        <Link to="/eventos" className="hover:text-yellow-200 transition-colors">Eventos</Link>
        <Link to="/login" className="hover:text-yellow-200 transition-colors">Login</Link>
        <Link
          to="/register"
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-lg font-semibold shadow hover:scale-105 transition-all border border-white/10"
        >
          Registro
        </Link>
      </nav>
    </header>
  );
}
