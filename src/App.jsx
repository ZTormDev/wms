import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Reception from "./pages/Reception";
import Locations from "./pages/Locations";
import Picking from "./pages/Picking";
import Dispatch from "./pages/Dispatch";
import Stock from "./pages/Stock";
import Movements from "./pages/Movements";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

// Componente para redirigir según el rol del usuario
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
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
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard - Admin y Supervisor */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Productos - Todos los roles */}
            <Route
              path="products"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "supervisor", "operario", "vendedor"]}
                >
                  <Products />
                </ProtectedRoute>
              }
            />

            {/* Recepción - Admin, Supervisor, Operario */}
            <Route
              path="reception"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "supervisor", "operario"]}
                >
                  <Reception />
                </ProtectedRoute>
              }
            />

            {/* Ubicaciones - Admin, Supervisor, Operario */}
            <Route
              path="locations"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "supervisor", "operario"]}
                >
                  <Locations />
                </ProtectedRoute>
              }
            />

            {/* Picking - Admin, Supervisor, Operario */}
            <Route
              path="picking"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "supervisor", "operario"]}
                >
                  <Picking />
                </ProtectedRoute>
              }
            />

            {/* Despacho - Admin, Supervisor, Operario */}
            <Route
              path="dispatch"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "supervisor", "operario"]}
                >
                  <Dispatch />
                </ProtectedRoute>
              }
            />

            {/* Stock - Admin, Supervisor, Vendedor */}
            <Route
              path="stock"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "supervisor", "vendedor"]}
                >
                  <Stock />
                </ProtectedRoute>
              }
            />

            {/* Movimientos - Admin, Supervisor */}
            <Route
              path="movements"
              element={
                <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                  <Movements />
                </ProtectedRoute>
              }
            />

            {/* Reportes - Admin, Supervisor */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Usuarios - Solo Admin */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* Redirección por defecto basada en rol */}
            <Route index element={<RoleBasedRedirect />} />
          </Route>

          {/* Redirección para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
