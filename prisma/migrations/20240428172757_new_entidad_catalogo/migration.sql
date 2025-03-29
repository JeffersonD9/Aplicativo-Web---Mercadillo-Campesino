/*
  Warnings:

  - Added the required column `UserName` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_Catagolo` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `UserName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `productos` ADD COLUMN `id_Catagolo` INTEGER NOT NULL,
    MODIFY `Descripcion` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Catalogo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NOT NULL,
    `id_Cat` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Catalogo` ADD CONSTRAINT `Catalogo_id_Cat_fkey` FOREIGN KEY (`id_Cat`) REFERENCES `Categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productos` ADD CONSTRAINT `Productos_id_Catagolo_fkey` FOREIGN KEY (`id_Catagolo`) REFERENCES `Catalogo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
