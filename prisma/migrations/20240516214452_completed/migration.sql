/*
  Warnings:

  - You are about to alter the column `Email` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `UserName` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `celular` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `Nombre` on the `catalogos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Descripcion` on the `catalogos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `Nombre` on the `categorias` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `Image` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `Telefono` on the `productos` table. All the data in the column will be lost.
  - You are about to alter the column `Nombre` on the `productos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Precio` on the `productos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `Presentacion` on the `productos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Nombre` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `Image` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `Telefono` on the `usuario` table. All the data in the column will be lost.
  - You are about to alter the column `Nombres` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `UserName` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Email` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `Celular` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `Imagen` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarBinary(255)`.
  - A unique constraint covering the columns `[UserName]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Imagen` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Made the column `Apellidos` on table `usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `Email` VARCHAR(100) NOT NULL,
    MODIFY `Password` VARCHAR(200) NOT NULL,
    MODIFY `UserName` VARCHAR(50) NOT NULL,
    MODIFY `celular` VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE `catalogos` MODIFY `Nombre` VARCHAR(50) NOT NULL,
    MODIFY `Descripcion` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `categorias` MODIFY `Nombre` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `productos` DROP COLUMN `Image`,
    DROP COLUMN `Telefono`,
    ADD COLUMN `Imagen` VARBINARY(255) NOT NULL,
    MODIFY `Nombre` VARCHAR(50) NOT NULL,
    MODIFY `Descripcion` VARCHAR(200) NOT NULL,
    MODIFY `Precio` VARCHAR(20) NOT NULL,
    MODIFY `Presentacion` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `Nombre` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `Image`,
    DROP COLUMN `Telefono`,
    MODIFY `Nombres` VARCHAR(50) NOT NULL,
    MODIFY `Apellidos` VARCHAR(50) NOT NULL,
    MODIFY `UserName` VARCHAR(50) NOT NULL,
    MODIFY `Password` VARCHAR(200) NOT NULL,
    MODIFY `Email` VARCHAR(100) NOT NULL,
    MODIFY `Celular` VARCHAR(10) NOT NULL,
    MODIFY `Imagen` VARBINARY(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_UserName_key` ON `Admin`(`UserName`);
