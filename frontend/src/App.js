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
import Directos from "./pages/DirectosPages";
import CrearBlog from "./pages/CrearBlog";
import CrearEvento from "./pages/CrearEvento";
import Perfil from "./pages/Profile";
import EditarPerfil from "./pages/EditarPerfil";
import BlogPage from './components/BlogPage';
import ForoPage from './components/ForoPage';
import EventoPage from './components/EventoPage';
import ProtectedRoute from "./components/ProtectedRoute";

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
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/editar-perfil" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
            <Route path="/directos" element={<Directos />} />
            <Route path="/foros/:id" element={<ForoPage />} />
            <Route path="/blogs/:id" element={<BlogPage />} />
            <Route path="/eventos/:id" element={<EventoPage />} />
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