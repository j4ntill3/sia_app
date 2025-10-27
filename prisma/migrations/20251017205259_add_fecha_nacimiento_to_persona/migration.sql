/*
  Warnings:

  - You are about to drop the column `neighborhood` on the `inmuebles` table. All the data in the column will be lost.
  - Added the required column `barrioId` to the `inmuebles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localidad_id` to the `zona` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imagenes_inmuebles" ALTER COLUMN "isPrincipal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inmuebles" DROP COLUMN "neighborhood",
ADD COLUMN     "barrioId" UUID NOT NULL,
ALTER COLUMN "numBedrooms" SET DATA TYPE TEXT,
ALTER COLUMN "numBathrooms" SET DATA TYPE TEXT,
ALTER COLUMN "surface" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "persona" ADD COLUMN     "fecha_nacimiento" DATE;

-- AlterTable
ALTER TABLE "zona" ADD COLUMN     "localidad_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "barrio" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "localidad_id" UUID NOT NULL,

    CONSTRAINT "barrio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "barrio_localidad_id_idx" ON "barrio"("localidad_id");

-- CreateIndex
CREATE INDEX "inmuebles_barrioId_idx" ON "inmuebles"("barrioId");

-- CreateIndex
CREATE INDEX "zona_localidad_id_idx" ON "zona"("localidad_id");

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_barrioId_fkey" FOREIGN KEY ("barrioId") REFERENCES "barrio"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zona" ADD CONSTRAINT "zona_localidad_id_fkey" FOREIGN KEY ("localidad_id") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barrio" ADD CONSTRAINT "barrio_localidad_id_fkey" FOREIGN KEY ("localidad_id") REFERENCES "localidad"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
