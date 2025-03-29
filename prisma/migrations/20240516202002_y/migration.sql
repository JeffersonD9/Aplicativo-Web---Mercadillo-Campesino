/*
  Warnings:

  - You are about to drop the column `id_Admin` on the `catalogos` table. All the data in the column will be lost.
  - You are about to drop the column `id_Admin` on the `categorias` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `catalogos` DROP FOREIGN KEY `Catalogos_id_Admin_fkey`;

-- DropForeignKey
ALTER TABLE `categorias` DROP FOREIGN KEY `Categorias_id_Admin_fkey`;

-- AlterTable
ALTER TABLE `catalogos` DROP COLUMN `id_Admin`;

-- AlterTable
ALTER TABLE `categorias` DROP COLUMN `id_Admin`;
