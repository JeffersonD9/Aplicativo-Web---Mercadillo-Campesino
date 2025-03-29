/*
  Warnings:

  - Added the required column `id_Admin` to the `Catalogos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_Admin` to the `Categorias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `catalogos` ADD COLUMN `id_Admin` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `categorias` ADD COLUMN `id_Admin` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Catalogos` ADD CONSTRAINT `Catalogos_id_Admin_fkey` FOREIGN KEY (`id_Admin`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorias` ADD CONSTRAINT `Categorias_id_Admin_fkey` FOREIGN KEY (`id_Admin`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
