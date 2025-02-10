import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || "";
        token.email = user.email || "";
        token.role = user.role || "";
        token.empleadoId = user.empleadoId ?? null; // En caso de que no haya empleadoId, asignamos null
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || ""; // Asignamos un valor predeterminado vacío en caso de que sea undefined o null
        session.user.email = token.email || ""; // Lo mismo para email
        session.user.role = token.role || ""; // Lo mismo para el rol
        session.user.empleadoId = token.empleadoId ?? null; // Si no existe, le damos null
      }
      return session;
    },
  },
});
