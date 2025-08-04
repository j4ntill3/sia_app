import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";
import { agentSchema } from "@/lib/validation";
import type { Employee, Person } from "@/types/empleado";

export async function GET(request: NextRequest) {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        typeId: "2",
        deleted: false,
      },
      include: {
        personEmployee: {
          include: {
            person: true,
          },
        },
      },
    });

    // Mapear a tipo Employee y Person
    const agentesConPersona: {
      empleado: Employee;
      persona: Person | undefined;
    }[] = employees.map((employee) => {
      const personDb = employee.personEmployee[0]?.person;
      const persona: Person | undefined = personDb
        ? {
            id: personDb.id,
            firstName: personDb.firstName,
            lastName: personDb.lastName,
            email: personDb.email,
            phone: personDb.phone || undefined,
            address: personDb.address || undefined,
            dni: personDb.dni || undefined,
            deleted: personDb.deleted,
            createdAt: personDb.createdAt,
          }
        : undefined;
      const empleadoResult: Employee = {
        id: employee.id,
        cuit: employee.cuit,
        hireDate: employee.hireDate,
        terminationDate: employee.terminationDate || undefined,
        typeId: employee.typeId,
        deleted: employee.deleted,
        personEmployee: undefined,
      };
      return { empleado: empleadoResult, persona };
    });

    return jsonSuccess(agentesConPersona);
  } catch (error) {
    console.error("Error al obtener agentes:", error);
    return jsonError("Error al obtener agentes", 500);
  }
}

export async function POST(request: NextRequest) {
  // Solo administradores pueden crear agentes
  const { session, error, status } = await requireAuth(
    request,
    "administrador"
  );
  if (error) return jsonError(error, status);

  try {
    const body = await request.json();
    // Validar datos con zod
    const parse = agentSchema.safeParse({
      ...body,
      tipoId: body.tipoId,
      DNI: Number(body.DNI),
    });
    if (!parse.success) {
      return jsonError(
        "Datos inválidos: " + JSON.stringify(parse.error.flatten().fieldErrors),
        400
      );
    }
    const data = parse.data;

    // 1. Crear la persona
    const person = await prisma.person.create({
      data: {
        firstName: data.nombre,
        lastName: data.apellido,
        phone: data.telefono,
        email: data.email,
        dni: data.DNI,
        address: data.direccion,
        deleted: false,
      },
    });

    // 2. Crear el empleado
    const employee = await prisma.employee.create({
      data: {
        cuit: data.cuit,
        hireDate: new Date(data.fechaAlta + "T00:00:00Z"),
        terminationDate: data.fechaBaja
          ? new Date(data.fechaBaja + "T00:00:00Z")
          : null,
        typeId: "2", // Tipo agente
        deleted: false,
      },
    });

    // 3. Crear la relación personEmployee
    await prisma.personEmployee.create({
      data: {
        personId: person.id,
        employeeId: employee.id,
        deleted: false,
      },
    });

    // 4. Crear el usuario con contraseña hasheada
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    await prisma.user.create({
      data: {
        roleId: "2",
        password: hashedPassword,
        personId: person.id,
        deleted: false,
      },
    });

    // Mapear a tipo Employee y Person
    const personaResult: Person = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phone: person.phone || undefined,
      address: person.address || undefined,
      dni: person.dni || undefined,
      deleted: person.deleted,
      createdAt: person.createdAt,
    };
    const empleadoResult: Employee = {
      id: employee.id,
      cuit: employee.cuit,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate || undefined,
      typeId: employee.typeId,
      deleted: employee.deleted,
      personEmployee: undefined,
    };

    return jsonSuccess(
      {
        success: true,
        message: "Agente creado exitosamente",
        empleado: empleadoResult,
        persona: personaResult,
      },
      201
    );
  } catch (error) {
    console.error("Error al crear agente:", error);
    return jsonError(
      "Error al crear agente: " +
        (error instanceof Error ? error.message : "Error desconocido"),
      500
    );
  }
}
