-- Renombrar columnas de la tabla inmuebles
ALTER TABLE "inmuebles" RENAME COLUMN "categoryId" TO "categoria_id";
ALTER TABLE "inmuebles" RENAME COLUMN "localidadId" TO "localidad_id";
ALTER TABLE "inmuebles" RENAME COLUMN "zonaId" TO "zona_id";
ALTER TABLE "inmuebles" RENAME COLUMN "barrioId" TO "barrio_id";
ALTER TABLE "inmuebles" RENAME COLUMN "address" TO "direccion";
ALTER TABLE "inmuebles" RENAME COLUMN "numBedrooms" TO "dormitorios";
ALTER TABLE "inmuebles" RENAME COLUMN "numBathrooms" TO "banos";
ALTER TABLE "inmuebles" RENAME COLUMN "surface" TO "superficie";
ALTER TABLE "inmuebles" RENAME COLUMN "garage" TO "cochera";
ALTER TABLE "inmuebles" RENAME COLUMN "deleted" TO "eliminado";
ALTER TABLE "inmuebles" RENAME COLUMN "statusId" TO "estado_id";

-- Renombrar columnas de la tabla empleados
ALTER TABLE "empleados" RENAME COLUMN "hireDate" TO "fecha_ingreso";
ALTER TABLE "empleados" RENAME COLUMN "terminationDate" TO "fecha_egreso";
ALTER TABLE "empleados" RENAME COLUMN "typeId" TO "tipo_id";
ALTER TABLE "empleados" RENAME COLUMN "deleted" TO "eliminado";

-- Renombrar columnas de la tabla tipos_empleados
ALTER TABLE "tipos_empleados" RENAME COLUMN "type" TO "tipo";

-- Renombrar columnas de la tabla personas_empleados
ALTER TABLE "personas_empleados" RENAME COLUMN "personId" TO "persona_id";
ALTER TABLE "personas_empleados" RENAME COLUMN "employeeId" TO "empleado_id";
ALTER TABLE "personas_empleados" RENAME COLUMN "createdAt" TO "creado_en";
ALTER TABLE "personas_empleados" RENAME COLUMN "deleted" TO "eliminado";

-- Renombrar columnas de la tabla imagenes_inmuebles
ALTER TABLE "imagenes_inmuebles" RENAME COLUMN "inmuebleId" TO "inmueble_id";
ALTER TABLE "imagenes_inmuebles" RENAME COLUMN "imagePath" TO "imagen";
ALTER TABLE "imagenes_inmuebles" RENAME COLUMN "isPrincipal" TO "es_principal";

-- Renombrar columnas de la tabla agentes_inmuebles
ALTER TABLE "agentes_inmuebles" RENAME COLUMN "inmuebleId" TO "inmueble_id";
ALTER TABLE "agentes_inmuebles" RENAME COLUMN "agentId" TO "agente_id";
ALTER TABLE "agentes_inmuebles" RENAME COLUMN "deleted" TO "eliminado";

-- Renombrar columnas de la tabla consultas_clientes
ALTER TABLE "consultas_clientes" RENAME COLUMN "agentId" TO "agente_id";
ALTER TABLE "consultas_clientes" RENAME COLUMN "firstName" TO "nombre";
ALTER TABLE "consultas_clientes" RENAME COLUMN "lastName" TO "apellido";
ALTER TABLE "consultas_clientes" RENAME COLUMN "phone" TO "telefono";
ALTER TABLE "consultas_clientes" RENAME COLUMN "email" TO "correo";
ALTER TABLE "consultas_clientes" RENAME COLUMN "date" TO "fecha";
ALTER TABLE "consultas_clientes" RENAME COLUMN "description" TO "descripcion";
ALTER TABLE "consultas_clientes" RENAME COLUMN "inmuebleId" TO "inmueble_id";

-- Renombrar columnas de la tabla imagenes_personas
ALTER TABLE "imagenes_personas" RENAME COLUMN "personId" TO "persona_id";
ALTER TABLE "imagenes_personas" RENAME COLUMN "imagePath" TO "imagen";
