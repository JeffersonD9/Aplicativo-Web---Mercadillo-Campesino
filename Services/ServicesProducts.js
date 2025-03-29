import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function CreateItem(data){

  const product = await prisma.productos.create({
    data: data,
  })
  return product
}

export async function SearchByIdItem(id_categoria,nombre,id_usuario){

 const productfound = prisma.productos.findMany({
    where: {
      Nombre:nombre,
      id_Categoria:id_categoria,
      id_Usuario:id_usuario
    },
})
return productfound
}

export async function SearchsItems(){
  const getProducts = await prisma.productos.findMany()
  return getProducts
}

export async function DeleteItem(id){

  const deleteProduct = await prisma.productos.delete({ where:{id:id}})
return deleteProduct
}

export async function UpdateItem(id_producto,data,id_Categoria,id_Usuario,Imagen){
  const { Nombre, Descripcion, Precio, Presentacion } = data;
  const Disponibilidad = !!Number(data.Disponibilidad);

  const updateProduct = await prisma.productos.update({
    where:{id:id_producto},
    data: {
      Nombre,
      Descripcion,
      Precio,
      Presentacion,
      Disponibilidad,
      id_Categoria,
      id_Usuario,
      Imagen
    }
})
return updateProduct
}

export async function SearchProduct() {

    const productsFound = await prisma.productos.findMany({
        include: {
          usuarios: {
            select: {
              Nombres: true
            }
          },
          categorias: {
            select: {
              Nombre: true
            }
          }
        }
      });

      return productsFound
  }