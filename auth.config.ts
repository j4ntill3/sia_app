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

        const user = await prisma.user.findFirst({
          where: {
            deleted: false,
            person: {
              email: email,
              deleted: false,
            },
          },
          include: {
            person: {
              include: {
                personEmployee: {
                  include: {
                    employee: true,
                  },
                },
              },
            },
            userRole: true,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Determine employee type
        const employeeId =
          user.person.personEmployee.length > 0
            ? user.person.personEmployee[0].employeeId
            : null;

        return {
          id: user.id.toString(),
          email: user.person.email,
          name: `${user.person.firstName} ${user.person.lastName}`,
          role: user.userRole.roleType,
          employeeId: employeeId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.employeeId = user.employeeId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role;
        session.user.employeeId = token.employeeId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default config;
