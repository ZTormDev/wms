// Mock de datos de productos
let MOCK_PRODUCTS = [
  {
    id: 1,
    sku: "SKU001",
    ean: "7501234567890",
    name: "Producto A - Electrónico",
    category: "Electrónica",
    stock: 150,
    minStock: 20,
    location: "A-01-01",
    rotationType: "alta",
    volume: "pequeño",
    lastEntry: "2024-10-15",
    nextArrival: "2024-11-05",
    description: "Dispositivo electrónico de alta rotación",
  },
  {
    id: 2,
    sku: "SKU002",
    ean: "7501234567891",
    name: "Producto B - Herramienta",
    category: "Herramientas",
    stock: 85,
    minStock: 15,
    location: "B-02-03",
    rotationType: "media",
    volume: "mediano",
    lastEntry: "2024-10-20",
    nextArrival: null,
    description: "Herramienta de uso general",
  },
  {
    id: 3,
    sku: "SKU003",
    ean: "7501234567892",
    name: "Producto C - Material de Oficina",
    category: "Oficina",
    stock: 5,
    minStock: 10,
    location: "C-01-05",
    rotationType: "baja",
    volume: "pequeño",
    lastEntry: "2024-09-10",
    nextArrival: "2024-11-02",
    description: "Materiales de oficina diversos",
  },
  {
    id: 4,
    sku: "SKU004",
    ean: "7501234567893",
    name: "Producto D - Industrial",
    category: "Industrial",
    stock: 220,
    minStock: 50,
    location: "A-03-02",
    rotationType: "alta",
    volume: "grande",
    lastEntry: "2024-10-25",
    nextArrival: null,
    description: "Componente industrial pesado",
  },
  {
    id: 5,
    sku: "SKU005",
    ean: "7501234567894",
    name: "Producto E - Consumible",
    category: "Consumibles",
    stock: 0,
    minStock: 30,
    location: "B-01-01",
    rotationType: "alta",
    volume: "pequeño",
    lastEntry: "2024-09-30",
    nextArrival: "2024-11-03",
    description: "Producto consumible de alta demanda",
  },
];

// Mock de ubicaciones/racks
let MOCK_LOCATIONS = [
  {
    id: "A-01-01",
    zone: "A",
    rack: "01",
    level: "01",
    occupied: true,
    capacity: 200,
  },
  {
    id: "A-01-02",
    zone: "A",
    rack: "01",
    level: "02",
    occupied: false,
    capacity: 200,
  },
  {
    id: "A-02-01",
    zone: "A",
    rack: "02",
    level: "01",
    occupied: false,
    capacity: 200,
  },
  {
    id: "A-03-02",
    zone: "A",
    rack: "03",
    level: "02",
    occupied: true,
    capacity: 300,
  },
  {
    id: "B-01-01",
    zone: "B",
    rack: "01",
    level: "01",
    occupied: true,
    capacity: 150,
  },
  {
    id: "B-02-03",
    zone: "B",
    rack: "02",
    level: "03",
    occupied: true,
    capacity: 150,
  },
  {
    id: "C-01-05",
    zone: "C",
    rack: "01",
    level: "05",
    occupied: true,
    capacity: 100,
  },
];

// Mock de movimientos
let MOCK_MOVEMENTS = [
  {
    id: 1,
    type: "entrada",
    productId: 1,
    productName: "Producto A - Electrónico",
    quantity: 50,
    location: "A-01-01",
    date: "2024-10-15T10:30:00",
    user: "Pedro Operario",
    reference: "FAC-001234",
  },
  {
    id: 2,
    type: "salida",
    productId: 2,
    productName: "Producto B - Herramienta",
    quantity: 15,
    location: "B-02-03",
    date: "2024-10-20T14:20:00",
    user: "Pedro Operario",
    reference: "PED-005678",
  },
];

// Mock de órdenes de picking
let MOCK_PICKING_ORDERS = [
  {
    id: 1,
    orderNumber: "PED-001",
    status: "pendiente",
    priority: "alta",
    createdAt: "2024-10-28T09:00:00",
    items: [
      {
        productId: 1,
        productName: "Producto A - Electrónico",
        quantity: 10,
        location: "A-01-01",
        picked: 0,
      },
      {
        productId: 4,
        productName: "Producto D - Industrial",
        quantity: 5,
        location: "A-03-02",
        picked: 0,
      },
    ],
    assignedTo: null,
    completedAt: null,
  },
  {
    id: 2,
    orderNumber: "PED-002",
    status: "en_proceso",
    priority: "media",
    createdAt: "2024-10-28T10:30:00",
    items: [
      {
        productId: 2,
        productName: "Producto B - Herramienta",
        quantity: 3,
        location: "B-02-03",
        picked: 2,
      },
    ],
    assignedTo: "Pedro Operario",
    completedAt: null,
  },
  {
    id: 3,
    orderNumber: "PED-003",
    status: "completado",
    priority: "baja",
    createdAt: "2024-10-27T15:00:00",
    items: [
      {
        productId: 1,
        productName: "Producto A - Electrónico",
        quantity: 8,
        location: "A-01-01",
        picked: 8,
      },
    ],
    assignedTo: "Pedro Operario",
    completedAt: "2024-10-27T16:30:00",
  },
];

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay();
    return [...MOCK_PRODUCTS];
  },

  async getById(id) {
    await delay();
    const product = MOCK_PRODUCTS.find((p) => p.id === parseInt(id));
    if (!product) throw new Error("Producto no encontrado");
    return product;
  },

  async getBySku(sku) {
    await delay();
    const product = MOCK_PRODUCTS.find((p) => p.sku === sku || p.ean === sku);
    return product || null;
  },

  async create(productData) {
    await delay();
    const newProduct = {
      id: MOCK_PRODUCTS.length + 1,
      ...productData,
      stock: 0,
      lastEntry: null,
    };
    MOCK_PRODUCTS.push(newProduct);
    return newProduct;
  },

  async update(id, productData) {
    await delay();
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");
    MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
    return MOCK_PRODUCTS[index];
  },

  async delete(id) {
    await delay();
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.id !== id);
    return { success: true };
  },

  async getLowStock() {
    await delay();
    return MOCK_PRODUCTS.filter((p) => p.stock <= p.minStock);
  },

  async searchProducts(query) {
    await delay();
    const lowerQuery = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.ean.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  },
};

