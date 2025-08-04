import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Crear roles de usuario
  console.log("📝 Creando roles de usuario...");
  const adminRole = await prisma.userRole.create({
    data: { roleType: "administrador", deleted: false },
  });
  const agenteRole = await prisma.userRole.create({
    data: { roleType: "agente", deleted: false },
  });
  const clienteRole = await prisma.userRole.create({
    data: { roleType: "cliente", deleted: false },
  });

  // Crear tipos de empleado
  console.log("👥 Creando tipos de empleado...");
  const adminType = await prisma.employeeType.create({
    data: { type: "administrador" },
  });
  const agenteType = await prisma.employeeType.create({
    data: { type: "agente" },
  });

  // Crear estados de propiedad
  console.log("🏠 Creando estados de propiedad...");
  const statusDisponible = await prisma.propertyStatus.create({
    data: { status: "Disponible" },
  });
  const statusAlquilado = await prisma.propertyStatus.create({
    data: { status: "Alquilado" },
  });
  const statusVendido = await prisma.propertyStatus.create({
    data: { status: "Vendido" },
  });
  const statusReservado = await prisma.propertyStatus.create({
    data: { status: "Reservado" },
  });
  const statusMantenimiento = await prisma.propertyStatus.create({
    data: { status: "En mantenimiento" },
  });

  // Crear categorías de propiedad
  console.log("🏘️ Creando categorías de propiedad...");
  const catCasa = await prisma.propertyCategory.create({
    data: { category: "Casa" },
  });
  const catDepto = await prisma.propertyCategory.create({
    data: { category: "Departamento" },
  });
  const catTerreno = await prisma.propertyCategory.create({
    data: { category: "Terreno" },
  });
  const catComercial = await prisma.propertyCategory.create({
    data: { category: "Comercial" },
  });
  const catOficina = await prisma.propertyCategory.create({
    data: { category: "Oficina" },
  });

  // Crear personas
  console.log("👤 Creando personas...");
  const persons = await Promise.all([
    prisma.person.create({
      data: {
        firstName: "Ana",
        lastName: "García",
        email: "ana.garcia@ejemplo.com",
        phone: "123456789",
        address: "Calle Principal 123",
        dni: 12345678,
        deleted: false,
      },
    }),
    prisma.person.create({
      data: {
        firstName: "Carlos",
        lastName: "López",
        email: "carlos.lopez@ejemplo.com",
        phone: "987654321",
        address: "Avenida Central 456",
        dni: 87654321,
        deleted: false,
      },
    }),
    prisma.person.create({
      data: {
        firstName: "María",
        lastName: "Rodríguez",
        email: "maria.rodriguez@ejemplo.com",
        phone: "555555555",
        address: "Plaza Mayor 789",
        dni: 55555555,
        deleted: false,
      },
    }),
    prisma.person.create({
      data: {
        firstName: "Juan",
        lastName: "Martínez",
        email: "juan.martinez@ejemplo.com",
        phone: "111111111",
        address: "Calle Secundaria 321",
        dni: 11111111,
        deleted: false,
      },
    }),
  ]);

  // Crear empleados
  console.log("👷 Creando empleados...");
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        cuit: "20-12345678-9",
        hireDate: new Date("2024-01-01"),
        typeId: adminType.id,
        deleted: false,
      },
    }),
    prisma.employee.create({
      data: {
        cuit: "20-87654321-0",
        hireDate: new Date("2024-02-01"),
        typeId: agenteType.id,
        deleted: false,
      },
    }),
    prisma.employee.create({
      data: {
        cuit: "20-55555555-1",
        hireDate: new Date("2024-03-01"),
        typeId: agenteType.id,
        deleted: false,
      },
    }),
    prisma.employee.create({
      data: {
        cuit: "20-11111111-2",
        hireDate: new Date("2024-04-01"),
        typeId: agenteType.id,
        deleted: false,
      },
    }),
  ]);

  // Crear relaciones persona-empleado
  console.log("🔗 Creando relaciones persona-empleado...");
  for (let i = 0; i < persons.length; i++) {
    await prisma.personEmployee.create({
      data: {
        personId: persons[i].id,
        employeeId: employees[i].id,
        deleted: false,
      },
    });
  }

  // Crear usuarios con contraseñas hasheadas
  console.log("👤 Creando usuarios...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      roleId: adminRole.id,
      password: hashedPassword,
      personId: persons[0].id,
      deleted: false,
    },
  });
  for (let i = 1; i < persons.length; i++) {
    await prisma.user.create({
      data: {
        roleId: agenteRole.id,
        password: hashedPassword,
        personId: persons[i].id,
        deleted: false,
      },
    });
  }

  // Crear propiedades de ejemplo
  console.log("🏠 Creando propiedades de ejemplo...");
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: "Casa moderna en Palermo",
        categoryId: catCasa.id,
        locality: "Buenos Aires",
        address: "Av. Santa Fe 1234",
        neighborhood: "Palermo",
        numBedrooms: 3,
        numBathrooms: 2,
        surface: 120.5,
        garage: true,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Departamento céntrico",
        categoryId: catDepto.id,
        locality: "Buenos Aires",
        address: "Florida 567",
        neighborhood: "Microcentro",
        numBedrooms: 2,
        numBathrooms: 1,
        surface: 65.0,
        garage: false,
        statusId: statusAlquilado.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Casa quinta en San Isidro",
        categoryId: catCasa.id,
        locality: "San Isidro",
        address: "Camino Real 890",
        neighborhood: "San Isidro",
        numBedrooms: 4,
        numBathrooms: 3,
        surface: 250.0,
        garage: true,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Local comercial en Recoleta",
        categoryId: catComercial.id,
        locality: "Buenos Aires",
        address: "Av. Alvear 456",
        neighborhood: "Recoleta",
        numBedrooms: 0,
        numBathrooms: 1,
        surface: 80.0,
        garage: false,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Penthouse de lujo en Puerto Madero",
        categoryId: catDepto.id,
        locality: "Buenos Aires",
        address: "Juana Manso 123",
        neighborhood: "Puerto Madero",
        numBedrooms: 5,
        numBathrooms: 4,
        surface: 350.0,
        garage: true,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Oficina pequeña en el centro",
        categoryId: catOficina.id,
        locality: "Rosario",
        address: "Córdoba 789",
        neighborhood: "Centro",
        numBedrooms: 0,
        numBathrooms: 1,
        surface: 40.0,
        garage: false,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Terreno amplio en Tigre",
        categoryId: catTerreno.id,
        locality: "Tigre",
        address: "Ruta 27 km 10",
        neighborhood: "Delta",
        numBedrooms: 0,
        numBathrooms: 0,
        surface: 1000.0,
        garage: false,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Casa clásica en Belgrano",
        categoryId: catCasa.id,
        locality: "Buenos Aires",
        address: "Juramento 2345",
        neighborhood: "Belgrano",
        numBedrooms: 4,
        numBathrooms: 3,
        surface: 180.0,
        garage: true,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Oficina moderna en Microcentro",
        categoryId: catOficina.id,
        locality: "Buenos Aires",
        address: "Lavalle 1000",
        neighborhood: "Microcentro",
        numBedrooms: 0,
        numBathrooms: 2,
        surface: 90.0,
        garage: false,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Casa familiar en Caballito",
        categoryId: catCasa.id,
        locality: "Buenos Aires",
        address: "Av. Rivadavia 5000",
        neighborhood: "Caballito",
        numBedrooms: 3,
        numBathrooms: 2,
        surface: 130.0,
        garage: true,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Departamento con vista al río",
        categoryId: catDepto.id,
        locality: "Rosario",
        address: "Av. Belgrano 200",
        neighborhood: "Río Paraná",
        numBedrooms: 2,
        numBathrooms: 2,
        surface: 75.0,
        garage: true,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
    prisma.property.create({
      data: {
        title: "Lote comercial en San Telmo",
        categoryId: catComercial.id,
        locality: "Buenos Aires",
        address: "Defensa 800",
        neighborhood: "San Telmo",
        numBedrooms: 0,
        numBathrooms: 1,
        surface: 150.0,
        garage: false,
        statusId: statusDisponible.id,
        deleted: false,
      },
    }),
  ]);

  // Crear imágenes para propiedades
  console.log("🖼️ Creando imágenes de propiedades...");
  for (const property of properties) {
    await prisma.propertyImage.create({
      data: {
        propertyId: property.id,
        imagePath: `/img/no-image.webp`,
      },
    });
  }

  // Crear asignaciones de propiedad-agente
  console.log("👥 Asignando agentes a propiedades...");
  for (let i = 0; i < properties.length; i++) {
    await prisma.propertyAgent.create({
      data: {
        propertyId: properties[i].id,
        agentId: employees[i % employees.length].id,
        deleted: false,
      },
    });
  }

  console.log("✅ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
