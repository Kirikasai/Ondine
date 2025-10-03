import { useState } from "react";
import api from "../../../frontend/src/Services/api";

export default function LoginForm() {
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      setMensaje("✅ Sesión iniciada");
    } catch (err) {
      setMensaje("❌ Error: " + err.response?.data?.error || "Error en login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2>Iniciar Sesión</h2>
      <input type="email" name="correo" placeholder="Correo" onChange={handleChange} />
      <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />
      <button type="submit">Entrar</button>
      <p>{mensaje}</p>
    </form>
  );
}
