import {
  Plus,
  Edit2,
  Trash2,
  Crown,
  UserCog,
  HardHat,
  Briefcase,
} from "lucide-react";

const Users = () => {
  const mockUsers = [
    {
      id: 1,
      name: "Admin Usuario",
      email: "admin@wms.com",
      role: "admin",
      active: true,
    },
    {
      id: 2,
      name: "Juan Supervisor",
      email: "supervisor@wms.com",
      role: "supervisor",
      active: true,
    },
    {
      id: 3,
      name: "Pedro Operario",
      email: "operario@wms.com",
      role: "operario",
      active: true,
    },
    {
      id: 4,
      name: "María Vendedora",
      email: "vendedor@wms.com",
      role: "vendedor",
      active: true,
    },
  ];

  const getRoleBadge = (role) => {
    const badges = {
      admin: "badge-danger",
      supervisor: "badge-info",
      operario: "badge-success",
      vendedor: "badge-warning",
    };
    const labels = {
      admin: "Administrador",
      supervisor: "Supervisor",
      operario: "Operario",
      vendedor: "Vendedor",
    };
    return <span className={`badge ${badges[role]}`}>{labels[role]}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <button className="btn-primary">
          <Plus className="w-5 h-5 inline-block mr-1" /> Nuevo Usuario
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="px-4 py-3 font-mono">#{user.id}</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        user.active ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-gray-50">
        <h3 className="font-bold mb-4">Permisos por Rol</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-purple-700 mb-2">
              <Crown className="w-5 h-5 inline-block mr-1" /> Administrador
            </h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Control total del sistema</li>
              <li>• Gestión de usuarios</li>
              <li>• Acceso a todos los módulos</li>
              <li>• Configuración del sistema</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-700 mb-2">
              <UserCog className="w-5 h-5 inline-block mr-1" /> Supervisor
            </h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Monitoreo de operarios</li>
              <li>• Validación de procesos</li>
              <li>• Generación de reportes</li>
              <li>• Sin acceso a configuración</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-green-700 mb-2">
              <HardHat className="w-5 h-5 inline-block mr-1" /> Operario
            </h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Recepción de mercancía</li>
              <li>• Picking y despacho</li>
              <li>• Registro de movimientos</li>
              <li>• Sin acceso administrativo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-orange-700 mb-2">
              <Briefcase className="w-5 h-5 inline-block mr-1" /> Vendedor
            </h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Consulta de stock (solo lectura)</li>
              <li>• Fechas de llegada de productos</li>
              <li>• Sin modificar inventario</li>
              <li>• Sin acceso a configuración</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
