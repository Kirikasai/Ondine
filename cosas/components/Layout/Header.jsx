import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-indigo-800 text-white px-6 py-4 flex justify-between items-center shadow">
      
      <Link to="/" className="text-2xl font-bold tracking-wide">
        ONDINE
      </Link>

      <nav className="space-x-6">
        <Link to="/" className="hover:text-yellow-400">Inicio</Link>
        <Link to="/foros" className="hover:text-yellow-400">Foros</Link>
        <Link to="/blogs" className="hover:text-yellow-400">Blogs</Link>
        <Link to="/eventos" className="hover:text-yellow-400">Eventos</Link>
        <Link to="/login" className="hover:text-yellow-400">Login</Link>
        <Link to="/register" className="hover:text-yellow-400">Registro</Link>
      </nav>
    </header>
  );
}
