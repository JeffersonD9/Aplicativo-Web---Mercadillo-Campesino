/*
  Warnings:

  - You are about to drop the column `id_categoria` on the `productosasignadosusuario` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario` on the `productosasignadosusuario` table. All the data in the column will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_vendedor` to the `ProductosAsignadosUsuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `productosasignadosusuario` DROP FOREIGN KEY `ProductosAsignadosUsuario_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_id_Mercadillo_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_id_Rol_fkey`;

-- AlterTable
ALTER TABLE `productosasignadosusuario` DROP COLUMN `id_categoria`,
    DROP COLUMN `id_usuario`,
    ADD COLUMN `id_vendedor` INTEGER NOT NULL;

-- DropTable
DROP TABLE `usuario`;

-- CreateTable
CREATE TABLE `Vendedor` (
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

    UNIQUE INDEX `Vendedor_UserName_key`(`UserName`),
    UNIQUE INDEX `Vendedor_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductosAsignadosUsuario` ADD CONSTRAINT `ProductosAsignadosUsuario_id_vendedor_fkey` FOREIGN KEY (`id_vendedor`) REFERENCES `Vendedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vendedor` ADD CONSTRAINT `Vendedor_id_Rol_fkey` FOREIGN KEY (`id_Rol`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vendedor` ADD CONSTRAINT `Vendedor_id_Mercadillo_fkey` FOREIGN KEY (`id_Mercadillo`) REFERENCES `Mercadillo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
