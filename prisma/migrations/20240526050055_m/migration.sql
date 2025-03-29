/*
  Warnings:

  - You are about to alter the column `Imagen` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarBinary(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `usuario` MODIFY `Imagen` VARCHAR(191) NOT NULL;
