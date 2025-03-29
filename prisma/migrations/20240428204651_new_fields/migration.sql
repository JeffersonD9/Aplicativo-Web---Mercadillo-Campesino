/*
  Warnings:

  - Added the required column `Telefono` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Image` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productos` ADD COLUMN `Telefono` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `Image` LONGBLOB NOT NULL;
