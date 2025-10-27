-- AlterTable
ALTER TABLE "imagenes_inmuebles" ADD COLUMN     "isPrincipal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "inmuebles" ALTER COLUMN "descripcion" DROP NOT NULL;
