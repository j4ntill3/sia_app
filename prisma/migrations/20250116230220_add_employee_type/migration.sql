-- CreateTable
CREATE TABLE `EmpleadoTipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EmpleadoTipo_tipo_key`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empleado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `CUIT` VARCHAR(20) NOT NULL,
    `Fecha_Alta` DATE NOT NULL,
    `Fecha_Baja` DATE NULL,
    `tipoId` INTEGER NOT NULL,
    `eliminado` BOOLEAN NOT NULL,

    UNIQUE INDEX `CUIT`(`CUIT`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inmueble` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `id_rubro` INTEGER NOT NULL,
    `localidad` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `barrio` VARCHAR(191) NOT NULL,
    `num_habitaciones` INTEGER NOT NULL,
    `num_baños` INTEGER NOT NULL,
    `superficie` DOUBLE NOT NULL,
    `garaje` BOOLEAN NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `eliminado` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `persona` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telefono` VARCHAR(191) NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nombre` VARCHAR(191) NOT NULL,
    `DNI` INTEGER NULL,
    `eliminado` BOOLEAN NOT NULL,

    UNIQUE INDEX `Persona_email_key`(`email`),
    UNIQUE INDEX `DNI`(`DNI`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rolusuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_rol` VARCHAR(191) NOT NULL,
    `eliminado` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `eliminado` BOOLEAN NOT NULL,

    INDEX `Sesion_id_usuario_fkey`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_rol` INTEGER NOT NULL,
    `clave` VARCHAR(191) NOT NULL,
    `id_persona` INTEGER NOT NULL,
    `eliminado` BOOLEAN NOT NULL,

    INDEX `Usuario_id_persona_fkey`(`id_persona`),
    INDEX `Usuario_id_rol_fkey`(`id_rol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Empleado` ADD CONSTRAINT `Empleado_tipoId_fkey` FOREIGN KEY (`tipoId`) REFERENCES `EmpleadoTipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesion` ADD CONSTRAINT `Sesion_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `Usuario_id_persona_fkey` FOREIGN KEY (`id_persona`) REFERENCES `persona`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `Usuario_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `rolusuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
