import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Juegos from "./pages/Juegos";
import Noticias from "./pages/Noticias";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blogs from "./pages/Blogs";
import Foros from "./pages/Foros";
import Eventos from "./pages/Eventos";
import DetalleForo from "./pages/DetalleForo";
import CrearBlog from "./pages/CrearBlog";
import CrearEvento from "./pages/CrearEvento";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1B1128] flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/foros" element={<Foros />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/foros/:id" element={<DetalleForo />} />
            <Route path="/blogs/crear" element={<CrearBlog />} />
            <Route path="/eventos/crear" element={<CrearEvento />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;