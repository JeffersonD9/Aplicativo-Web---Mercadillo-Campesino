/*
  Warnings:

  - You are about to alter the column `Image` on the `productos` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarBinary(255)`.
  - You are about to alter the column `Image` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarBinary(255)`.

*/
-- AlterTable
ALTER TABLE `productos` MODIFY `Image` VARBINARY(255) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `Image` VARBINARY(255) NOT NULL;
