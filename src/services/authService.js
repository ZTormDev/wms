// Mock de datos de usuarios
const MOCK_USERS = [
  {
    id: 1,
    name: "Admin Usuario",
    email: "admin@wms.com",
    password: "admin123",
    role: "admin",
    avatar: null,
  },
  {
    id: 2,
    name: "Juan Supervisor",
    email: "supervisor@wms.com",
    password: "super123",
    role: "supervisor",
    avatar: null,
  },
  {
    id: 3,
    name: "Pedro Operario",
    email: "operario@wms.com",
    password: "oper123",
    role: "operario",
    avatar: null,
  },
  {
    id: 4,
    name: "María Vendedora",
    email: "vendedor@wms.com",
    password: "vend123",
    role: "vendedor",
    avatar: null,
  },
];

// Simular delay de red
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Generar token JWT mock
const generateMockToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  };
  return btoa(JSON.stringify(payload));
};

export const authService = {
  async login(email, password) {
    await delay();

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateMockToken(user);

    return {
      user: userWithoutPassword,
      token,
    };
  },

  async validateToken(token) {
    await delay(200);

    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        throw new Error("Token expirado");
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  async changePassword(userId, oldPassword, newPassword) {
    await delay();
    // Simulación - en producción iría al backend
    return { success: true };
  },
};
