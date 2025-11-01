import { useState, useEffect } from "react";
import { movementService } from "../services/dataService";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const Movements = () => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadMovements();
  }, []);

  useEffect(() => {
    if (filterType === "all") {
      setFilteredMovements(movements);
    } else {
      setFilteredMovements(movements.filter((m) => m.type === filterType));
    }
  }, [filterType, movements]);

  const loadMovements = async () => {
    try {
      const data = await movementService.getAll();
      setMovements(data);
      setFilteredMovements(data);
    } catch (error) {
      console.error("Error cargando movimientos:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalEntries = movements.filter((m) => m.type === "entrada").length;
  const totalExits = movements.filter((m) => m.type === "salida").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando movimientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Movimientos de Inventario
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-2 border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Total Movimientos</p>
          <p className="text-3xl font-bold text-blue-900">{movements.length}</p>
        </div>
        <div className="card bg-green-50 border-2 border-green-200">
          <p className="text-sm text-green-600 mb-1">
            <ArrowDownCircle className="w-4 h-4 inline-block mr-1" /> Entradas
          </p>
          <p className="text-3xl font-bold text-green-900">{totalEntries}</p>
        </div>
        <div className="card bg-red-50 border-2 border-red-200">
          <p className="text-sm text-red-600 mb-1">
            <ArrowUpCircle className="w-4 h-4 inline-block mr-1" /> Salidas
          </p>
          <p className="text-3xl font-bold text-red-900">{totalExits}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === "all"
                ? "btn-primary text-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Todos ({movements.length})
          </button>
          <button
            onClick={() => setFilterType("entrada")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === "entrada"
                ? "btn-primary text-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <ArrowDownCircle className="w-4 h-4 inline-block mr-1" /> Entradas (
            {totalEntries})
          </button>
          <button
            onClick={() => setFilterType("salida")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === "salida"
                ? "btn-primary text-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <ArrowUpCircle className="w-4 h-4 inline-block mr-1" /> Salidas (
            {totalExits})
          </button>
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Referencia</th>
                <th className="px-4 py-3">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="table-row">
                  <td className="px-4 py-3 font-mono text-sm">
                    #{movement.id}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        movement.type === "entrada"
                          ? "badge-success"
                          : "badge-danger"
                      }`}
                    >
                      {movement.type === "entrada" ? (
                        <>
                          <ArrowDownCircle className="w-3 h-3 inline-block mr-1" />{" "}
                          Entrada
                        </>
                      ) : (
                        <>
                          <ArrowUpCircle className="w-3 h-3 inline-block mr-1" />{" "}
                          Salida
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{movement.productName}</div>
                    <div className="text-xs text-gray-500">
                      ID: {movement.productId}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
                        movement.type === "entrada"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {movement.type === "entrada" ? "+" : "-"}
                      {movement.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {movement.location}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{movement.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {movement.reference}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(movement.date).toLocaleString("es-ES")}
                  </td>
                </tr>
              ))}
              {filteredMovements.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No hay movimientos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Movements;
