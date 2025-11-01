import {
  BarChart3,
  TrendingUp,
  RefreshCw,
  Zap,
  Package,
  ClipboardList,
  FileText,
  Lightbulb,
} from "lucide-react";

const Reports = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-4xl mb-3">
            <BarChart3 className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Reporte de Inventario</h3>
          <p className="text-gray-600 mb-4">
            Stock actual, valorización y productos con bajo stock
          </p>
          <button className="btn-primary w-full">Generar Reporte</button>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-4xl mb-3">
            <TrendingUp className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Análisis de Rotación</h3>
          <p className="text-gray-600 mb-4">
            Productos más y menos rotados, tiempos de permanencia
          </p>
          <button className="btn-primary w-full">Generar Reporte</button>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-4xl mb-3">
            <RefreshCw className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Movimientos</h3>
          <p className="text-gray-600 mb-4">
            Historial de entradas, salidas y transferencias
          </p>
          <button className="btn-primary w-full">Generar Reporte</button>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-4xl mb-3">
            <Zap className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Eficiencia Operativa</h3>
          <p className="text-gray-600 mb-4">
            Tiempos de picking, recepciones y despachos
          </p>
          <button className="btn-primary w-full">Generar Reporte</button>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-4xl mb-3">
            <Package className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Ocupación de Ubicaciones</h3>
          <p className="text-gray-600 mb-4">
            Tasa de ocupación por zona, racks disponibles
          </p>
          <button className="btn-primary w-full">Generar Reporte</button>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-4xl mb-3">
            <ClipboardList className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Auditoría de Acciones</h3>
          <p className="text-gray-600 mb-4">
            Bitácora de usuarios, acciones realizadas
          </p>
          <button className="btn-primary w-full">Generar Reporte</button>
        </div>
      </div>

      <div className="card bg-blue-50">
        <h3 className="font-bold text-blue-900 mb-3">
          <Lightbulb className="w-5 h-5 inline-block mr-1" /> Exportación de
          Reportes
        </h3>
        <p className="text-blue-800 mb-4">
          Todos los reportes pueden exportarse en los siguientes formatos:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="badge bg-blue-200 text-blue-900">
            <FileText className="w-4 h-4 inline-block mr-1" /> PDF
          </span>
          <span className="badge bg-blue-200 text-blue-900">
            <BarChart3 className="w-4 h-4 inline-block mr-1" /> Excel
          </span>
          <span className="badge bg-blue-200 text-blue-900">
            <TrendingUp className="w-4 h-4 inline-block mr-1" /> CSV
          </span>
          <span className="badge bg-blue-200 text-blue-900">📧 Email</span>
        </div>
      </div>
    </div>
  );
};

export default Reports;
