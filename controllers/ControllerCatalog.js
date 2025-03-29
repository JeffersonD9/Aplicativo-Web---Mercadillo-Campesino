import { PrismaClient } from "@prisma/client";
import { SearchCatalogo } from "../Services/ServicesCatalogo.js";

const prisma = new PrismaClient();

export async function CreateCatalog(req,res) {
    try {
      const { Nombre,id_Admin } = req.body;
      const encontrarCatalogo = await SearchCatalogo(Nombre);
      if (encontrarCatalogo) {
        return res.status(400).json({ message: "El catálogo ya se encuentra creado" });
  }

      const catalogo = await prisma.catalogos.create({
        data: {
          Nombre,
          id_Admin
        },
      });
      
      res.status(200).json({ message: "Catálogo Creado", catalogo });
  
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }


  export async function MostrarCatalog(req,res) {
    try {
      const catalogos = await prisma.catalogos.findMany();
      res.render("Administrador/administrador", {
        body: "catalogo",
        catalogos
      });
  
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
  
  export async function ActualizarCatalogo(req,res) {
 
  try {
    const { id, Nombre, id_Admin} = req.body;
    
    const encontrarCatalogo = await SearchCatalogo(Nombre);
    if (encontrarCatalogo) {
      return res
        .status(400)
        .json({ message: `El catálogo ya se encuentra creado` });
    }

    const catalogo = await prisma.catalogos.update({
      where: { id: id },
        data: {
          Nombre: Nombre,
          id_Admin: id_Admin,
        },
      });
    
    res.status(200).json({ message: "Catálogo Actualizado", catalogo });

  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }

  }


  export async function EliminarCatalogo(req, res) {

    const id_catalogo = parseInt(req.params.id_catalogo, 10);
    try {
      const data = await prisma.catalogos.delete({
        where: {
          id: id_catalogo,
        },
      });
      res.status(200).json({ message: "Catálogo Borrado", data: data });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }