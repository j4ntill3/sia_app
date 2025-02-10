import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // El ID debe ser una cadena
    email: string;
    role: string;
    empleadoId: number | null;
  }

  interface Session {
    user: User; // Extender la sesión para incluir los nuevos campos
  }
}
