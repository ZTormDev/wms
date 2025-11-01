import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    { email: "admin@wms.com", password: "admin123", role: "Administrador" },
    { email: "supervisor@wms.com", password: "super123", role: "Supervisor" },
    { email: "operario@wms.com", password: "oper123", role: "Operario" },
    { email: "vendedor@wms.com", password: "vend123", role: "Vendedor" },
  ];

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Box className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Sistema WMS</h1>
          <p className="text-primary-100">Gestión de Almacenes</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3 text-center">
              Usuarios de prueba:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => fillDemo(user.email, user.password)}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded border border-gray-200 transition-colors"
                >
                  {user.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-primary-100 text-sm mt-6">
          © 2025 WMS - Sistema de Gestión de Almacenes
        </p>
        <p className="text-center text-primary-100 text-sm mt-1">
          Hecho por <b>ZTormDev</b>
        </p>
      </div>
    </div>
  );
};

export default Login;
