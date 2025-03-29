/*
  Warnings:

  - You are about to drop the column `VARBINARY(255)` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `Image` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `VARBINARY(255)`,
    ADD COLUMN `Image` LONGBLOB NOT NULL;
