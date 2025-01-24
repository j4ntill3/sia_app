"use server";

import { auth, signIn } from "@/auth";

export const loginAction = async (email: string, password: string) => {
  try {
    // Realizamos el intento de login
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false, // No redirigir automáticamente
    });

    // Verificar si el resultado contiene un error
    if (result?.error) {
      // Si hay error, lanzamos el error
      throw new Error(result.error);
    }

    // Verificar si no se recibió respuesta de usuario (no autenticado)
    if (!result?.user) {
      throw new Error("Error desconocido en la autenticación.");
    }

    return result; // Devolver el resultado exitoso
  } catch (error: any) {
    // Aquí hacemos un cast explícito del error a un tipo Error
    if (error instanceof Error) {
      console.log("Error en el login:", error.message); // Mostrar el mensaje de error en consola
      // Lanzamos el error con un mensaje predeterminado
      throw new Error(
        error.message || "Error en el login. Intenta nuevamente."
      );
    } else {
      console.log("Error desconocido");
      throw new Error("Error desconocido en el login.");
    }
  }
};

export async function getSession() {
  const session = await auth();
  return session;
}
