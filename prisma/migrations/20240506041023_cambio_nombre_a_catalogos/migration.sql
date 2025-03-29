/*
  Warnings:

  - You are about to drop the `catalogo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `categorias` DROP FOREIGN KEY `Categorias_id_Cat_fkey`;

-- DropTable
DROP TABLE `catalogo`;

-- CreateTable
CREATE TABLE `Catalogos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Categorias` ADD CONSTRAINT `Categorias_id_Cat_fkey` FOREIGN KEY (`id_Cat`) REFERENCES `Catalogos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
