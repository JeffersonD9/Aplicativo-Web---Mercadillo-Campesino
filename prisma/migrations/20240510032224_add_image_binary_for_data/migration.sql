/*
  Warnings:

  - You are about to drop the column `Image` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `Image` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `VARBINARY(255)` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `VARBINARY(255)` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productos` DROP COLUMN `Image`,
    ADD COLUMN `VARBINARY(255)` LONGBLOB NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `Image`,
    ADD COLUMN `VARBINARY(255)` LONGBLOB NOT NULL;
