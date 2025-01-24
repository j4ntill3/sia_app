import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        // Verificar que las credenciales sean de tipo string
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          throw new Error(
            "El email o la contraseña proporcionados no son válidos."
          );
        }

        // Buscar el usuario en la base de datos con su rol
        const user = await prisma.usuario.findFirst({
          where: {
            eliminado: false, // Verificar que el usuario no esté eliminado
            persona: {
              email: credentials.email, // Verificar el email
              eliminado: false, // Verificar que la persona asociada no esté eliminada
            },
          },
          select: {
            clave: true, // Obtener la clave (contraseña)
            persona: {
              select: {
                email: true, // Obtener el email de la persona
              },
            },
            rolusuario: {
              select: {
                tipo_rol: true, // Obtener el tipo de rol
              },
            },
          },
        });

        // Si no se encuentra el usuario, lanzar un error
        if (!user) {
          throw new Error("Credenciales inválidas");
        }

        // Verifica si la contraseña proporcionada coincide con la almacenada en la base de datos
        const isValid = await bcrypt.compare(credentials.password, user.clave);

        if (!isValid) {
          throw new Error("Credenciales inválidas");
        }

        // Si todo es correcto, devolver el usuario con su rol
        return {
          id: user.persona.email, // ID único del usuario basado en el email
          email: user.persona.email, // Email del usuario
          role: user.rolusuario.tipo_rol, // Rol del usuario
        };
      },
    }),
  ],
  pages: {
    signIn: "/", // Página a la que redirige si el usuario no está autenticado
    error: "/error", // Página en caso de error
  },
} satisfies NextAuthConfig;
