/*
  Warnings:

  - Added the required column `celular` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Presentacion` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Made the column `Descripcion` on table `productos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `Celular` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Made the column `Apellidos` on table `usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `celular` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `catalogos` MODIFY `Descripcion` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `productos` ADD COLUMN `Presentacion` VARCHAR(191) NOT NULL,
    MODIFY `Descripcion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `Celular` VARCHAR(191) NOT NULL,
    MODIFY `Apellidos` VARCHAR(191) NOT NULL;
