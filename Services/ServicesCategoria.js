import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function SearchCategoria(categoria,idCatalogo) {

  const buscarCategoria = await prisma.categorias.findUnique({
    where: {
      Nombre: categoria,
      id_Cat: idCatalogo,
    },
  });

  return buscarCategoria
}