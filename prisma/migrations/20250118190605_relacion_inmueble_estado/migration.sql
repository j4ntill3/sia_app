/*
  Warnings:

  - You are about to drop the column `estado` on the `inmueble` table. All the data in the column will be lost.
  - You are about to drop the `empleadotipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rolusuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `empleado` DROP FOREIGN KEY `Empleado_tipoId_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_id_rol_fkey`;

-- AlterTable
ALTER TABLE `inmueble` DROP COLUMN `estado`,
    ADD COLUMN `id_estado` INTEGER NULL;

-- DropTable
DROP TABLE `empleadotipo`;

-- DropTable
DROP TABLE `rolusuario`;

-- CreateTable
CREATE TABLE `empleado_tipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EmpleadoTipo_tipo_key`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `persona_empleado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idpersona` INTEGER NOT NULL,
    `idempleado` INTEGER NOT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `eliminado` BOOLEAN NOT NULL DEFAULT false,

    INDEX `fk_idempleado`(`idempleado`),
    INDEX `fk_idpersona`(`idpersona`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_rol` VARCHAR(191) NOT NULL,
    `eliminado` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inmueble_estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fk_inmueble_estado` ON `inmueble`(`id_estado`);

-- AddForeignKey
ALTER TABLE `inmueble` ADD CONSTRAINT `inmueble_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `inmueble_estado`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `Usuario_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `rol_usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empleado` ADD CONSTRAINT `Empleado_tipoId_fkey` FOREIGN KEY (`tipoId`) REFERENCES `empleado_tipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `persona_empleado` ADD CONSTRAINT `fk_idempleado` FOREIGN KEY (`idempleado`) REFERENCES `empleado`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `persona_empleado` ADD CONSTRAINT `fk_idpersona` FOREIGN KEY (`idpersona`) REFERENCES `persona`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
