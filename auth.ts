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
        token.personaId = user.personaId || ""; // Usamos personaId
        token.usuarioId = user.usuarioId || ""; // ID de usuario
        token.email = user.email || "";
        token.role = user.role || "";
        token.empleadoId = user.empleadoId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.personaId = token.personaId || ""; // Usamos personaId
        session.user.usuarioId = token.usuarioId || ""; // ID de usuario
        session.user.email = token.email || "";
        session.user.role = token.role || "";
        session.user.empleadoId = token.empleadoId ?? null;
      }
      return session;
    },
  },
});
