-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(191) NOT NULL,
    `Apellidos` VARCHAR(191) NULL,
    `UserName` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `DateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_Rol` INTEGER NOT NULL,

    UNIQUE INDEX `Usuario_UserName_key`(`UserName`),
    UNIQUE INDEX `Usuario_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `id_Rol` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NOT NULL,
    `Disponibilidad` BOOLEAN NOT NULL,
    `Precio` VARCHAR(191) NOT NULL,
    `id_Categoria` INTEGER NOT NULL,
    `id_Usuario` INTEGER NOT NULL,

    UNIQUE INDEX `Productos_Nombre_key`(`Nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Categorias_Nombre_key`(`Nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_id_Rol_fkey` FOREIGN KEY (`id_Rol`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_id_Rol_fkey` FOREIGN KEY (`id_Rol`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productos` ADD CONSTRAINT `Productos_id_Categoria_fkey` FOREIGN KEY (`id_Categoria`) REFERENCES `Categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productos` ADD CONSTRAINT `Productos_id_Usuario_fkey` FOREIGN KEY (`id_Usuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
