import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/ondine.png";

export default function Header() {
  const [openCommunity, setOpenCommunity] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const communityRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();

    function handleOutside(e) {
      if (communityRef.current && !communityRef.current.contains(e.target)) {
        setOpenCommunity(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") setOpenCommunity(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <header className="bg-[#1B1128]/95 text-[#E4D9F9] px-8 py-4 flex justify-between items-center border-b border-[#7B3FE4]/30 shadow-md fixed top-0 w-full z-50 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 bg-gradient-to-br from-[#2a0f2b] via-[#3b1740] to-[#4c1f55] p-1">
          <img
            src={logo}
            alt="Ondine Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-2xl font-bold tracking-widest text-[#A56BFA] group-hover:text-[#E4D9F9] transition-colors">
          ONDINE
        </span>
      </Link>

      <nav className="flex text-lg gap-6 font-medium items-center">
        <Link to="/" className="hover:text-[#A56BFA] transition-colors">
          Inicio
        </Link>
        <Link to="/juegos" className="hover:text-[#A56BFA] transition-colors">
          Juegos
        </Link>
        <Link to="/noticias" className="hover:text-[#A56BFA] transition-colors">
          Noticias
        </Link>

        {/* Comunidad dropdown */}
        <div className="relative" ref={communityRef}>
          <button
            onClick={() => setOpenCommunity((v) => !v)}
            onMouseEnter={() => setOpenCommunity(true)}
            className="flex items-center gap-2 hover:text-[#A56BFA] transition-colors"
            aria-expanded={openCommunity}
            aria-haspopup="true"
          >
            Comunidad
            <svg
              className="w-4 h-4 text-[#A56BFA]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className={`absolute right-0 mt-2 w-52 rounded-md border border-[#7B3FE4]/20 bg-[#15101a]/95 shadow-lg py-1 transition-opacity duration-150 z-50 ${
              openCommunity
                ? "opacity-100 visible scale-100"
                : "opacity-0 invisible scale-95"
            }`}
            role="menu"
            aria-label="Comunidad"
          >
            <Link
              to="/foros"
              className="block px-4 py-2 text-sm text-[#E4D9F9] hover:bg-[#7B3FE4]/10 transition-colors"
              role="menuitem"
              onClick={() => setOpenCommunity(false)}
            >
              💬 Foros
            </Link>
            <Link
              to="/blogs"
              className="block px-4 py-2 text-sm text-[#E4D9F9] hover:bg-[#7B3FE4]/10 transition-colors"
              role="menuitem"
              onClick={() => setOpenCommunity(false)}
            >
              📝 Blogs
            </Link>
            <Link
              to="/eventos"
              className="block px-4 py-2 text-sm text-[#E4D9F9] hover:bg-[#7B3FE4]/10 transition-colors"
              role="menuitem"
              onClick={() => setOpenCommunity(false)}
            >
              🎯 Eventos
            </Link>
            <Link
              to="/directos"
              className="block px-4 py-2 text-sm text-[#E4D9F9] hover:bg-[#7B3FE4]/10 transition-colors"
              role="menuitem"
              onClick={() => setOpenCommunity(false)}
            >
              🔴 Directos
            </Link>
          </div>
        </div>

        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="hover:text-[#A56BFA] transition-colors"
            >
              Cerrar Sesión
            </button>
            <Link
              to="/perfil"
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-1 rounded-md font-semibold shadow-md transition-all"
            >
              Mi Perfil
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-[#A56BFA] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#7B3FE4] hover:bg-[#A56BFA] text-white px-4 py-1 rounded-md font-semibold shadow-md transition-all"
            >
              Registro
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
