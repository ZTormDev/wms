import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  PackageCheck,
  Warehouse,
  ClipboardList,
  Truck,
  TrendingUp,
  RefreshCw,
  FileText,
  Users,
  LogOut,
  Box,
} from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "supervisor"],
    },
    {
      name: "Productos",
      path: "/products",
      icon: Package,
      roles: ["admin", "supervisor", "operario", "vendedor"],
    },
    {
      name: "Recepción",
      path: "/reception",
      icon: PackageCheck,
      roles: ["admin", "supervisor", "operario"],
    },
    {
      name: "Ubicaciones",
      path: "/locations",
      icon: Warehouse,
      roles: ["admin", "supervisor", "operario"],
    },
    {
      name: "Picking",
      path: "/picking",
      icon: ClipboardList,
      roles: ["admin", "supervisor", "operario"],
    },
    {
      name: "Despacho",
      path: "/dispatch",
      icon: Truck,
      roles: ["admin", "supervisor", "operario"],
    },
    {
      name: "Stock",
      path: "/stock",
      icon: TrendingUp,
      roles: ["admin", "supervisor", "vendedor"],
    },
    {
      name: "Movimientos",
      path: "/movements",
      icon: RefreshCw,
      roles: ["admin", "supervisor"],
    },
    {
      name: "Reportes",
      path: "/reports",
      icon: FileText,
      roles: ["admin", "supervisor"],
    },
    { name: "Usuarios", path: "/users", icon: Users, roles: ["admin"] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role)
  );

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-purple-100 text-purple-800",
      supervisor: "bg-blue-100 text-blue-800",
      operario: "bg-green-100 text-green-800",
      vendedor: "bg-orange-100 text-orange-800",
    };
    return badges[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: "Administrador",
      supervisor: "Supervisor",
      operario: "Operario",
      vendedor: "Vendedor",
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Box className="w-8 h-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  WMS
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadge(
                    user?.role
                  )}`}
                >
                  {getRoleLabel(user?.role)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
