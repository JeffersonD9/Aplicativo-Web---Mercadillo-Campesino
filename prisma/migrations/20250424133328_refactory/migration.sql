-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(100) NOT NULL,
    `UserName` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(200) NOT NULL,
    `celular` VARCHAR(10) NOT NULL,
    `id_Rol` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_Email_key`(`Email`),
    UNIQUE INDEX `Admin_UserName_key`(`UserName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mercadillo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Direccion` VARCHAR(50) NOT NULL,
    `Nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductosAsignadosUsuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_producto` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,
    `Nombre` VARCHAR(50) NOT NULL,
    `Descripcion` VARCHAR(50) NOT NULL,
    `Imagen` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(50) NOT NULL,
    `Apellidos` VARCHAR(50) NOT NULL,
    `UserName` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(200) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `Celular` VARCHAR(10) NOT NULL,
    `Imagen` VARCHAR(191) NOT NULL,
    `DateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_Rol` INTEGER NOT NULL,
    `id_Mercadillo` INTEGER NOT NULL,

    UNIQUE INDEX `Usuario_UserName_key`(`UserName`),
    UNIQUE INDEX `Usuario_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_id_Rol_fkey` FOREIGN KEY (`id_Rol`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductosAsignadosUsuario` ADD CONSTRAINT `ProductosAsignadosUsuario_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_id_Rol_fkey` FOREIGN KEY (`id_Rol`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_id_Mercadillo_fkey` FOREIGN KEY (`id_Mercadillo`) REFERENCES `Mercadillo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
