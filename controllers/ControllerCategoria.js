import { PrismaClient } from "@prisma/client";
import { SearchCategoria } from "../Services/ServicesCategoria.js";
const prisma = new PrismaClient();
export async function EliminarCategoria(req, res) {
    const id_categoria = parseInt(req.params.id_categoria, 10);
    try {
      const data = await prisma.categorias.delete({
        where: {
          id: id_categoria,
        },
      });
      res.status(200).json({ message: "Categoría Borrada", data: data });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
  
  export async function MostrarCategorias(req, res) {
    try {
      //Mostrar los categorias por cataglo
      const categoriasConCatalogo = await prisma.categorias.findMany({
        include: {
          catalogos: true, // Incluir el catálogo relacionado
          Admins:true
        },
        orderBy: {
          id: 'desc', // Ordenar por id de forma descendente para obtener los últimos registros
        },
      });
      console.log(categoriasConCatalogo);
  
      //Traer los catalogos para mostrarlos en el select
      const catalogos = await prisma.catalogos.findMany();
  
      res.render("Administrador/administrador", {
        //UserName: req.user,
        body: "categoria",
        //index: "Admin",
        categoriasConCatalogo,
        catalogos, //Todos los catalogos
      });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
  
  export async function CrearCategorias(req, res) {
    const { Nombre, id_Cat,id_Admin } = req.body;
    try {
      const encontrarCategoria = await SearchCategoria(Nombre,id_Cat);
      if (encontrarCategoria) {
        return res.status(400).json({ message: "La categoría ya se encuentra creada" });
      }
  
      const categorias = await prisma.categorias.create({
        data: {
          Nombre: Nombre,
          id_Cat: id_Cat,
          id_Admin:id_Admin
        },
      });
      res.status(200).json({ message: "Categoría Creada", categorias: categorias });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
  
  export async function ActualizarCategorias(req, res) {
    const { Nombre, id_Cat } = req.body;
    const id_categoria = parseInt(req.params.id_categoria, 10);
  
    try {
      const encontrarCategoria = await SearchCategoria(Nombre,id_Cat);
      if (encontrarCategoria) {
        return res
          .status(400)
          .json({ message: "No se puede actualizar por que ya existe" });
      }
      const actualizarCategoria = await prisma.categorias.update({
        where: { id: id_categoria },
        data: {
          Nombre: Nombre,
          id_Cat: id_Cat,
        },
      });
      res.status(200).json({message: "Categoria actualizada correctamente", data: actualizarCategoria});
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
  