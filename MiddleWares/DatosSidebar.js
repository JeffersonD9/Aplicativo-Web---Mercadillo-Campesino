import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function DatosSidebar(req,res){

    try {

        const categoriasConCatalogo = await prisma.catalogos.findMany({
            select: {
              Nombre: true,
              categorias: {
                select: {
                  Nombre: true,
                  productos: {
                    select: {
                      Nombre: true,
                    },
                  },
                },
              },
            },
          });
          console.log(categoriasConCatalogo);
       // return res.render("main", {categoriasConCatalogo});
        res.status(200).json({categoriasConCatalogo})
    } catch (error) {
        console.error('Error al obtener los catalogos y categorias:', error);
    }
   
}