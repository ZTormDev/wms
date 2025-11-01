import { Truck, Check } from "lucide-react";

const Dispatch = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Despacho de Pedidos</h1>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            <Truck className="w-24 h-24 mx-auto text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Módulo de Despacho
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Este módulo está integrado con el sistema de Picking. Una vez
            completadas las órdenes de picking, se pueden procesar los
            despachos.
          </p>
          <div className="mt-6">
            <a href="/picking" className="btn-primary inline-block">
              Ir a Picking
            </a>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-4">
          Funcionalidades del Módulo de Despacho:
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span>Generación de guías de despacho automáticas</span>
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span>Control de salida de mercancía</span>
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span>Actualización automática de stock</span>
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span>Sincronización con ERP</span>
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span>Registro de transportista y destino</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dispatch;
