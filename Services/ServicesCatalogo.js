import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function SearchCatalogo(catalogo) {

  const buscarCatalogo = await prisma.catalogos.findUnique({
    where: {
      Nombre: catalogo,
    },
  });

  
  return buscarCatalogo
}