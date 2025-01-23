import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        console.log({ credentials });
        if (credentials.email !== "test@test.com") {
          throw new Error("Credenciales invalidas");
        }

        return {
          id: "1",
          name: "Test User",
          email: "test@test.com",
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
