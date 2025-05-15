/*
  Warnings:

  - You are about to drop the column `Categoria` on the `productospersonalizados` table. All the data in the column will be lost.
  - You are about to drop the column `Nombre` on the `productospersonalizados` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Puesto,Id_Mercadillo]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `NombreCategoria` to the `productospersonalizados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NombreProducto` to the `productospersonalizados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Cedula` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mercadillo` MODIFY `Direccion` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `productospersonalizados` DROP COLUMN `Categoria`,
    DROP COLUMN `Nombre`,
    ADD COLUMN `Estado` BOOLEAN NULL,
    ADD COLUMN `NombreCategoria` VARCHAR(50) NOT NULL,
    ADD COLUMN `NombreProducto` VARCHAR(50) NOT NULL,
    MODIFY `Descripcion` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `Cedula` VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuario_Puesto_Id_Mercadillo_key` ON `usuario`(`Puesto`, `Id_Mercadillo`);