export const locationService = {
  async getAll() {
    await delay();
    return [...MOCK_LOCATIONS];
  },

  async getAvailable() {
    await delay();
    return MOCK_LOCATIONS.filter((l) => !l.occupied);
  },

  async suggestLocation(productData) {
    await delay();
    // Lógica de sugerencia basada en rotación y volumen
    const available = MOCK_LOCATIONS.filter((l) => !l.occupied);

    if (available.length === 0) {
      throw new Error("No hay ubicaciones disponibles");
    }

    // Productos de alta rotación en zona A, media en B, baja en C
    let preferredZone = "A";
    if (productData.rotationType === "media") preferredZone = "B";
    if (productData.rotationType === "baja") preferredZone = "C";

    const zoneLocations = available.filter((l) => l.zone === preferredZone);
    return zoneLocations.length > 0 ? zoneLocations[0] : available[0];
  },

  async assignLocation(locationId, productId) {
    await delay();
    const location = MOCK_LOCATIONS.find((l) => l.id === locationId);
    if (!location) throw new Error("Ubicación no encontrada");
    location.occupied = true;
    return location;
  },
};

export const movementService = {
  async getAll(filters = {}) {
    await delay();
    let movements = [...MOCK_MOVEMENTS];

    if (filters.type) {
      movements = movements.filter((m) => m.type === filters.type);
    }

    if (filters.productId) {
      movements = movements.filter((m) => m.productId === filters.productId);
    }

    return movements.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create(movementData) {
    await delay();
    const newMovement = {
      id: MOCK_MOVEMENTS.length + 1,
      ...movementData,
      date: new Date().toISOString(),
    };
    MOCK_MOVEMENTS.push(newMovement);

    // Actualizar stock del producto
    const product = MOCK_PRODUCTS.find((p) => p.id === movementData.productId);
    if (product) {
      if (movementData.type === "entrada") {
        product.stock += movementData.quantity;
        product.lastEntry = new Date().toISOString().split("T")[0];
      } else {
        product.stock -= movementData.quantity;
      }
    }

    return newMovement;
  },

  async getStats() {
    await delay();
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentMovements = MOCK_MOVEMENTS.filter(
      (m) => new Date(m.date) >= last7Days
    );

    return {
      totalEntries: recentMovements.filter((m) => m.type === "entrada").length,
      totalExits: recentMovements.filter((m) => m.type === "salida").length,
      totalQuantityIn: recentMovements
        .filter((m) => m.type === "entrada")
        .reduce((sum, m) => sum + m.quantity, 0),
      totalQuantityOut: recentMovements
        .filter((m) => m.type === "salida")
        .reduce((sum, m) => sum + m.quantity, 0),
    };
  },
};

export const pickingService = {
  async getAll() {
    await delay();
    return [...MOCK_PICKING_ORDERS];
  },

  async getById(id) {
    await delay();
    const order = MOCK_PICKING_ORDERS.find((o) => o.id === id);
    if (!order) throw new Error("Orden no encontrada");
    return order;
  },

  async create(orderData) {
    await delay();
    const newOrder = {
      id: MOCK_PICKING_ORDERS.length + 1,
      ...orderData,
      status: "pendiente",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    MOCK_PICKING_ORDERS.push(newOrder);
    return newOrder;
  },

  async assignTo(orderId, userName) {
    await delay();
    const order = MOCK_PICKING_ORDERS.find((o) => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada");
    order.assignedTo = userName;
    order.status = "en_proceso";
    return order;
  },

  async updateItemPicked(orderId, productId, pickedQuantity) {
    await delay();
    const order = MOCK_PICKING_ORDERS.find((o) => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada");

    const item = order.items.find((i) => i.productId === productId);
    if (!item) throw new Error("Producto no encontrado en la orden");

    item.picked = pickedQuantity;

    // Verificar si todos los items están completos
    const allPicked = order.items.every((i) => i.picked >= i.quantity);
    if (allPicked) {
      order.status = "completado";
      order.completedAt = new Date().toISOString();
    }

    return order;
  },

  async complete(orderId) {
    await delay();
    const order = MOCK_PICKING_ORDERS.find((o) => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada");
    order.status = "completado";
    order.completedAt = new Date().toISOString();

    // Actualizar stock
    order.items.forEach((item) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    });

    return order;
  },
};
