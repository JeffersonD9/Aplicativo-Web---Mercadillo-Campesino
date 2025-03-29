import { CreateAccesToken } from "../Services/CreateToken.js";
import {
  SearchUser,
  SearchUserName,
  ValidateSessionAdmin,
  ActualizarVendedor,
} from "../Services/ServicesUser.js";
import { UpdateUser, validatePassword } from "../Services/ServicesAdmin.js";
import { enviar_email } from "../templateCorreo/envioPassword.js";
import bcrypt from "bcrypt";

export async function LoginSalesman(req, res) {
  const { Email, Password } = req.body;

  try {
    const userFound = await SearchUser(Email);
    const passwordOk = await validatePassword(userFound, Password);
    if (!passwordOk)
      return res.status(400).json({ message: "Invalidate Credentials" });
    const role = userFound.id_Rol;
    const token = await CreateAccesToken({
      id: userFound.id,
      userName: userFound.UserName,
      role: role,
    });

    res.cookie("token", token);
    res.status(201).send({
      UserName: userFound.UserName,
      redirect: "Usuario",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
export async function ProfileSalesman(req, res) {
  try {
    const userFound = await ValidateSessionAdmin(req);
    if (!userFound) return res.status(400).json({ message: "User not Found" });

    return res.render("Vendedor/vendedor", {
      UserName: userFound.UserName,
      index: "Usuario",
      body: "datosVendedor",
      userFound,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Enviar contraseña al correo

export async function EnviarCorreo(req, res) {
  try {
    const Email = req.body.Email;
    console.log(req.body.Email);
    const userFound = await SearchUser(Email);
    if (!userFound) {
      return res.status(400).json({ message: `Solicitud rechazada` });
    }
    const token = await CreateAccesToken({
      id: userFound.id,
      userName: userFound.UserName,
    });
    enviar_email(Email, token);
    res.status(200).json({ message: "Correo Enviado" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

//form
export async function FromCambiarPassword(req, res) {
  return res.render("enviarTokenEmail");
}

export async function RestablecerPassword(req, res) {
  return res.render("cambiarPassword");
}

export async function ActualizarPassword(req, res) {
  try {
    const { UserName, Password } = req.body;
    console.log(req.body);
    const userFound = await SearchUserName(UserName);

    if (!userFound)
      return res.status(400).json({ message: "Invalidate Credentials" });

    const passwordHash = await bcrypt.hash(Password, 10);
    const usuarioActualizado = await UpdateUser(UserName, passwordHash);
    console.log(usuarioActualizado);
    if (!usuarioActualizado) {
      return res
        .status(400)
        .json({ message: "Error al actualizar el usuario" });
    }
    return res.status(200).send({ redirect: "/MercadilloBucaramanga/Login" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function UpdateVendedor(req, res) {
  try {
    const id_vendedor = parseInt(req.params.id_vendedor, 10);
    const data = req.body;
    const Imagen = !req.file?.path ? req.body.file : req.file.path;
    const userfound = await ActualizarVendedor(id_vendedor,data,Imagen);
    if (!userfound)
      return res.status(400).json({ message: "Error al actualizar" });
    return res.status(200).json({ userfound });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
