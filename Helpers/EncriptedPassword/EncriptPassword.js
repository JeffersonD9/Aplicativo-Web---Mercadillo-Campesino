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

export async function ValidatePassword(passwordIngresada, userPassword) {
    let passwordCorrecta = false;

    try {

        passwordCorrecta = await bcrypt.compare(passwordIngresada, userPassword);

    } catch (err) {
        console.error("Error al comparar contraseñas", err);
    }

    // Fallback: si bcrypt falla o retorna false, compara texto plano
    if (!passwordCorrecta && passwordIngresada === userPassword) {
        passwordCorrecta = true;
    }

    console.log(passwordCorrecta);
    return passwordCorrecta;
}
