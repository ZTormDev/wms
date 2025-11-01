import { useState, useEffect } from "react";
import { pickingService } from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import { Clock, RefreshCw, Check, Circle } from "lucide-react";

const Picking = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await pickingService.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrder = async (orderId) => {
    try {
      await pickingService.assignTo(orderId, user.name);
      await loadOrders();
      alert("Orden asignada correctamente");
    } catch (error) {
      console.error("Error asignando orden:", error);
      alert("Error al asignar la orden");
    }
  };

  const handleStartPicking = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdatePicked = async (orderId, productId, pickedQty) => {
    try {
      await pickingService.updateItemPicked(orderId, productId, pickedQty);
      await loadOrders();
      const updatedOrder = await pickingService.getById(orderId);
      setSelectedOrder(updatedOrder);
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      alert("Error al actualizar la cantidad");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    if (
      window.confirm("¿Confirmar la finalización de esta orden de picking?")
    ) {
      try {
        await pickingService.complete(orderId);
        await loadOrders();
        setSelectedOrder(null);
        alert("Orden completada exitosamente");
      } catch (error) {
        console.error("Error completando orden:", error);
        alert("Error al completar la orden");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: (
        <span className="badge badge-warning">
          <Clock className="w-3 h-3 inline-block mr-1" /> Pendiente
        </span>
      ),
      en_proceso: (
        <span className="badge badge-info">
          <RefreshCw className="w-3 h-3 inline-block mr-1" /> En Proceso
        </span>
      ),
      completado: (
        <span className="badge badge-success">
          <Check className="w-3 h-3 inline-block mr-1" /> Completado
        </span>
      ),
    };
    return badges[status] || <span className="badge">{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      alta: (
        <span className="badge badge-danger">
          <Circle className="w-3 h-3 inline-block mr-1 fill-current" /> Alta
        </span>
      ),
      media: (
        <span className="badge badge-warning">
          <Circle className="w-3 h-3 inline-block mr-1 fill-current" /> Media
        </span>
      ),
      baja: (
        <span className="badge badge-info">
          <Circle className="w-3 h-3 inline-block mr-1 fill-current" /> Baja
        </span>
      ),
    };
    return badges[priority] || <span className="badge">{priority}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando órdenes de picking...</p>
        </div>
      </div>
    );
  }

  // Vista detallada de una orden
  if (selectedOrder) {
    const allItemsPicked = selectedOrder.items.every(
      (item) => item.picked >= item.quantity
    );
    const progress =
      (selectedOrder.items.reduce((sum, item) => sum + item.picked, 0) /
        selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)) *
      100;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="btn-secondary mb-2"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Orden {selectedOrder.orderNumber}
            </h1>
          </div>
          <div className="text-right">
            {getStatusBadge(selectedOrder.status)}
            <div className="mt-2">
              {getPriorityBadge(selectedOrder.priority)}
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Progreso de Picking</h2>
          <div className="mb-2 flex justify-between text-sm">
            <span>Completado</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Items de la orden */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Productos a Recoger</h2>
          <div className="space-y-4">
            {selectedOrder.items.map((item, index) => {
              const isComplete = item.picked >= item.quantity;
              return (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${
                    isComplete
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Producto ID: {item.productId}
                      </p>
                    </div>
                    {isComplete && <Check className="w-8 h-8 text-green-600" />}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded p-3 border">
                      <p className="text-xs text-gray-600 mb-1">Ubicación</p>
                      <p className="font-mono font-bold text-lg">
                        {item.location}
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <p className="text-xs text-gray-600 mb-1">
                        Cantidad Requerida
                      </p>
                      <p className="font-bold text-lg">
                        {item.quantity} unidades
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">
                      Cantidad Recogida:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={item.quantity}
                      value={item.picked}
                      onChange={(e) =>
                        handleUpdatePicked(
                          selectedOrder.id,
                          item.productId,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="input-field w-24"
                      disabled={selectedOrder.status === "completado"}
                    />
                    <span className="text-sm text-gray-600">
                      de {item.quantity}
                    </span>
                    {isComplete && (
                      <span className="badge badge-success ml-auto">
                        Completo
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold mb-3">Información de la Orden</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Creada:</span>
                <span>
                  {new Date(selectedOrder.createdAt).toLocaleString("es-ES")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Asignada a:</span>
                <span className="font-medium">
                  {selectedOrder.assignedTo || "Sin asignar"}
                </span>
              </div>
              {selectedOrder.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Completada:</span>
                  <span>
                    {new Date(selectedOrder.completedAt).toLocaleString(
                      "es-ES"
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-3">Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Productos:</span>
                <span className="font-bold">{selectedOrder.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Unidades:</span>
                <span className="font-bold">
                  {selectedOrder.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unidades Recogidas:</span>
                <span className="font-bold text-green-600">
                  {selectedOrder.items.reduce(
                    (sum, item) => sum + item.picked,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        {selectedOrder.status !== "completado" && (
          <div className="flex justify-end">
            <button
              onClick={() => handleCompleteOrder(selectedOrder.id)}
              disabled={!allItemsPicked}
              className="btn-success"
            >
              {allItemsPicked ? (
                <>
                  <Check className="w-5 h-5 inline-block mr-1" /> Completar
                  Orden
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 inline-block mr-1" /> Esperando
                  recoger todos los items
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Vista de lista de órdenes
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Órdenes de Picking</h1>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "btn-primary text-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Todas ({orders.length})
          </button>
          <button
            onClick={() => setFilter("pendiente")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "pendiente"
                ? "btn-primary text-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Pendientes ({orders.filter((o) => o.status === "pendiente").length})
          </button>
          <button
            onClick={() => setFilter("en_proceso")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "en_proceso"
                ? "btn-primary text-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            En Proceso ({orders.filter((o) => o.status === "en_proceso").length}
            )
          </button>
          <button
            onClick={() => setFilter("completado")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "completado"
                ? "btn-primary text-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Completadas (
            {orders.filter((o) => o.status === "completado").length})
          </button>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(order.status)}
                <div className="mt-1">{getPriorityBadge(order.priority)}</div>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Productos:</span>
                <span className="font-medium">{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unidades totales:</span>
                <span className="font-medium">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Asignada a:</span>
                <span className="font-medium">
                  {order.assignedTo || "Sin asignar"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 flex space-x-2">
              {order.status === "pendiente" && !order.assignedTo && (
                <button
                  onClick={() => handleAssignOrder(order.id)}
                  className="btn-primary flex-1 text-sm"
                >
                  Asignarme
                </button>
              )}
              <button
                onClick={() => handleStartPicking(order)}
                className="btn-secondary flex-1 text-sm"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay órdenes de picking en esta categoría
          </div>
        )}
      </div>
    </div>
  );
};

export default Picking;
