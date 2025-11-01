import { useState, useEffect } from "react";
import { locationService } from "../services/dataService";
import { Warehouse, List, Package, Square, Circle } from "lucide-react";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid o list

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await locationService.getAll();
      setLocations(data);
    } catch (error) {
      console.error("Error cargando ubicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByZone = () => {
    const grouped = {};
    locations.forEach((loc) => {
      if (!grouped[loc.zone]) {
        grouped[loc.zone] = [];
      }
      grouped[loc.zone].push(loc);
    });
    return grouped;
  };

  const occupiedCount = locations.filter((l) => l.occupied).length;
  const availableCount = locations.filter((l) => !l.occupied).length;
  const occupancyRate =
    locations.length > 0
      ? ((occupiedCount / locations.length) * 100).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ubicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Ubicaciones
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "grid" ? "bg-primary-600 text-white" : "bg-gray-200"
            }`}
          >
            <Warehouse className="w-5 h-5 inline-block mr-1" /> Vista de Mapa
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "list" ? "bg-primary-600 text-white" : "bg-gray-200"
            }`}
          >
            <List className="w-5 h-5 inline-block mr-1" /> Vista de Lista
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-blue-50 border-2 border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Total Ubicaciones</p>
          <p className="text-3xl font-bold text-blue-900">{locations.length}</p>
        </div>
        <div className="card bg-green-50 border-2 border-green-200">
          <p className="text-sm text-green-600 mb-1">Disponibles</p>
          <p className="text-3xl font-bold text-green-900">{availableCount}</p>
        </div>
        <div className="card bg-orange-50 border-2 border-orange-200">
          <p className="text-sm text-orange-600 mb-1">Ocupadas</p>
          <p className="text-3xl font-bold text-orange-900">{occupiedCount}</p>
        </div>
        <div className="card bg-purple-50 border-2 border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Tasa de Ocupación</p>
          <p className="text-3xl font-bold text-purple-900">{occupancyRate}%</p>
        </div>
      </div>

      {/* Vista de Mapa (Grid) */}
      {viewMode === "grid" && (
        <div className="space-y-6">
          {Object.entries(groupByZone()).map(([zone, locs]) => (
            <div key={zone} className="card">
              <h2 className="text-2xl font-bold mb-4">Zona {zone}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {locs.map((location) => (
                  <div
                    key={location.id}
                    className={`p-4 rounded-lg border-2 text-center transition-all cursor-pointer ${
                      location.occupied
                        ? "bg-red-50 border-red-300 hover:shadow-md"
                        : "bg-green-50 border-green-300 hover:shadow-md hover:border-green-500"
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {location.occupied ? (
                        <Package className="w-8 h-8 mx-auto text-red-600" />
                      ) : (
                        <Square className="w-8 h-8 mx-auto text-green-600" />
                      )}
                    </div>
                    <p className="font-mono font-bold text-sm">{location.id}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Cap: {location.capacity}
                    </p>
                    <span
                      className={`text-xs badge mt-2 ${
                        location.occupied ? "badge-danger" : "badge-success"
                      }`}
                    >
                      {location.occupied ? "Ocupada" : "Libre"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Lista */}
      {viewMode === "list" && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3">ID Ubicación</th>
                  <th className="px-4 py-3">Zona</th>
                  <th className="px-4 py-3">Rack</th>
                  <th className="px-4 py-3">Nivel</th>
                  <th className="px-4 py-3">Capacidad</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.id} className="table-row">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold">{location.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-info">
                        Zona {location.zone}
                      </span>
                    </td>
                    <td className="px-4 py-3">{location.rack}</td>
                    <td className="px-4 py-3">{location.level}</td>
                    <td className="px-4 py-3">{location.capacity} unidades</td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          location.occupied ? "badge-danger" : "badge-success"
                        }`}
                      >
                        {location.occupied ? (
                          <>
                            <Circle className="w-3 h-3 inline-block mr-1 fill-current" />{" "}
                            Ocupada
                          </>
                        ) : (
                          <>
                            <Circle className="w-3 h-3 inline-block mr-1 fill-current" />{" "}
                            Disponible
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="card bg-gray-50">
        <h3 className="font-bold mb-3">Leyenda de Zonas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <span className="badge badge-success mr-2">Zona A</span>
            <span className="text-gray-600">Alta rotación - Acceso rápido</span>
          </div>
          <div className="flex items-center">
            <span className="badge badge-warning mr-2">Zona B</span>
            <span className="text-gray-600">
              Rotación media - Acceso normal
            </span>
          </div>
          <div className="flex items-center">
            <span className="badge badge-info mr-2">Zona C</span>
            <span className="text-gray-600">
              Baja rotación - Almacenaje prolongado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
