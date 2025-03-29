-- DropForeignKey
ALTER TABLE `productos` DROP FOREIGN KEY `Productos_id_Usuario_fkey`;

-- AddForeignKey
ALTER TABLE `Productos` ADD CONSTRAINT `Productos_id_Usuario_fkey` FOREIGN KEY (`id_Usuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
