import { useState, useEffect } from "react";
import {
  productService,
  locationService,
  movementService,
} from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import { RefreshCw, Keyboard, Camera, Lightbulb, Check } from "lucide-react";

const Reception = () => {
  const [step, setStep] = useState(1);
  const [scanMode, setScanMode] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [reference, setReference] = useState("");
  const [suggestedLocation, setSuggestedLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    loadAvailableLocations();
  }, []);

  const loadAvailableLocations = async () => {
    try {
      const locations = await locationService.getAvailable();
      setAvailableLocations(locations);
    } catch (error) {
      console.error("Error cargando ubicaciones:", error);
    }
  };

  const handleScanProduct = async () => {
    if (!searchCode.trim()) return;

    setLoading(true);
    try {
      const foundProduct = await productService.getBySku(searchCode);

      if (foundProduct) {
        setProduct(foundProduct);
        // Sugerir ubicación basada en características del producto
        const suggested = await locationService.suggestLocation({
          rotationType: foundProduct.rotationType,
          volume: foundProduct.volume,
        });
        setSuggestedLocation(suggested);
        setSelectedLocation(suggested.id);
        setStep(2);
      } else {
        alert("Producto no encontrado. Verifique el código SKU o EAN.");
      }
    } catch (error) {
      console.error("Error buscando producto:", error);
      alert("Error al buscar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReception = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }

    if (!selectedLocation) {
      alert("Seleccione una ubicación");
      return;
    }

    setLoading(true);
    try {
      // Registrar movimiento de entrada
      await movementService.create({
        type: "entrada",
        productId: product.id,
        productName: product.name,
        quantity: parseInt(quantity),
        location: selectedLocation,
        user: user.name,
        reference: reference || "Sin referencia",
      });

      // Actualizar ubicación del producto si no tenía
      if (!product.location) {
        await productService.update(product.id, {
          location: selectedLocation,
        });
      }

      // Asignar ubicación como ocupada
      await locationService.assignLocation(selectedLocation, product.id);

      alert("Recepción registrada exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error registrando recepción:", error);
      alert("Error al registrar la recepción");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setProduct(null);
    setQuantity("");
    setReference("");
    setSuggestedLocation(null);
    setSelectedLocation("");
    setSearchCode("");
    setScanMode(false);
    loadAvailableLocations();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Recepción de Mercancía
        </h1>
        <button onClick={resetForm} className="btn-secondary">
          <RefreshCw className="w-5 h-5 inline-block mr-1" /> Nueva Recepción
        </button>
      </div>

      {/* Indicador de pasos */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center ${
              step >= 1 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-primary-600 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="ml-2 font-medium">Escanear Producto</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-4">
            <div
              className={`h-full ${
                step >= 2 ? "bg-primary-600" : "bg-gray-200"
              }`}
              style={{
                width: step >= 2 ? "100%" : "0%",
                transition: "width 0.3s",
              }}
            ></div>
          </div>
          <div
            className={`flex items-center ${
              step >= 2 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-primary-600 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Confirmar Recepción</span>
          </div>
        </div>
      </div>

      {/* Paso 1: Escanear Producto */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">
            Paso 1: Identificar Producto
          </h2>

          <div className="mb-6">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setScanMode(false)}
                className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                  !scanMode
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Keyboard className="w-5 h-5 inline-block mr-1" /> Búsqueda
                Manual
              </button>
              <button
                onClick={() => setScanMode(true)}
                className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                  scanMode
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Camera className="w-5 h-5 inline-block mr-1" /> Escaneo de
                Código
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {scanMode
                    ? "Escanee el código de barras"
                    : "Ingrese SKU o EAN"}
                </label>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleScanProduct()}
                  placeholder={
                    scanMode ? "Escanear..." : "SKU001 o 7501234567890"
                  }
                  className="input-field text-lg"
                  autoFocus
                />
              </div>

              <button
                onClick={handleScanProduct}
                disabled={loading || !searchCode.trim()}
                className="btn-primary w-full"
              >
                {loading ? "Buscando..." : "🔍 Buscar Producto"}
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 mb-2">
              <Lightbulb className="w-4 h-4 inline-block mr-1" /> Consejos:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Use un escáner de códigos de barras para mayor rapidez</li>
              <li>
                • También puede buscar manualmente ingresando el SKU o EAN
              </li>
              <li>• Presione Enter después de ingresar el código</li>
            </ul>
          </div>
        </div>
      )}

      {/* Paso 2: Confirmar Recepción */}
      {step === 2 && product && (
        <div className="space-y-6">
          {/* Información del producto */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Producto Identificado</h2>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-bold text-lg">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categoría</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="font-mono">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">EAN</p>
                  <p className="font-mono">{product.ean}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock Actual</p>
                  <p className="font-bold text-2xl">{product.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ubicación Actual</p>
                  <p className="font-mono">
                    {product.location || "Sin asignar"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de recepción */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Detalles de la Recepción</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad Recibida *
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ingrese la cantidad"
                  className="input-field text-lg"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referencia (Factura, Orden de Compra, etc.)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="FAC-001234"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación de Almacenamiento *
                </label>

                {suggestedLocation && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-1">
                      ✨ Ubicación sugerida según rotación y volumen:
                    </p>
                    <p className="font-mono font-bold text-lg text-blue-900">
                      {suggestedLocation.id}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Zona {suggestedLocation.zone} - Capacidad:{" "}
                      {suggestedLocation.capacity} unidades
                    </p>
                  </div>
                )}

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Seleccione una ubicación</option>
                  {availableLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.id} - Zona {loc.zone} (Cap: {loc.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="card bg-gray-50">
            <h3 className="font-bold mb-3">Resumen de Recepción</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Producto:</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad a recibir:</span>
                <span className="font-bold text-lg">
                  {quantity || "0"} unidades
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock actual:</span>
                <span>{product.stock} unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Stock después de recepción:
                </span>
                <span className="font-bold text-green-600">
                  {product.stock + (parseInt(quantity) || 0)} unidades
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-mono">
                  {selectedLocation || "No seleccionada"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recibido por:</span>
                <span>{user.name}</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex space-x-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              ← Volver
            </button>
            <button
              onClick={handleConfirmReception}
              disabled={loading || !quantity || !selectedLocation}
              className="btn-success flex-1"
            >
              {loading ? (
                "Procesando..."
              ) : (
                <>
                  <Check className="w-5 h-5 inline-block mr-1" /> Confirmar
                  Recepción
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reception;
