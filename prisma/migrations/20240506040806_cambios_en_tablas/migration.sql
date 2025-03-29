/*
  Warnings:

  - You are about to drop the column `id_Cat` on the `catalogo` table. All the data in the column will be lost.
  - You are about to drop the column `id_Catagolo` on the `productos` table. All the data in the column will be lost.
  - Added the required column `id_Cat` to the `Categorias` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `catalogo` DROP FOREIGN KEY `Catalogo_id_Cat_fkey`;

-- DropForeignKey
ALTER TABLE `productos` DROP FOREIGN KEY `Productos_id_Catagolo_fkey`;

-- AlterTable
ALTER TABLE `catalogo` DROP COLUMN `id_Cat`;

-- AlterTable
ALTER TABLE `categorias` ADD COLUMN `id_Cat` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `productos` DROP COLUMN `id_Catagolo`;

-- AddForeignKey
ALTER TABLE `Categorias` ADD CONSTRAINT `Categorias_id_Cat_fkey` FOREIGN KEY (`id_Cat`) REFERENCES `Catalogo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
