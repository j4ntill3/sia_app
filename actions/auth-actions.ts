"use server";

import { auth, signIn } from "@/auth";

export const loginAction = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
  } catch {
    console.log("error");
  }
};

export async function getSession() {
  const session = await auth();
  return session;
}
