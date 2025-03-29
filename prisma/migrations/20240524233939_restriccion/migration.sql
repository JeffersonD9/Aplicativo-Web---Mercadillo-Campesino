/*
  Warnings:

  - A unique constraint covering the columns `[Nombre]` on the table `Catalogos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Catalogos_Nombre_key` ON `Catalogos`(`Nombre`);
