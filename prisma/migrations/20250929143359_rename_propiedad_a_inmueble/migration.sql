/*
  Warnings:

  - You are about to drop the column `propertyId` on the `consultas_clientes` table. All the data in the column will be lost.
  - You are about to drop the `agentes_propiedades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categorias_propiedades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estados_propiedades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imagenes_propiedades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `propiedades` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inmuebleId` to the `consultas_clientes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "agentes_propiedades" DROP CONSTRAINT "agentes_propiedades_agentId_fkey";

-- DropForeignKey
ALTER TABLE "agentes_propiedades" DROP CONSTRAINT "agentes_propiedades_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "consultas_clientes" DROP CONSTRAINT "consultas_clientes_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "imagenes_propiedades" DROP CONSTRAINT "imagenes_propiedades_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "propiedades" DROP CONSTRAINT "propiedades_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "propiedades" DROP CONSTRAINT "propiedades_localidadId_fkey";

-- DropForeignKey
ALTER TABLE "propiedades" DROP CONSTRAINT "propiedades_statusId_fkey";

-- DropForeignKey
ALTER TABLE "propiedades" DROP CONSTRAINT "propiedades_zonaId_fkey";

-- DropIndex
DROP INDEX "consultas_clientes_propertyId_idx";

-- AlterTable
ALTER TABLE "consultas_clientes" DROP COLUMN "propertyId",
ADD COLUMN     "inmuebleId" UUID NOT NULL;

-- DropTable
DROP TABLE "agentes_propiedades";

-- DropTable
DROP TABLE "categorias_propiedades";

-- DropTable
DROP TABLE "estados_propiedades";

-- DropTable
DROP TABLE "imagenes_propiedades";

-- DropTable
DROP TABLE "propiedades";

-- CreateTable
CREATE TABLE "inmuebles" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" UUID NOT NULL,
    "localidadId" UUID NOT NULL,
    "zonaId" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "numBedrooms" INTEGER NOT NULL,
    "numBathrooms" INTEGER NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL,
    "garage" BOOLEAN NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "statusId" UUID NOT NULL,

    CONSTRAINT "inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_inmuebles" (
    "id" UUID NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "estados_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_inmuebles" (
    "id" UUID NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "categorias_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_inmuebles" (
    "id" UUID NOT NULL,
    "inmuebleId" UUID NOT NULL,
    "imagePath" TEXT,

    CONSTRAINT "imagenes_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agentes_inmuebles" (
    "id" UUID NOT NULL,
    "inmuebleId" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "agentes_inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inmuebles_statusId_idx" ON "inmuebles"("statusId");

-- CreateIndex
CREATE INDEX "inmuebles_categoryId_idx" ON "inmuebles"("categoryId");

-- CreateIndex
CREATE INDEX "inmuebles_localidadId_idx" ON "inmuebles"("localidadId");

-- CreateIndex
CREATE INDEX "inmuebles_zonaId_idx" ON "inmuebles"("zonaId");

-- CreateIndex
CREATE INDEX "imagenes_inmuebles_inmuebleId_idx" ON "imagenes_inmuebles"("inmuebleId");

-- CreateIndex
CREATE INDEX "agentes_inmuebles_agentId_idx" ON "agentes_inmuebles"("agentId");

-- CreateIndex
CREATE INDEX "agentes_inmuebles_inmuebleId_idx" ON "agentes_inmuebles"("inmuebleId");

-- CreateIndex
CREATE INDEX "consultas_clientes_inmuebleId_idx" ON "consultas_clientes"("inmuebleId");

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorias_inmuebles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "estados_inmuebles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zona"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_inmuebles" ADD CONSTRAINT "imagenes_inmuebles_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "inmuebles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agentes_inmuebles" ADD CONSTRAINT "agentes_inmuebles_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "inmuebles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agentes_inmuebles" ADD CONSTRAINT "agentes_inmuebles_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "empleados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultas_clientes" ADD CONSTRAINT "consultas_clientes_inmuebleId_fkey" FOREIGN KEY ("inmuebleId") REFERENCES "inmuebles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
