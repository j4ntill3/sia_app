import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const config: any = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          return null;
        }

        const user = await prisma.usuario.findFirst({
          where: {
            eliminado: false,
            persona: {
              correo: email,
              eliminado: false,
            },
          },
          include: {
            persona: {
              include: {
                empleados: {
                  include: {
                    empleado: true,
                  },
                },
              },
            },
            rol_usuario: true,
          },
        });

        if (!user) {
           return null;
         }

         const isPasswordValid = await bcrypt.compare(password, user.contrasena);

         if (!isPasswordValid) {
           return null;
         }

    // Obtener el empleado relacionado (si existe)
    const empleadoRelacionado = user.persona.empleados?.[0]?.empleado;

         return {
           id: user.id.toString(),
           email: user.persona.correo,
           name: `${user.persona.nombre} ${user.persona.apellido}`,
           role: user.rol_usuario?.tipo_rol,
           empleadoId: empleadoRelacionado?.id ?? null,
         };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.empleadoId = user.empleadoId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role;
        session.user.empleadoId = token.empleadoId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default config;
