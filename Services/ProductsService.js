import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ProductService {
    constructor() {
        this.prisma = prisma;
    }

    BuildDTOProducts(productos) {

        const productsDTO = productos.map(producto => ({
            id: producto.Id,
            title: producto.Nombre,
            category: producto.Categoria,
            description: producto.Descripcion,
            image: producto.Imagen,
            producer: `${producto.vendedor.Nombres} ${producto.vendedor.Apellidos}`
        }));

        return productsDTO;
    }

    async getAll(count) {

        const productos = await prisma.productospersonalizados.findMany({
            take: count,
            include: {
                usuario: true,
            },
        });
        
        return this.BuildDTOProducts(productos);;
    }

    async getByCategory(categoryName){

        const productos = await prisma.productospersonalizados.findMany({
            where: {
                Categoria: categoryName,
            },
            include: {
                usuario: true,
            },
        });

        return this.BuildDTOProducts(productos);
    }
}

