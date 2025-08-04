import { prisma } from "@/lib/prisma";

export async function getPropertyWithImage(where: any) {
  return prisma.property.findMany({
    where: {
      ...where,
      deleted: false,
    },
    include: {
      propertyImage: {
        take: 1,
      },
    },
  });
}

export async function getAgentWithPerson(where: any) {
  return prisma.empleado.findMany({
    where: {
      ...where,
      eliminado: false,
    },
    include: {
      persona_empleado: {
        include: {
          persona: true,
        },
      },
    },
  });
}

export async function softDeleteProperty(id: number) {
  return prisma.property.update({
    where: { id },
    data: { deleted: true },
  });
}
