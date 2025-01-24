import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const checkCredentials = async (email: string, password: string) => {
  try {
    // Buscar el usuario en la base de datos
    const user = await prisma.usuario.findFirst({
      where: {
        eliminado: false, // Verificar que el usuario no esté eliminado
        persona: {
          email: email, // Verificar el email
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
      },
    });

    // Si no se encuentra el usuario, lanzar un error
    if (!user) {
      console.log("Usuario no encontrado o eliminado.");
      return;
    }

    // Verifica si la contraseña proporcionada coincide con la almacenada en la base de datos
    const isValid = await bcrypt.compare(password, user.clave);

    // Log para ver si la comparación fue exitosa o no
    console.log("Contraseña proporcionada:", password);
    console.log("Contraseña almacenada:", user.clave);
    console.log("¿Es válida la contraseña?", isValid);

    if (isValid) {
      console.log("Login exitoso. Credenciales correctas.");
    } else {
      console.log("Credenciales inválidas. Contraseña incorrecta.");
    }
  } catch (error) {
    console.error("Error al verificar las credenciales:", error);
  } finally {
    // Cerrar la conexión a Prisma
    await prisma.$disconnect();
  }
};

// Test: Reemplaza con los datos que desees verificar
const testEmail = "user@example.com"; // Cambiar por un email de prueba
const testPassword = "password123"; // Cambiar por una contraseña de prueba

checkCredentials(testEmail, testPassword);
