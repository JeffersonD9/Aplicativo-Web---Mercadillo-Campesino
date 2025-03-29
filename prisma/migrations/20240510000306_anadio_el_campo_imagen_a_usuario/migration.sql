/*
  Warnings:

  - Added the required column `Imagen` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `Imagen` LONGBLOB NOT NULL;
