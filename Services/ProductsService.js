import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ProductService {
    constructor() {
        this.prisma = prisma;
    }

    BuildDTOProducts(productos) {

        const productsDTO = productos.map(producto => ({
            id: producto.Id,
            title: producto.NombreProducto,
            category: producto.NombreCategoria,
            description: producto.Descripcion,
            image: producto.Imagen,
            phone : producto.usuario.Celular,
            puesto : producto.usuario.Puesto,
            mercadillo: producto.usuario.mercadillo.Nombre,
            producer: `${producto.usuario.Nombres} ${producto.usuario.Apellidos}`
        }));

        return productsDTO;
    }

    async getAll(count) {

        const productos = await prisma.productospersonalizados.findMany({
            take: count,
            where: {
                usuario: {
                    Id_Mercadillo: {
                        not: null
                    }
                }
            },
            include: {
                usuario: {
                    include: {
                        mercadillo: true
                    }
                }
            }
        });
    
        if (!productos)
            return null;
    
        return this.BuildDTOProducts(productos);
    }
    

    async getByCategory(categoryName) {

        const productos = await prisma.productospersonalizados.findMany({
            where: {
                NombreCategoria: categoryName,
            },
            include: {
                usuario: true,
            },
        });

        if (productos == null)
            return null;

        return this.BuildDTOProducts(productos);
    }
}

