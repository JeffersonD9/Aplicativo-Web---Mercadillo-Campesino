import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Roles } from "../Helpers/ValidationRoles/UtilsFunctions.js";
import { EncryptPassword } from "../Helpers/EncriptedPassword/EncriptPassword.js";

/**
 * Clase de servicios para operaciones relacionadas con usuarios
 */
export class UserServices {

    constructor() {
        this.prisma = prisma;
        // this.roles = Roles;
    }

    //#region Metodos para admin y Vendedor

    async validateUserLogin(email, role, passwordIngresada) {

        try {

            const user = await this.findUser(email, role);

            if (!user) return null;

            const passwordCorrecta = await bcrypt.compare(passwordIngresada, user.Password);
            return passwordCorrecta ? user : null;

        } catch (error) {
            console.error(`Error al validar login: ${error.message}`);
            return null;
        }
    }

    /**
     * Busca un usuario por email y roles
     * @param {string} email - Email del usuario
     * @param {int} roles - Roles permitidos
     * @returns {Promise<Object|null>} - Usuario encontrado o null
     */
    async findUser(email, roles) {
        try {
            const userFound = await this.prisma.usuario.findUnique({
                where: {
                    Email: email,
                    Roles: roles
                },
            });
            return userFound;
        } catch (error) {
            console.error(`Error al buscar usuario: ${error.message}`);
            return null;
        }
    }

    async getAllUsers() {
        try {
            const usersFound = await this.prisma.usuario.findMany({
                where: {
                    Email: email,
                    Roles: Roles.VENDEDOR
                },
            });
            return usersFound;
        } catch (error) {
            console.error(`Error obtener usuarios: ${error.message}`);
            return null;
        }
    }

    /**
     * Cambia la contraseña de un usuario
     * @param {string} email - Email del usuario
     * @param {string} newPassword - Nueva contraseña sin encriptar
     * @returns {Promise<boolean>} - true si se actualizó correctamente, false si hubo error
     */
    async changePassword(email, role, newPassword) {

        try {

            const hashedPassword = await EncryptPassword(newPassword)

            await this.prisma.usuario.update({
                where: {
                    Email: email,
                    Roles: role
                },
                data: {
                    Password: hashedPassword,
                }
            });

            console.log(`Contraseña actualizada para el usuario ${email}`);
            return true;

        } catch (error) {
            console.error(`Error al cambiar contraseña: ${error.message}`);
            return false;
        }
    }

    /**
     * Valida si un administrador tiene una sesión válida
     * @param {Request} req - Objeto de solicitud 
     * @returns {Promise<Object|null>} - Admin encontrado o null
     */
    async validateSession(req) {
        try {

            const userFound = await this.prisma.usuario.findUnique({
                where: {
                    id: req.user.id,
                    Email: req.body.Email,
                    Roles: req.user.role,
                },
            });

            return userFound;
        } catch (error) {
            console.error(`Error al validar sesión: ${error.message}`);
            return null;
        }
    }
    //#endregion

    /**
    * Actualiza el usuario
    * @param {int} idUsuario - id de usuario
    * @param {object} data - objeto con data a editar
    * @returns {Promise<object>} - devuelve el usuario actualizado
    */
    async ActualizarVendedor(idUsuario, data) {

        var role = Roles.VENDEDOR;
        const passwordHash = await EncryptPassword(data.Password)
        console.log("Data ", data)

        const userFound = await prisma.usuario.update({
            where: {
                id: idUsuario,
                Roles: role
            },
            data: {
                Nombres: data.Nombres,
                Apellidos: data.Apellidos,
                Password: passwordHash,
                Email: data.Email,
                Celular: data.Celular,
                Estado: data.Estado
            }
        });

        return userFound;
    }

    async deleteUser(id_usuario) {
        try {

            const usuarioExiste = await prisma.usuario.findUnique({
                where: {
                    Id: id_usuario
                }
            });

            if (!usuarioExiste) {
                throw new Error(`Usuario con ID ${id_usuario} no encontrado`);
            }

            const resultado = await prisma.usuario.delete({
                where: {
                    Id: id_usuario
                }
            });

            return resultado;

        } catch (error) {
            console.error(`Error al eliminar usuario: ${error.message}`);
            throw error;
        }
    }


    async findRole(Email) {
        try {
            const userFound = await this.prisma.usuario.findUnique({
                where: {
                    Email: Email,
                },
            });

            return userFound.Roles;

        } catch (error) {
            console.error(`Error al buscar usuario: ${error.message}`);
            return null;
        }
    }

}