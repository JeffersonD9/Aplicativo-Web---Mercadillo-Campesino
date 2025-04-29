import bcrypt from "bcrypt";

/**
* Encriptar contraseña
* @param {string} password - Contraseña para encriptar
* @returns {Promise<string>} - Password hasheada
*/
export async function EncryptPassword(password) {

    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash
}
