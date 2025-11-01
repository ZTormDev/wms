import { useState, useEffect } from "react";
import { productService } from "../services/dataService";
import {
  XCircle,
  AlertTriangle,
  CheckCircle,
  ArrowDownCircle,
  Truck,
  BarChart3,
} from "lucide-react";

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.sku.toLowerCase().includes(lower) ||
          p.ean.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityStatus = (product) => {
    if (product.stock === 0) {
      return {
        status: "Sin Stock",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-5 h-5" />,
        message: product.nextArrival
          ? `Próxima llegada: ${new Date(
              product.nextArrival
            ).toLocaleDateString("es-ES")}`
          : "Fecha de reposición no definida",
      };
    } else if (product.stock <= product.minStock) {
      return {
        status: "Stock Bajo",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <AlertTriangle className="w-5 h-5" />,
        message: `Solo quedan ${product.stock} unidades`,
      };
    } else {
      return {
        status: "Disponible",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-5 h-5" />,
        message: `${product.stock} unidades disponibles`,
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de stock...</p>
        </div>
      </div>
    );
  }

  // Vista detallada del producto
  if (selectedProduct) {
    const availability = getAvailabilityStatus(selectedProduct);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedProduct(null)}
          className="btn-secondary"
        >
          ← Volver a la lista
        </button>

        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-gray-600">{selectedProduct.description}</p>
            </div>
            <span
              className={`badge text-lg px-4 py-2 ${availability.color} border-2`}
            >
              {availability.icon} {availability.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Información básica */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold mb-3 text-gray-700">Identificación</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">SKU</p>
                  <p className="font-mono font-bold">{selectedProduct.sku}</p>
                </div>
                <div>
                  <p className="text-gray-600">EAN</p>
                  <p className="font-mono font-bold">{selectedProduct.ean}</p>
                </div>
                <div>
                  <p className="text-gray-600">Categoría</p>
                  <p className="font-medium">{selectedProduct.category}</p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold mb-3 text-gray-700">Disponibilidad</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Stock Actual</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {selectedProduct.stock}
                  </p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
                <div>
                  <p className="text-gray-600">Stock Mínimo</p>
                  <p className="font-bold">{selectedProduct.minStock}</p>
                </div>
                <div
                  className={`mt-3 p-2 rounded border ${availability.color}`}
                >
                  <p className="text-xs font-medium">{availability.message}</p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold mb-3 text-gray-700">Ubicación</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Bodega</p>
                  <p className="font-mono text-2xl font-bold text-primary-600">
                    {selectedProduct.location || "Sin asignar"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Tipo de Rotación</p>
                  <span
                    className={`badge ${
                      selectedProduct.rotationType === "alta"
                        ? "badge-success"
                        : selectedProduct.rotationType === "media"
                        ? "badge-warning"
                        : "badge-danger"
                    }`}
                  >
                    {selectedProduct.rotationType.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600">Volumen</p>
                  <p className="font-medium capitalize">
                    {selectedProduct.volume}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">
                <ArrowDownCircle className="w-5 h-5 inline-block mr-1" /> Última
                Entrada
              </h4>
              <p className="text-blue-800">
                {selectedProduct.lastEntry
                  ? new Date(selectedProduct.lastEntry).toLocaleDateString(
                      "es-ES",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Sin registros de entrada"}
              </p>
            </div>

            {selectedProduct.nextArrival && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">
                  <Truck className="w-5 h-5 inline-block mr-1" /> Próxima
                  Llegada
                </h4>
                <p className="text-green-800 font-medium">
                  {new Date(selectedProduct.nextArrival).toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {Math.ceil(
                    (new Date(selectedProduct.nextArrival) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  días restantes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de productos
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Consulta de Stock</h1>
      </div>

      <div className="card">
        <p className="text-gray-600 mb-4">
          <BarChart3 className="w-5 h-5 inline-block mr-1" /> Consulte en tiempo
          real la disponibilidad de productos, ubicaciones y fechas estimadas de
          llegada.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Buscar Producto
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, SKU, EAN o categoría..."
            className="input-field text-lg"
            autoFocus
          />
        </div>

        {/* Resumen de stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-700">
              {products.filter((p) => p.stock > p.minStock).length}
            </p>
            <p className="text-sm text-green-600">Productos Disponibles</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">
              {
                products.filter((p) => p.stock > 0 && p.stock <= p.minStock)
                  .length
              }
            </p>
            <p className="text-sm text-yellow-600">Stock Bajo</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-700">
              {products.filter((p) => p.stock === 0).length}
            </p>
            <p className="text-sm text-red-600">Sin Stock</p>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const availability = getAvailabilityStatus(product);

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="card hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary-500"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg flex-1 pr-2">
                  {product.name}
                </h3>
                <span className={`badge ${availability.color} border`}>
                  {availability.icon}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-mono font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="badge badge-info">{product.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stock:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {product.stock}
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded border ${availability.color} text-center`}
              >
                <p className="text-sm font-medium">{availability.message}</p>
              </div>

              {product.nextArrival && product.stock === 0 && (
                <div className="mt-3 text-center text-xs text-gray-600 bg-blue-50 p-2 rounded">
                  <Truck className="w-4 h-4 inline-block mr-1" /> Llegada:{" "}
                  {new Date(product.nextArrival).toLocaleDateString("es-ES")}
                </div>
              )}
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchTerm
              ? "No se encontraron productos que coincidan con tu búsqueda"
              : "No hay productos registrados"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
