import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Clase que gestiona las operaciones CRUD para la entidad Mercadillo
 * utilizando Prisma como ORM para la base de datos
 */
export class MercadilloService {
    /**
     * Constructor de la clase
     * Inicializa el cliente Prisma para operaciones de base de datos
     */
    constructor() {
        this.prisma = prisma;
    }

    /**
     * Crea un nuevo mercadillo en la base de datos
     * @param {Object} data - Datos del mercadillo a crear
     * @returns {Promise<Object>} - Mercadillo creado
     */
    async create(data) {
        try {
            const newMercadillo = await this.prisma.mercadillo.create({ data });
            return newMercadillo;
        } catch (error) {
            console.error(`Error al crear mercadillo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene todos los mercadillos de la base de datos
     * @returns {Promise<Array>} - Lista de todos los mercadillos
     */
    async getAll() {
        try {
            const mercadillos = await this.prisma.mercadillo.findMany();
            return mercadillos;
        } catch (error) {
            console.error(`Error al obtener mercadillos: ${error.message}`);
            throw error;
        }
    }

    /**
     * Busca un mercadillo por su ID
     * @param {number|string} id_mercadillo - ID del mercadillo a buscar
     * @returns {Promise<Object|null>} - Mercadillo encontrado o null si no existe
     */
    async getById(id_mercadillo) {
        try {
            const mercadillo = await this.prisma.mercadillo.findUnique({
                where: { Id: id_mercadillo }
            });
            return mercadillo;
        } catch (error) {
            console.error(`Error al buscar mercadillo por ID: ${error.message}`);
            return null;
        }
    }

    async getByVendor(id_mercadillo, id_vendedor) {
        try {

            const mercadillo = await this.prisma.usuario.findUnique({
                where: { Id: id_vendedor, Id_Mercadillo: id_mercadillo }
            });

            return mercadillo;
        } catch (error) {
            console.error(`Error al buscar mercadillo por ID: ${error.message}`);
            return null;
        }
    }

    /**
     * Actualiza un mercadillo existente en la base de datos
     * @param {number|string} id_mercadillo - ID del mercadillo a actualizar
     * @param {Object} data - Nuevos datos del mercadillo
     * @returns {Promise<Object|null>} - Mercadillo actualizado o null si ocurre un error
     */
    async update(id_mercadillo, data) {
        try {
            const updatedMercadillo = await this.prisma.mercadillo.update({
                where: { Id: id_mercadillo },
                data: data
            });
            return updatedMercadillo;
        } catch (error) {
            console.error(`Error al actualizar mercadillo: ${error.message}`);
            return null;
        }
    }

    /**
     * Elimina un mercadillo de la base de datos
     * @param {number|string} id_mercadillo - ID del mercadillo a eliminar
     * @returns {Promise<Object|null>} - Mercadillo eliminado o null si ocurre un error
     */
    async delete(id_mercadillo) {
        try {
            const deletedMercadillo = await this.prisma.mercadillo.delete({
                where: { Id: id_mercadillo }
            });

            return true;
        } catch (error) {

            console.error(`Error al eliminar mercadillo: ${error.message}`);
            return false;
        }
    }
}