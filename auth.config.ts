import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          throw new Error(
            "El email o la contraseña proporcionados no son válidos."
          );
        }

        const user = await prisma.usuario.findFirst({
          where: {
            eliminado: false,
            persona: {
              email: credentials.email,
              eliminado: false,
            },
          },
          select: {
            clave: true,
            persona: {
              select: {
                id: true,
                email: true,
                persona_empleado: {
                  where: { eliminado: false },
                  select: {
                    idempleado: true, // Seleccionar el ID del empleado
                  },
                },
              },
            },
            rolusuario: {
              select: {
                tipo_rol: true, // Seleccionar el tipo de rol
              },
            },
          },
        });

        if (!user) {
          throw new Error("Credenciales inválidas");
        }

        // Validar la contraseña
        const isValid = await bcrypt.compare(credentials.password, user.clave);

        if (!isValid) {
          throw new Error("Credenciales inválidas");
        }

        // Extraer el empleadoId correctamente
        const empleadoId =
          user.persona.persona_empleado.length > 0
            ? user.persona.persona_empleado[0].idempleado
            : null;

        console.log({
          id: user.persona.id.toString(),
          email: user.persona.email,
          role: user.rolusuario.tipo_rol,
          empleadoId,
        });

        // Retornar los datos de la sesión
        return {
          id: user.persona.id.toString(),
          email: user.persona.email,
          role: user.rolusuario.tipo_rol,
          empleadoId, // Incluir el empleadoId
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/error",
  },
} satisfies NextAuthConfig;
