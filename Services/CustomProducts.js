import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { connect } from "http2";
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
                    Id_Usuario: userId
                }
            });

            return { success: true, data: productos };

        } catch (error) {
            console.error("Error al obtener productos:", error);
            return { success: false, error: "Error interno al obtener productos" };
        }
    }

    async create(data, file = null) {
        try {
            const { Id_producto, NombreProducto, Descripcion, NombreCategoria, userId } = data;
            console.log(data, " ****** ")
            // Validar datos requeridos
            if (!NombreProducto || !Descripcion || !NombreCategoria) {
                return { success: false, error: "Todos los campos son obligatorios" };
            }

            // Manejo de imagen
            let rutaImagen = '';
            if (file) {
                rutaImagen = await this.saveImage(file);
            }

            // Crear producto en la base de datos
            const nuevoProducto = await this.prisma.productospersonalizados.create({
                data: {
                    Id_producto: parseInt(Id_producto),
                    NombreProducto,
                    Descripcion,
                    Imagen: rutaImagen,
                    NombreCategoria,
                    usuario: {
                        connect: {
                            Id: userId,
                        }
                    }
                }
            });

            return { success: true, data: nuevoProducto };
        } catch (error) {
            console.error("Error al crear producto:", error);
            return { success: false, error: "Error interno al crear producto" };
        }
    }

    async update(id, data, file = null) {
        try {
            const { NombreProducto, Descripcion, NombreCategoria, userId } = data;

            // Verificar que el producto exista y pertenezca al usuario
            const productoExistente = await this.prisma.productospersonalizados.findFirst({
                where: {
                    Id: parseInt(id),
                    Id_Usuario: userId
                }
            });

            if (!productoExistente) {
                return {
                    success: false,
                    error: "Producto no encontrado o no tienes permiso para modificarlo"
                };
            }

            // Manejo de imagen
            let rutaImagen = productoExistente.Imagen;
            if (file) {
                // Eliminar imagen anterior si existe
                if (productoExistente.Imagen) {
                    this.deleteImage(productoExistente.Imagen);
                }

                // Guardar nueva imagen
                rutaImagen = await this.saveImage(file);
            }

            // Actualizar producto
            const productoActualizado = await this.prisma.productospersonalizados.update({
                where: {
                    Id: parseInt(id)
                },
                data: {
                    NombreProducto: NombreProducto || productoExistente.NombreProducto,
                    Descripcion: Descripcion || productoExistente.Descripcion,
                    Imagen: rutaImagen,
                    NombreCategoria: NombreCategoria || productoExistente.NombreCategoria
                }
            });

            return { success: true, data: productoActualizado };
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return { success: false, error: "Error interno al actualizar producto" };
        }
    }

    async delete(id, userId) {
        try {
            // Verificar que el producto exista y pertenezca al usuario
            const productoExistente = await this.prisma.productospersonalizados.findFirst({
                where: {
                    Id: parseInt(id),
                    Id_Usuario: userId
                }
            });

            if (!productoExistente) {
                return {
                    success: false,
                    error: "Producto no encontrado o no tienes permiso para eliminarlo"
                };
            }

            // Eliminar imagen si existe
            if (productoExistente.Imagen) {
                this.deleteImage(productoExistente.Imagen);
            }

            // Eliminar producto
            await this.prisma.productospersonalizados.delete({
                where: {
                    Id: parseInt(id)
                }
            });

            return { success: true, message: "Producto eliminado correctamente" };
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return { success: false, error: "Error interno al eliminar producto" };
        }
    }

    async saveImage(file) {
        try {
            // Guardar la imagen en una carpeta de uploads
            const uploadDir = path.join(this.baseDir, '../public/Image_Products');

            // Crear directorio si no existe
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, file.buffer);
            return `/Image_Products/${fileName}`;
        } catch (error) {
            console.error("Error al guardar imagen:", error);
            return '';
        }
    }

    deleteImage(imagePath) {
        try {
            const fullPath = path.join(this.baseDir, '..', imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
            return true;
        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            return false;
        }
    }
}