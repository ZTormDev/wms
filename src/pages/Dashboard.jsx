import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  productService,
  movementService,
  pickingService,
} from "../services/dataService";
import {
  Package,
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Activity,
  PackageCheck,
  FileText,
  Plus,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    completedOrdersToday: 0,
    totalStock: 0,
    recentMovements: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const products = await productService.getAll();
      const lowStock = await productService.getLowStock();
      const pickingOrders = await pickingService.getAll();
      const movements = await movementService.getAll();
      const movementStats = await movementService.getStats();

      setStats({
        totalProducts: products.length,
        lowStockProducts: lowStock.length,
        pendingOrders: pickingOrders.filter((o) => o.status === "pendiente")
          .length,
        completedOrdersToday: pickingOrders.filter(
          (o) =>
            o.status === "completado" &&
            new Date(o.completedAt).toDateString() === new Date().toDateString()
        ).length,
        totalStock: products.reduce((sum, p) => sum + p.stock, 0),
        recentMovements: movements.slice(0, 5),
        movementStats,
      });
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {link && (
            <Link
              to={link}
              className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
            >
              Ver detalles →
            </Link>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-100"
          link="/products"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          color="bg-yellow-100"
          link="/products?filter=lowstock"
        />
        <StatCard
          title="Órdenes Pendientes"
          value={stats.pendingOrders}
          icon={ClipboardList}
          color="bg-orange-100"
          link="/picking"
        />
        <StatCard
          title="Completadas Hoy"
          value={stats.completedOrdersToday}
          icon={CheckCircle}
          color="bg-green-100"
          link="/picking?status=completed"
        />
      </div>

      {/* Movimientos de la semana */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Movimientos de la Semana
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Entradas</p>
            <p className="text-2xl font-bold text-green-700">
              {stats.movementStats?.totalEntries || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.movementStats?.totalQuantityIn || 0} unidades
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Salidas</p>
            <p className="text-2xl font-bold text-red-700">
              {stats.movementStats?.totalExits || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.movementStats?.totalQuantityOut || 0} unidades
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Stock Total</p>
            <p className="text-2xl font-bold text-blue-700">
              {stats.totalStock}
            </p>
            <p className="text-xs text-gray-500 mt-1">unidades</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Balance</p>
            <p className="text-2xl font-bold text-purple-700">
              {(stats.movementStats?.totalQuantityIn || 0) -
                (stats.movementStats?.totalQuantityOut || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">unidades</p>
          </div>
        </div>
      </div>

      {/* Movimientos recientes */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Movimientos Recientes
          </h2>
          <Link
            to="/movements"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentMovements.map((movement) => (
                <tr key={movement.id} className="table-row">
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        movement.type === "entrada"
                          ? "badge-success"
                          : "badge-danger"
                      }`}
                    >
                      {movement.type === "entrada" ? (
                        <span className="flex items-center gap-1">
                          <ArrowDownCircle className="w-3 h-3" /> Entrada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ArrowUpCircle className="w-3 h-3" /> Salida
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {movement.productName}
                  </td>
                  <td className="px-4 py-3">{movement.quantity}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-info">
                      {movement.location}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {movement.user}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(movement.date).toLocaleString("es-ES")}
                  </td>
                </tr>
              ))}
              {stats.recentMovements.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No hay movimientos recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/reception"
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <PackageCheck className="w-8 h-8 mb-2 text-gray-700" />
            <span className="text-sm font-medium">Recepción</span>
          </Link>
          <Link
            to="/picking"
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <ClipboardList className="w-8 h-8 mb-2 text-gray-700" />
            <span className="text-sm font-medium">Picking</span>
          </Link>
          <Link
            to="/stock"
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <TrendingUp className="w-8 h-8 mb-2 text-gray-700" />
            <span className="text-sm font-medium">Consultar Stock</span>
          </Link>
          <Link
            to="/products"
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <Plus className="w-8 h-8 mb-2 text-gray-700" />
            <span className="text-sm font-medium">Nuevo Producto</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
