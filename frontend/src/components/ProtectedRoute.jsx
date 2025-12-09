import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
  if (!token) {
    console.warn("❌ Acceso denegado: sin token");
    return <Navigate to="/login" replace />;
  }

  return children;
}