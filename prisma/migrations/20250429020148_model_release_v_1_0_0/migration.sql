/*
  Warnings:

  - The primary key for the `mercadillo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `mercadillo` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productosasignadosusuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendedor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Id` to the `Mercadillo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_id_Rol_fkey`;

-- DropForeignKey
ALTER TABLE `productosasignadosusuario` DROP FOREIGN KEY `ProductosAsignadosUsuario_id_vendedor_fkey`;

-- DropForeignKey
ALTER TABLE `vendedor` DROP FOREIGN KEY `Vendedor_id_Mercadillo_fkey`;

-- DropForeignKey
ALTER TABLE `vendedor` DROP FOREIGN KEY `Vendedor_id_Rol_fkey`;

-- AlterTable
ALTER TABLE `mercadillo` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Id`);

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `productosasignadosusuario`;

-- DropTable
DROP TABLE `roles`;

-- DropTable
DROP TABLE `vendedor`;

-- CreateTable
CREATE TABLE `ProductosPersonalizados` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Id_vendedor` INTEGER NOT NULL,
    `Id_producto` INTEGER NOT NULL,
    `Nombre` VARCHAR(50) NOT NULL,
    `Descripcion` VARCHAR(50) NOT NULL,
    `Imagen` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(50) NOT NULL,
    `Apellidos` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(200) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `Celular` VARCHAR(10) NOT NULL,
    `Roles` INTEGER NOT NULL DEFAULT 1,
    `Estado` BOOLEAN NOT NULL,
    `Id_Mercadillo` INTEGER NULL,

    UNIQUE INDEX `Usuario_Email_key`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductosPersonalizados` ADD CONSTRAINT `ProductosPersonalizados_Id_vendedor_fkey` FOREIGN KEY (`Id_vendedor`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_Id_Mercadillo_fkey` FOREIGN KEY (`Id_Mercadillo`) REFERENCES `Mercadillo`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
