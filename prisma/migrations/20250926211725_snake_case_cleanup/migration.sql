/*
  Warnings:

  - You are about to drop the `Persona` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolUsuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_persona_id_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_rol_id_fkey";

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "imagenes_personas" DROP CONSTRAINT "imagenes_personas_personId_fkey";

-- DropForeignKey
ALTER TABLE "personas_empleados" DROP CONSTRAINT "personas_empleados_personId_fkey";

-- DropTable
DROP TABLE "Persona";

-- DropTable
DROP TABLE "RolUsuario";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "persona" (
    "id" UUID NOT NULL,
    "telefono" TEXT,
    "apellido" TEXT NOT NULL,
    "direccion" TEXT,
    "correo" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "dni" INTEGER,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "rol_id" UUID NOT NULL,
    "contrasena" TEXT NOT NULL,
    "persona_id" UUID NOT NULL,
    "eliminado" BOOLEAN NOT NULL,
    "correo_verificado" TIMESTAMP,
    "creado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_usuario" (
    "id" UUID NOT NULL,
    "tipo_rol" TEXT NOT NULL,
    "eliminado" BOOLEAN NOT NULL,

    CONSTRAINT "rol_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persona_correo_key" ON "persona"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "persona_dni_key" ON "persona"("dni");

-- CreateIndex
CREATE INDEX "session_usuario_id_idx" ON "session"("usuario_id");

-- CreateIndex
CREATE INDEX "usuario_persona_id_idx" ON "usuario"("persona_id");

-- CreateIndex
CREATE INDEX "usuario_rol_id_idx" ON "usuario"("rol_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personas_empleados" ADD CONSTRAINT "personas_empleados_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenes_personas" ADD CONSTRAINT "imagenes_personas_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persona"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
