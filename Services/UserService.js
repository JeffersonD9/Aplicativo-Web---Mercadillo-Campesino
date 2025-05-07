import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Roles } from "../Helpers/ValidationRoles/Roles.js";
import { EncryptPassword, ValidatePassword } from "../Helpers/EncriptedPassword/EncriptPassword.js";

/**
 * Clase de servicios para operaciones relacionadas con usuarios
 */
export class UserServices {

    constructor() {
        this.prisma = prisma;
        // this.roles = Roles;
    }

    async CreateDTOUser(req, creation = false) {

        const newUserDTO = {};

        if (req.body.Nombres !== undefined) newUserDTO.Nombres = req.body.Nombres;
        if (req.body.Apellidos !== undefined) newUserDTO.Apellidos = req.body.Apellidos;
        if (req.body.Email !== undefined) newUserDTO.Email = req.body.Email;

        if (req.body.Password !== undefined) {
            const passwordHash = await EncryptPassword(req.body.Password)
            newUserDTO.Password = passwordHash;
        }

        if (req.body.Celular !== undefined) newUserDTO.Celular = req.body.Celular;
        if (req.body.Estado !== undefined) newUserDTO.Estado = req.body.Estado;

        if (creation) {
            if (req.body.Puesto !== undefined) newUserDTO.Puesto = req.body.Puesto;
            newUserDTO.Roles = Roles.VENDEDOR
        }

        return newUserDTO;
    }


    //#region Metodos para admin y Vendedor

    /**
     * Valida el login de un usuario comparando email, rol y contraseña
     * @param {string} email - Email del usuario
     * @param {int} role - Rol del usuario
     * @param {string} passwordIngresada - Contraseña ingresada sin encriptar
     * @returns {Promise<Object|null>} - Usuario si la autenticación es válida, si no null
     */
    async validateUserLogin(email, role, passwordIngresada) {
        try {
            const user = await this.findUser(email, role);
            if (user == null) return null;

            const passwordCorrecta = await ValidatePassword(passwordIngresada, user.Password);
            console.log(passwordCorrecta)
            return passwordCorrecta ? user : null;
        } catch (error) {
            console.error(`Error al validar login: ${error.message}`);
            return null;
        }
    }

    /**
     * Busca un usuario por email y rol
     * @param {string} email - Email del usuario
     * @param {int} roles - Rol del usuario
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

    /**
     * Obtiene todos los usuarios con rol de vendedor
     * @returns {Promise<Array|null>} - Lista de usuarios o null en caso de error
     */
    async getAllUsers() {
        try {
            const usersFound = await this.prisma.usuario.findMany({
                where: {
                    Roles: Roles.VENDEDOR
                },
                include: {
                    mercadillo: {
                        select: {
                            Nombre: true
                        }
                    }
                }
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
     * @param {int} role - Rol del usuario
     * @param {string} newPassword - Nueva contraseña sin encriptar
     * @returns {Promise<boolean>} - true si se actualizó correctamente, false si hubo error
     */
    async changePassword(email, role, newPassword) {
        try {
            const hashedPassword = await EncryptPassword(newPassword);

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
                    Id: req.user.id,
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
     * Actualiza los datos de un usuario con rol de vendedor
     * @param {int} idUsuario - ID del usuario
     * @param {object} data - Objeto con los nuevos datos del usuario
     * @returns {Promise<object>} - Usuario actualizado
     */
    async ActualizarVendedor(idUsuario, req) {
        const role = Roles.VENDEDOR;
    
        const userDTO = await this.CreateDTOUser(req);
    
        console.log("Data ", userDTO);
    
        const userFound = await prisma.usuario.update({
            where: {
                Id: idUsuario,
                Roles: role
            },
            data: userDTO
        });
    
        return userFound;
    }

    /**
     * Elimina un usuario por su ID
     * @param {int} id_usuario - ID del usuario a eliminar
     * @returns {Promise<Object>} - Resultado de la eliminación
     * @throws {Error} - Si el usuario no existe o hay un error al eliminar
     */
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

    /**
     * Obtiene el rol de un usuario dado su email
     * @param {string} Email - Email del usuario
     * @returns {Promise<int|null>} - Rol del usuario o null si hay error
     */
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

    async Create(req) {
        try {

            const userDTO = await this.CreateDTOUser(req, true);
            if (userDTO.Password == null || userDTO == null)
                return null;

            const newUser = await prisma.usuario.create({
                data: userDTO
            });

            return newUser;
        } catch (error) {
            console.log(error)
            return null;

        }
    }

}
