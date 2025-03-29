/*
  Warnings:

  - You are about to drop the column `VARBINARY(255)` on the `productos` table. All the data in the column will be lost.
  - Added the required column `Image` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productos` DROP COLUMN `VARBINARY(255)`,
    ADD COLUMN `Image` VARBINARY(255) NOT NULL;
