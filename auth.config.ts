import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// auth.config.ts o el archivo donde tienes el provider de Credentials
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
            id: true, // ID de la tabla usuario
            clave: true,
            persona: {
              select: {
                id: true, // ID de la tabla persona
                email: true,
                persona_empleado: {
                  where: { eliminado: false },
                  select: {
                    idempleado: true,
                  },
                },
              },
            },
            rolusuario: {
              select: {
                tipo_rol: true,
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

        // Retornar los datos de la sesión, incluyendo el ID del usuario
        return {
          personaId: user.persona.id, // ID de la tabla persona
          usuarioId: user.id, // ID de la tabla usuario
          email: user.persona.email,
          role: user.rolusuario.tipo_rol,
          empleadoId,
        };
      },
    }),
  ],
};
