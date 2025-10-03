import logo from "../assets/ondine.png"; // guarda tu logo en src/assets/
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <section
        className="flex flex-col items-center justify-center text-center flex-grow"
        style={{
          background: "linear-gradient(to bottom, #B0B6D9, #899DD9)",
          color: "#0455BF",
          padding: "4rem 1rem"
        }}
      >
        <img src={logo} alt="Ondine Logo" className="w-40 mb-6" />
        <h1 className="text-5xl font-extrabold mb-4">Bienvenido a Ondine</h1>
        <p className="text-lg mb-8 max-w-2xl">
          La comunidad donde los videojuegos, los foros y los eventos se unen
          bajo un mismo reino digital.
        </p>
        <Link
          to="/register"
          className="bg-[#0455BF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0477BF] transition"
        >
          Únete ahora
        </Link>
      </section>

   
      <section className="grid md:grid-cols-3 gap-8 p-10 bg-[#B0B6D9] text-[#0455BF]">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Foros</h2>
          <p>Participa en discusiones sobre tus juegos favoritos.</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Blogs</h2>
          <p>Comparte tus experiencias y walkthroughs con la comunidad.</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Eventos</h2>
          <p>Descubre y participa en torneos y reuniones exclusivas.</p>
        </div>
      </section>
    </div>
  );
}
