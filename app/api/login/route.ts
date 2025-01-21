import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Implementamos la función comparePassword
async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function POST(request: NextRequest) {
  try {
    // Obtenemos el email y la contraseña del cuerpo de la solicitud
    const { email, password } = await request.json();

    // Buscar persona con el email proporcionado
    const persona = await prisma.persona.findUnique({
      where: { email },
    });

    if (!persona) {
      return new Response(
        JSON.stringify({ error: "Credenciales incorrectas" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ahora que tenemos la persona, podemos buscar el usuario relacionado con ella
    const user = await prisma.usuario.findFirst({
      where: { id_persona: persona.id },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Credenciales incorrectas" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar la contraseña (usando comparePassword)
    const isPasswordValid = await comparePassword(password, user.clave);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Credenciales incorrectas" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Aquí puedes continuar con el resto del flujo (generar un código de autorización, etc.)

    return new Response(JSON.stringify({ message: "Login exitoso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    // Agregamos el tipo unknown aquí
    console.error("Error en el login:", error);

    // Comprobamos si el error es una instancia de Error
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message || "Error desconocido" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Si el error no es una instancia de Error, retornamos un mensaje genérico
    return new Response(JSON.stringify({ error: "Error desconocido" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
