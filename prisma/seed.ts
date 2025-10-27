// Ajustar los valores de tipo_id en la seed para que sean string y evitar errores de tipo.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Crear roles de usuario
  console.log("📝 Creando roles de usuario...");
  const adminRole = await prisma.rol_usuario.create({
    data: { tipo_rol: "administrador", eliminado: false },
  });
  const agenteRole = await prisma.rol_usuario.create({
    data: { tipo_rol: "agente", eliminado: false },
  });
  await prisma.rol_usuario.create({
    data: { tipo_rol: "cliente", eliminado: false },
  });

  // Crear tipos de empleado
  console.log("👥 Creando tipos de empleado...");
  const tipoAdmin = await prisma.tipo_empleado.create({ data: { tipo: "administrador" } });
  const tipoAgente = await prisma.tipo_empleado.create({ data: { tipo: "agente" } });

  // Crear estados de inmueble
  console.log("🏠 Creando estados de inmueble...");
  const statusDisponible = await prisma.estado_inmueble.create({
    data: { estado: "Disponible" },
  });
  const statusAlquilado = await prisma.estado_inmueble.create({
    data: { estado: "Alquilado" },
  });
  await prisma.estado_inmueble.create({
    data: { estado: "Vendido" },
  });
  await prisma.estado_inmueble.create({
    data: { estado: "Reservado" },
  });
  await prisma.estado_inmueble.create({
    data: { estado: "En mantenimiento" },
  });

  // Crear categorías de inmueble
  console.log("🏘️ Creando categorías de inmueble...");
  const catCasa = await prisma.categoria_inmueble.create({
    data: { categoria: "Casa" },
  });
  const catDepto = await prisma.categoria_inmueble.create({
    data: { categoria: "Departamento" },
  });
  const catTerreno = await prisma.categoria_inmueble.create({
    data: { categoria: "Terreno" },
  });
  const catComercial = await prisma.categoria_inmueble.create({
    data: { categoria: "Comercial" },
  });
  const catOficina = await prisma.categoria_inmueble.create({
    data: { categoria: "Oficina" },
  });

  // Crear personas
  console.log("👤 Creando personas...");
  const personas = await Promise.all([
  prisma.persona.create({
      data: {
        nombre: "Ana",
        apellido: "García",
        correo: "ana.garcia@ejemplo.com",
        telefono: "123456789",
        direccion: "Calle Principal 123",
        dni: 12345678,
        fecha_nacimiento: new Date("1985-03-15"),
        eliminado: false,
      },
    }),
    prisma.persona.create({
      data: {
        nombre: "Carlos",
        apellido: "López",
        correo: "carlos.lopez@ejemplo.com",
        telefono: "987654321",
        direccion: "Avenida Central 456",
        dni: 87654321,
        fecha_nacimiento: new Date("1990-07-22"),
        eliminado: false,
      },
    }),
    prisma.persona.create({
      data: {
        nombre: "María",
        apellido: "Rodríguez",
        correo: "maria.rodriguez@ejemplo.com",
        telefono: "555555555",
        direccion: "Plaza Mayor 789",
        dni: 55555555,
        fecha_nacimiento: new Date("1988-11-08"),
        eliminado: false,
      },
    }),
    prisma.persona.create({
      data: {
        nombre: "Juan",
        apellido: "Martínez",
        correo: "juan.martinez@ejemplo.com",
        telefono: "111111111",
        direccion: "Calle Secundaria 321",
        dni: 11111111,
        fecha_nacimiento: new Date("1992-05-30"),
        eliminado: false,
      },
    }),
  ]);

  // Crear empleados
  console.log("👷 Creando empleados...");
  const empleados = await Promise.all([
    prisma.empleado.create({
      data: {
        cuit: "20-12345678-9",
        fecha_ingreso: new Date("2024-01-01"),
        tipo_id: tipoAdmin.id, // administrador
        eliminado: false,
      },
    }),
    prisma.empleado.create({
      data: {
        cuit: "20-87654321-0",
        fecha_ingreso: new Date("2024-02-01"),
        tipo_id: tipoAgente.id, // agente
        eliminado: false,
      },
    }),
    prisma.empleado.create({
      data: {
        cuit: "20-55555555-1",
        fecha_ingreso: new Date("2024-03-01"),
        tipo_id: tipoAgente.id, // agente
        eliminado: false,
      },
    }),
    prisma.empleado.create({
      data: {
        cuit: "20-11111111-2",
        fecha_ingreso: new Date("2024-04-01"),
        tipo_id: tipoAgente.id, // agente
        eliminado: false,
      },
    }),
  ]);

  // Crear relaciones persona-empleado
  console.log("🔗 Creando relaciones persona-empleado...");
  for (let i = 0; i < personas.length; i++) {
    await prisma.persona_empleado.create({
      data: {
        persona_id: personas[i].id,
        empleado_id: empleados[i].id,
        eliminado: false,
      },
    });
  }

  // Crear usuarios con contraseñas hasheadas
  console.log("👤 Creando usuarios...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.usuario.create({
    data: {
      rol_id: adminRole.id,
      contrasena: hashedPassword,
      persona_id: personas[0].id,
      eliminado: false,
    },
  });
  for (let i = 1; i < personas.length; i++) {
  await prisma.usuario.create({
      data: {
        rol_id: agenteRole.id,
        contrasena: hashedPassword,
        persona_id: personas[i].id,
        eliminado: false,
      },
    });
  }

  // Crear localidades
  console.log("🌍 Creando localidades...");
  const localidadBuenosAires = await prisma.localidad.create({ data: { nombre: "Buenos Aires" } });
  const localidadSanIsidro = await prisma.localidad.create({ data: { nombre: "San Isidro" } });
  const localidadRosario = await prisma.localidad.create({ data: { nombre: "Rosario" } });
  const localidadTigre = await prisma.localidad.create({ data: { nombre: "Tigre" } });
  await prisma.localidad.create({ data: { nombre: "Córdoba" } });
  await prisma.localidad.create({ data: { nombre: "La Plata" } });
  await prisma.localidad.create({ data: { nombre: "Mar del Plata" } });
  await prisma.localidad.create({ data: { nombre: "Mendoza" } });
  await prisma.localidad.create({ data: { nombre: "Salta" } });
  await prisma.localidad.create({ data: { nombre: "Santa Fe" } });

  // Crear zonas
  console.log("🗺️ Creando zonas...");
  const zonaCentroBA = await prisma.zona.create({
    data: { nombre: "Centro", localidad_id: localidadBuenosAires.id }
  });
  const zonaNorteBA = await prisma.zona.create({
    data: { nombre: "Norte", localidad_id: localidadBuenosAires.id }
  });
  const zonaSurBA = await prisma.zona.create({
    data: { nombre: "Sur", localidad_id: localidadBuenosAires.id }
  });
  const zonaCentroSI = await prisma.zona.create({
    data: { nombre: "Centro", localidad_id: localidadSanIsidro.id }
  });
  const zonaCentroRos = await prisma.zona.create({
    data: { nombre: "Centro", localidad_id: localidadRosario.id }
  });
  const zonaNorteTigre = await prisma.zona.create({
    data: { nombre: "Norte", localidad_id: localidadTigre.id }
  });

  // Crear barrios
  console.log("🏘️ Creando barrios...");
  const barrioPalermo = await prisma.barrio.create({
    data: { nombre: "Palermo", localidad_id: localidadBuenosAires.id }
  });
  const barrioMicrocentro = await prisma.barrio.create({
    data: { nombre: "Microcentro", localidad_id: localidadBuenosAires.id }
  });
  const barrioRecoleta = await prisma.barrio.create({
    data: { nombre: "Recoleta", localidad_id: localidadBuenosAires.id }
  });
  const barrioPuertoMadero = await prisma.barrio.create({
    data: { nombre: "Puerto Madero", localidad_id: localidadBuenosAires.id }
  });
  const barrioBelgrano = await prisma.barrio.create({
    data: { nombre: "Belgrano", localidad_id: localidadBuenosAires.id }
  });
  const barrioCaballito = await prisma.barrio.create({
    data: { nombre: "Caballito", localidad_id: localidadBuenosAires.id }
  });
  const barrioSanTelmo = await prisma.barrio.create({
    data: { nombre: "San Telmo", localidad_id: localidadBuenosAires.id }
  });
  const barrioSanIsidro = await prisma.barrio.create({
    data: { nombre: "San Isidro", localidad_id: localidadSanIsidro.id }
  });
  const barrioCentroRos = await prisma.barrio.create({
    data: { nombre: "Centro", localidad_id: localidadRosario.id }
  });
  const barrioRioParana = await prisma.barrio.create({
    data: { nombre: "Río Paraná", localidad_id: localidadRosario.id }
  });
  const barrioDelta = await prisma.barrio.create({
    data: { nombre: "Delta", localidad_id: localidadTigre.id }
  });

  // Crear inmuebles de ejemplo
  console.log("🏠 Creando inmuebles de ejemplo...");
  const inmuebles = await Promise.all([
  prisma.inmueble.create({
      data: {
        categoria_id: catCasa.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaCentroBA.id,
        barrio_id: barrioPalermo.id,
        direccion: "Av. Santa Fe 1234",
        dormitorios: "3",
        banos: "2",
        superficie: "120.5",
        cochera: true,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Casa moderna en Palermo",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catDepto.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaCentroBA.id,
        barrio_id: barrioMicrocentro.id,
        direccion: "Florida 567",
        dormitorios: "2",
        banos: "1",
        superficie: "65.0",
        cochera: false,
        estado_id: statusAlquilado.id,
        eliminado: false,
        descripcion: "Departamento céntrico",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catCasa.id,
        localidad_id: localidadSanIsidro.id,
        zona_id: zonaCentroSI.id,
        barrio_id: barrioSanIsidro.id,
        direccion: "Camino Real 890",
        dormitorios: "4",
        banos: "3",
        superficie: "250.0",
        cochera: true,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Casa quinta en San Isidro",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catComercial.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaCentroBA.id,
        barrio_id: barrioRecoleta.id,
        direccion: "Av. Alvear 456",
        dormitorios: "0",
        banos: "1",
        superficie: "80.0",
        cochera: false,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Local comercial en Recoleta",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catDepto.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaCentroBA.id,
        barrio_id: barrioPuertoMadero.id,
        direccion: "Juana Manso 123",
        dormitorios: "5",
        banos: "4",
        superficie: "350.0",
        cochera: true,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Penthouse de lujo en Puerto Madero",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catOficina.id,
        localidad_id: localidadRosario.id,
        zona_id: zonaCentroRos.id,
        barrio_id: barrioCentroRos.id,
        direccion: "Córdoba 789",
        dormitorios: "0",
        banos: "1",
        superficie: "40.0",
        cochera: false,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Oficina pequeña en el centro",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catTerreno.id,
        localidad_id: localidadTigre.id,
        zona_id: zonaNorteTigre.id,
        barrio_id: barrioDelta.id,
        direccion: "Ruta 27 km 10",
        dormitorios: "0",
        banos: "0",
        superficie: "1000.0",
        cochera: false,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Terreno amplio en Tigre",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catCasa.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaNorteBA.id,
        barrio_id: barrioBelgrano.id,
        direccion: "Juramento 2345",
        dormitorios: "4",
        banos: "3",
        superficie: "180.0",
        cochera: true,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Casa clásica en Belgrano",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catOficina.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaCentroBA.id,
        barrio_id: barrioMicrocentro.id,
        direccion: "Lavalle 1000",
        dormitorios: "0",
        banos: "2",
        superficie: "90.0",
        cochera: false,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Oficina moderna en Microcentro",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catCasa.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaSurBA.id,
        barrio_id: barrioCaballito.id,
        direccion: "Av. Rivadavia 5000",
        dormitorios: "3",
        banos: "2",
        superficie: "130.0",
        cochera: true,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Casa familiar en Caballito",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catDepto.id,
        localidad_id: localidadRosario.id,
        zona_id: zonaCentroRos.id,
        barrio_id: barrioRioParana.id,
        direccion: "Av. Belgrano 200",
        dormitorios: "2",
        banos: "2",
        superficie: "75.0",
        cochera: true,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Departamento con vista al río",
      },
    }),
  prisma.inmueble.create({
      data: {
        categoria_id: catComercial.id,
        localidad_id: localidadBuenosAires.id,
        zona_id: zonaCentroBA.id,
        barrio_id: barrioSanTelmo.id,
        direccion: "Defensa 800",
        dormitorios: "0",
        banos: "1",
        superficie: "150.0",
        cochera: false,
        estado_id: statusDisponible.id,
        eliminado: false,
        descripcion: "Lote comercial en San Telmo",
      },
    }),
  ]);

  // Crear imágenes para inmuebles
  console.log("🖼️ Creando imágenes de inmuebles...");
  for (const inmueble of inmuebles) {
    await prisma.imagen_inmueble.create({
      data: {
        inmueble_id: inmueble.id,
        imagen: `/img/no-image.webp`,
      },
    });
  }

  // Crear asignaciones de inmueble-agente
  console.log("👥 Asignando agentes a inmuebles...");
  for (let i = 0; i < inmuebles.length; i++) {
    await prisma.agente_inmueble.create({
      data: {
        inmueble_id: inmuebles[i].id,
        agente_id: empleados[i % empleados.length].id,
        eliminado: false,
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
