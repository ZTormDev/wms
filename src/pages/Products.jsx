import { useState, useEffect } from "react";
import { productService } from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit2, Trash2 } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    sku: "",
    ean: "",
    name: "",
    category: "",
    minStock: 10,
    rotationType: "media",
    volume: "mediano",
    description: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterType]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtro por búsqueda
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.sku.toLowerCase().includes(lower) ||
          p.ean.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      );
    }

    // Filtro por tipo
    if (filterType === "lowstock") {
      filtered = filtered.filter((p) => p.stock <= p.minStock);
    } else if (filterType === "outofstock") {
      filtered = filtered.filter((p) => p.stock === 0);
    } else if (filterType === "instock") {
      filtered = filtered.filter((p) => p.stock > p.minStock);
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
      } else {
        await productService.create(formData);
      }
      await loadProducts();
      closeModal();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("Error al guardar el producto");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      ean: product.ean,
      name: product.name,
      category: product.category,
      minStock: product.minStock,
      rotationType: product.rotationType,
      volume: product.volume,
      description: product.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      try {
        await productService.delete(id);
        await loadProducts();
      } catch (error) {
        console.error("Error eliminando producto:", error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      sku: "",
      ean: "",
      name: "",
      category: "",
      minStock: 10,
      rotationType: "media",
      volume: "mediano",
      description: "",
    });
  };

  const canEdit = user?.role === "admin" || user?.role === "supervisor";

  const getStockBadge = (product) => {
    if (product.stock === 0)
      return <span className="badge badge-danger">Sin Stock</span>;
    if (product.stock <= product.minStock)
      return <span className="badge badge-warning">Stock Bajo</span>;
    return <span className="badge badge-success">En Stock</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Productos
        </h1>
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 inline-block mr-1" /> Nuevo Producto
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, SKU, EAN o categoría..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Stock
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos los productos</option>
              <option value="instock">En Stock</option>
              <option value="lowstock">Stock Bajo</option>
              <option value="outofstock">Sin Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3">SKU/EAN</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Rotación</th>
                {canEdit && <th className="px-4 py-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium">{product.sku}</div>
                      <div className="text-gray-500">{product.ean}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">
                      {product.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge badge-info">{product.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-bold">{product.stock}</div>
                      <div className="text-gray-500 text-xs">
                        Min: {product.minStock}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStockBadge(product)}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {product.location || "Sin asignar"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        product.rotationType === "alta"
                          ? "badge-success"
                          : product.rotationType === "media"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {product.rotationType}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={canEdit ? 8 : 7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de agregar/editar producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EAN *
                    </label>
                    <input
                      type="text"
                      value={formData.ean}
                      onChange={(e) =>
                        setFormData({ ...formData, ean: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Mínimo *
                    </label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStock: parseInt(e.target.value),
                        })
                      }
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Rotación *
                    </label>
                    <select
                      value={formData.rotationType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rotationType: e.target.value,
                        })
                      }
                      className="input-field"
                      required
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volumen *
                    </label>
                    <select
                      value={formData.volume}
                      onChange={(e) =>
                        setFormData({ ...formData, volume: e.target.value })
                      }
                      className="input-field"
                      required
                    >
                      <option value="pequeño">Pequeño</option>
                      <option value="mediano">Mediano</option>
                      <option value="grande">Grande</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? "Actualizar" : "Crear"} Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
