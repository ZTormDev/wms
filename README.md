# 📦 WMS - Sistema de Gestión de Almacenes

Sistema completo de gestión de almacenes desarrollado con React, Tailwind CSS y Vite.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)

## 🚀 Demo

[Ver Proyecto en Vivo](https://tu-demo-url.com) | [Ver Código](https://github.com/tu-usuario/wms)

---

## ✨ Características Principales

### 🔐 Autenticación

- 4 roles de usuario: Admin, Supervisor, Operario, Vendedor
- Control de acceso basado en permisos
- Rutas protegidas

### 📊 10 Módulos Funcionales

1. **Dashboard** - Métricas y estadísticas en tiempo real
2. **Productos** - CRUD completo con búsqueda
3. **Recepción** - Entrada de mercancía con escaneo
4. **Ubicaciones** - Gestión de racks del almacén
5. **Picking** - Órdenes de picking optimizadas
6. **Stock** - Consulta de inventario
7. **Movimientos** - Historial completo
8. **Despacho** - Control de salidas
9. **Reportes** - Análisis y exportación
10. **Usuarios** - Gestión de permisos

---

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS v4** - Estilos modernos
- **React Router** - Navegación SPA
- **Context API** - Gestión de estado
- **Lucide React** - Iconos profesionales

---

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/wms.git
cd wms

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

El proyecto estará disponible en `http://localhost:5173`

---

## 🔐 Usuarios de Prueba

| Rol           | Email              | Contraseña | Permisos     |
| ------------- | ------------------ | ---------- | ------------ |
| Administrador | admin@wms.com      | admin123   | Acceso total |
| Supervisor    | supervisor@wms.com | super123   | Supervisión  |
| Operario      | operario@wms.com   | opera123   | Operaciones  |
| Vendedor      | vendedor@wms.com   | vende123   | Solo lectura |

---

## 📱 Características Técnicas

✅ **Responsive Design** - Funciona en móvil, tablet y desktop  
✅ **Protected Routes** - Rutas seguras según rol  
✅ **Clean Code** - Código limpio y mantenible  
✅ **Mock Data** - Datos de prueba incluidos  
✅ **Modern UI** - Interfaz profesional con Tailwind  
✅ **SPA Navigation** - Navegación fluida sin recargas

---

## 📁 Estructura del Proyecto

```
wms/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/           # Context API
│   │   └── AuthContext.jsx
│   ├── pages/             # Páginas principales
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Reception.jsx
│   │   ├── Locations.jsx
│   │   ├── Picking.jsx
│   │   ├── Stock.jsx
│   │   ├── Movements.jsx
│   │   ├── Dispatch.jsx
│   │   ├── Reports.jsx
│   │   └── Users.jsx
│   ├── services/          # Servicios mock
│   │   ├── authService.js
│   │   └── dataService.js
│   └── App.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🎯 Funcionalidades Destacadas

### Dashboard Interactivo

- Estadísticas de inventario en tiempo real
- Alertas de stock bajo
- Movimientos recientes
- Accesos rápidos

### Sistema de Picking

- Órdenes priorizadas por urgencia
- Seguimiento de estado
- Validación de items
- Interfaz optimizada para operarios

### Gestión de Ubicaciones

- Vista de mapa del almacén
- Estados en tiempo real
- Organización por zonas
- Control de capacidad

### Reportes

- 6 tipos de análisis
- Exportación a PDF/Excel/CSV
- Métricas de eficiencia
- Análisis de rotación

---

## 🚀 Próximas Mejoras

- [ ] Integración con API REST
- [ ] Notificaciones en tiempo real
- [ ] Escaneo QR con cámara
- [ ] Dashboard con gráficos (Chart.js)
- [ ] Exportación real de reportes
- [ ] Modo offline
- [ ] Multi-idioma
- [ ] Tema oscuro

---

## 👨‍💻 Sobre el Proyecto

Desarrollado por **[Tu Nombre]**

Este proyecto demuestra habilidades en:

- ⚛️ React y Hooks avanzados
- 🎨 Diseño UI/UX moderno
- 🔐 Autenticación y autorización
- 📱 Responsive design
- 🏗️ Arquitectura escalable
- 💻 Clean code y mejores prácticas

---

## 📞 Contacto

¿Interesado en trabajar juntos?

- 💼 LinkedIn: [ZTormDev](https://www.linkedin.com/in/ztormdev/)
- 🐱 GitHub: [ZTormDev](https://github.com/ZTormDev)
- 📧 Email: ztormdev@gmail.com
- 🌐 Portfolio: [ztormdev.netlify.app](https://ztormdev.netlify.app/)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
