/*
  Warnings:

  - Added the required column `Image` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productos` ADD COLUMN `Image` LONGBLOB NOT NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `Apellidos` VARCHAR(191) NULL;
