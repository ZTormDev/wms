import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirigir a la página apropiada según el rol del usuario
    switch (user?.role) {
      case "admin":
      case "supervisor":
        return <Navigate to="/dashboard" replace />;
      case "operario":
        return <Navigate to="/reception" replace />;
      case "vendedor":
        return <Navigate to="/products" replace />;
      default:
        return <Navigate to="/products" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
