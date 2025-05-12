import { PrismaClient } from "@prisma/client";
import fs from "fs/promises"; // Usar fs.promises para operaciones asíncronas
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

export class CustomProducts {
  constructor() {
    this.prisma = prisma;
    const __filename = fileURLToPath(import.meta.url);
    this.baseDir = path.dirname(__filename); 
  }

  async getProductsByUserId(userId) {
    try {
      const productos = await this.prisma.productospersonalizados.findMany({
        where: {
          Id_Usuario: userId,
        },
      });

      return { success: true, data: productos };
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return { success: false, error: "Error interno al obtener productos" };
    }
  }

  async create(data, file) {
    try {
      const { Id_producto, NombreProducto, Descripcion, NombreCategoria, userId } = data;

      // Manejar la imagen
      let imagenPath = "";
      if (file) {
        imagenPath = `/Image_Products/${file.filename}`; // Usar el nombre generado por multer
      }

      // Guardar en la base de datos
      const producto = await prisma.productospersonalizados.create({
        data: {
          Id_producto: parseInt(Id_producto),
          NombreProducto,
          Descripcion,
          Imagen: imagenPath,
          NombreCategoria,
          usuario: {
            connect: {
              Id: userId,
            },
          },
        },
      });

      return { success: true, data: producto };
    } catch (error) {
      console.error("Error en customProductsService.create:", error);
      return { success: false, error: "Error al crear el producto" };
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(data, file = null) {
    try {
      console.log('Iniciando update con data:', data, 'file:', file);
      const { Id, userId, ...fields } = data; // Separar Id y userId de los campos a actualizar

      // Verificar que el producto exista y pertenezca al usuario
      console.log(`Buscando producto con Id: ${Id}, userId: ${userId}`);
      const productoExistente = await this.prisma.productospersonalizados.findFirst({
        where: {
          Id: parseInt(Id),
          Id_Usuario: parseInt(userId),
        },
      });

      if (!productoExistente) {
        console.log('Producto no encontrado o sin permisos');
        return {
          success: false,
          error: "Producto no encontrado o no tienes permiso para modificarlo",
        };
      }
      console.log('Producto encontrado:', productoExistente);

      // Construir objeto de actualización dinámicamente
      const updateData = {};

      if ("Id_producto" in fields) {
        updateData.Id_producto = parseInt(fields.Id_producto);
      }
      if ("NombreProducto" in fields) {
        updateData.NombreProducto = fields.NombreProducto;
      }
      if ("Descripcion" in fields) {
        updateData.Descripcion = fields.Descripcion;
      }
      if ("NombreCategoria" in fields) {
        updateData.NombreCategoria = fields.NombreCategoria;
      }
      if ("Estado" in fields) {
        updateData.Estado = Boolean(fields.Estado);
      }

      // Manejo de imagen
      console.log('Verificando file:', file);
      if (file) {
        console.log('Se proporcionó un nuevo archivo:', file.filename);
        // Eliminar imagen anterior si existe
        console.log('Imagen existente:', productoExistente.Imagen);
        if (productoExistente.Imagen) {
          console.log(`Intentando eliminar imagen anterior: ${productoExistente.Imagen}`);
          const deleted = await this.deleteImage(productoExistente.Imagen);
          if (deleted) {
            console.log('Imagen anterior eliminada exitosamente');
          } else {
            console.warn('No se pudo eliminar la imagen anterior, continuando con la actualización');
          }
        } else {
          console.log('No hay imagen anterior para eliminar');
        }
        // Guardar nueva imagen
        updateData.Imagen = `/Image_Products/${file.filename}`;
        console.log(`Nueva imagen guardada: ${updateData.Imagen}`);
      } else {
        console.log('No se proporcionó un nuevo archivo');
      }

      // Validar si hay algo para actualizar
      if (Object.keys(updateData).length === 0) {
        console.log('No se proporcionaron campos para actualizar');
        return {
          success: false,
          error: "No se proporcionaron campos para actualizar",
        };
      }

      // Actualizar producto
      console.log('Actualizando producto con datos:', updateData);
      const productoActualizado = await this.prisma.productospersonalizados.update({
        where: {
          Id: parseInt(Id),
        },
        data: updateData,
      });

      console.log('Producto actualizado:', productoActualizado);
      return { success: true, data: productoActualizado };
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return { success: false, error: "Error interno al actualizar producto" };
    }
  }

  async delete(id, userId) {
    try {
      console.log(`Iniciando delete con id: ${id}, userId: ${userId}`);
      // Verificar que el producto exista y pertenezca al usuario
      const productoExistente = await this.prisma.productospersonalizados.findFirst({
        where: {
          Id: parseInt(id),
          Id_Usuario: userId,
        },
      });

      if (!productoExistente) {
        console.log('Producto no encontrado o sin permisos');
        return {
          success: false,
          error: "Producto no encontrado o no tienes permiso para eliminarlo",
        };
      }
      console.log('Producto encontrado:', productoExistente);

      // Eliminar imagen si existe
      console.log('Imagen existente:', productoExistente.Imagen);
      if (productoExistente.Imagen) {
        console.log(`Intentando eliminar imagen: ${productoExistente.Imagen}`);
        const deleted = await this.deleteImage(productoExistente.Imagen);
        if (deleted) {
          console.log('Imagen eliminada exitosamente');
        } else {
          console.warn('No se pudo eliminar la imagen, continuando con la eliminación del producto');
        }
      } else {
        console.log('No hay imagen para eliminar');
      }

      // Eliminar producto
      console.log('Eliminando producto');
      await this.prisma.productospersonalizados.delete({
        where: {
          Id: parseInt(id),
        },
      });

      console.log('Producto eliminado correctamente');
      return { success: true, message: "Producto eliminado correctamente" };
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return { success: false, error: "Error interno al eliminar producto" };
    }
  }

  async deleteImage(imagePath) {
    console.log(`Llamando a deleteImage con imagePath: ${imagePath}`);
    try {
      // Construir la ruta completa a la carpeta public/Image_Products
      const fullPath = path.join(this.baseDir, '..', 'public', 'Image_Products', path.basename(imagePath));
      console.log(`Ruta completa para eliminar: ${fullPath}`);

      // Verificar si el archivo existe
      const fileExists = await fs.access(fullPath).then(() => true).catch(() => false);

      if (fileExists) {
        await fs.unlink(fullPath);
        console.log(`Archivo eliminado: ${fullPath}`);
        return true;
      } else {
        console.log(`El archivo ${fullPath} no existe, no se requiere eliminación`);
        return true; // No es un error si el archivo no existe
      }
    } catch (error) {
      console.error(`Error al eliminar el archivo ${imagePath}:`, error);
      return false;
    }
  }

  async saveImage(file) {
    try {
      // Guardar la imagen en una carpeta de uploads
      const uploadDir = path.join(this.baseDir, "../public/Image_Products");

      // Crear directorio si no existe
      const dirExists = await fs.access(uploadDir).then(() => true).catch(() => false);
      if (!dirExists) {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);
      return `/Image_Products/${fileName}`;
    } catch (error) {
      console.error("Error al guardar imagen:", error);
      return "";
    }
  }
}