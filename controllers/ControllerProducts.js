import {
  CreateItem,
  SearchByIdItem,
  SearchsItems,
  DeleteItem,
  UpdateItem,
} from "../Services/ServicesProducts.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function CreateProduct(req, res) {
  const { Nombre, Descripcion, Precio, Presentacion } = req.body;
  const Disponibilidad = !!Number(req.body.Disponibilidad);
  const id_Categoria = parseInt(req.body.id_Categoria);
  const id_Usuario = parseInt(req.body.id_Usuario);

  try {
    const encontrarProducto = await SearchByIdItem(id_Categoria,Nombre,id_Usuario);
    if (encontrarProducto.length > 0) {
      return res
        .status(400)
        .json({ message: "El producto ya se encuentra creado" });
    }

    const productos = await prisma.productos.create({
      data: {
        Nombre,
        Descripcion,
        Disponibilidad,
        Precio,
        Presentacion,
        id_Categoria,
        id_Usuario,
        Imagen: req.file.path,
      },
    });

    res.status(200).json({ message: "Producto Creado", productos });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}

export async function GetProductById(req, res) {
  const id_categoria = parseInt(req.params.id_Categoria, 10);
  const id = parseInt(req.params.id, 10);
  try {
    const getProductById = await SearchByIdItem(id_categoria, id);
    res.status(200).json({ message: "Producto", data: getProductById });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}

export async function GetProducts(req, res) {
  try {
    const categoria = await prisma.categorias.findMany();
    const productos = await prisma.productos.findMany({
      where: {
        id_Usuario: req.user.id, // Filtrar productos por el ID del usuario
      },
      include: {
        categorias: true, // Incluir la categoría relacionada
      },
      orderBy: {
        id: "desc", // Ordenar por id de forma descendente para obtener los últimos registros
      },
    });

    res.render("Vendedor/vendedor", {
      UserName: req.user,
      body: "listaProductos",

      productos,
      categoria,
    });

    console.log(" aca ", productos);
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}

export async function DeleteProduct(req, res) {
  const id = parseInt(req.params.id_producto, 10);
  try {
    const deleteProduct = await DeleteItem(id);
    res.status(200).json({ message: "Producto Borrado", data: deleteProduct });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}

export async function UpdateProduct(req, res) {
  
  const id_producto = parseInt(req.params.id_producto, 10);
  const data = req.body;
  const id_Categoria = parseInt(req.body.id_Categoria);
  const id_Usuario = parseInt(req.body.id_Usuario);
 
  const Imagen = (!req.file?.path) ? req.body.file  : req.file.path;
  console.log("Esta es la imagen ", Imagen)
  try {
      
    const updateProduct = await UpdateItem(id_producto,data,id_Categoria,id_Usuario,Imagen);

    res.status(200).json({message: "Producto actualizado correctamente",producto: updateProduct,});

    
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}


