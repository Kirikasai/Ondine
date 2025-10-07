import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Juegos from "./pages/Juegos";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/juegos" element={<Juegos />} />
            {/* Aquí podrás añadir Foros, Blogs, Eventos */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
