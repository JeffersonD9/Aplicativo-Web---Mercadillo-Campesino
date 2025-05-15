/*
  Warnings:

  - You are about to drop the column `Id_vendedor` on the `productospersonalizados` table. All the data in the column will be lost.
  - Added the required column `Categoria` to the `productospersonalizados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id_Usuario` to the `productospersonalizados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Puesto` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `productospersonalizados` DROP FOREIGN KEY `ProductosPersonalizados_Id_vendedor_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_Id_Mercadillo_fkey`;

-- AlterTable
ALTER TABLE `productospersonalizados` DROP COLUMN `Id_vendedor`,
    ADD COLUMN `Categoria` VARCHAR(50) NOT NULL,
    ADD COLUMN `Id_Usuario` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `Puesto` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `productospersonalizados` ADD CONSTRAINT `productospersonalizados_Id_Usuario_fkey` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_Id_Mercadillo_fkey` FOREIGN KEY (`Id_Mercadillo`) REFERENCES `mercadillo`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
