import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    personaId: number;
    usuarioId: number;
    email: string;
    role: string;
    empleadoId: number | null;
  }

  interface Session {
    user: User;
  }
}
