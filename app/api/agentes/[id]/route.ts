import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID de agente inválido" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findFirst({
      where: {
        id: id,
        deleted: false,
        typeId: "2", // Solo agentes - ahora es string
      },
      include: {
        personEmployee: {
          include: {
            person: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    const person = employee.personEmployee[0]?.person;

    if (!person) {
      return NextResponse.json(
        { error: "Información de persona no encontrada" },
        { status: 404 }
      );
    }

    // Buscar imagen de persona
    const personImage = await prisma.personImage.findFirst({
      where: { personId: person.id },
      orderBy: { id: "desc" },
    });

    // Mapear a los nombres esperados por el frontend
    const persona = {
      nombre: person.firstName,
      apellido: person.lastName,
      email: person.email,
      telefono: person.phone,
      direccion: person.address,
      dni: person.dni,
      imagen: personImage?.imagePath || null,
    };
    const empleado = {
      CUIT: employee.cuit,
      fecha_alta: employee.hireDate,
      fecha_baja: employee.terminationDate,
    };

    return NextResponse.json({ persona, empleado });
  } catch (error) {
    console.error("Error al obtener agente:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Solo administradores o el propio agente pueden editar
  const { session, error, status } = await requireAuth(request);
  if (error) return jsonError(error, status);
  const id = params.id;
  if (!id) return jsonError("ID de agente inválido", 400);
  try {
    const body = await request.json();
    const { field, value } = body;
    // Buscar el empleado y la persona asociada
    const employee = await prisma.employee.findFirst({
      where: { id, deleted: false, typeId: "2" },
      include: { personEmployee: { include: { person: true } } },
    });
    if (!employee) return jsonError("Agente no encontrado", 404);
    const person = employee.personEmployee[0]?.person;
    if (!person) return jsonError("Persona no encontrada", 404);
    // Permitir solo si admin o el propio agente
    if (
      session.user.role !== "administrador" &&
      session.user.email !== person.email
    ) {
      return jsonError("No autorizado", 403);
    }
    // Campos permitidos
    const allowedFields = [
      "nombre",
      "apellido",
      "email",
      "telefono",
      "direccion",
    ];
    if (!allowedFields.includes(field))
      return jsonError("Campo no editable", 400);
    // Mapear a campos reales
    const fieldMap: any = {
      nombre: "firstName",
      apellido: "lastName",
      email: "email",
      telefono: "phone",
      direccion: "address",
    };
    const updateData: any = {};
    updateData[fieldMap[field]] = value;
    await prisma.person.update({
      where: { id: person.id },
      data: updateData,
    });
    return jsonSuccess({ success: true });
  } catch (err: any) {
    return jsonError(err.message || "Error al actualizar", 500);
  }
}
