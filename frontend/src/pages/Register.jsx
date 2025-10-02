import { useState } from "react";
import api from "../../services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({ nombre_usuario: "", correo: "", contrasena: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/registro", form);
      setMensaje("✅ Usuario registrado correctamente");
    } catch (err) {
      setMensaje("❌ Error: " + err.response?.data?.error || "Error al registrar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2>Registro</h2>
      <input type="text" name="nombre_usuario" placeholder="Usuario" onChange={handleChange} />
      <input type="email" name="correo" placeholder="Correo" onChange={handleChange} />
      <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />
      <button type="submit">Registrarse</button>
      <p>{mensaje}</p>
    </form>
  );
}
