import { CreateAccesToken } from "../Services/CreateToken.js";
import bcrypt from "bcrypt";
import {
  SearchAdmin,
  validatePassword,
  ValidateSessionAdmin,
  SearchAdminUserName,
} from "../Services/ServicesAdmin.js";

export async function LoginAdmin(req, res) {
  const { Email, Password } = req.body;
  try {
    const userfound = await SearchAdmin(Email);
    const passwordOk = await validatePassword(userfound, Password);
    if (!passwordOk)
      return res.status(400).json({ message: "Invalidate Credentials" });
    const role = userfound.id_Rol;

    const token = await CreateAccesToken({
      id: userfound.id,
      role: role,
      userName: userfound.UserName,
    });
    res.cookie("token", token);
    res.status(201).send({
      Email: userfound.Email,
      redirect: "Admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function ProfileAdmin(req, res) {
  try {
    const adminUserFound = await ValidateSessionAdmin(req);
    if (!adminUserFound) res.status(401).json({ message: "User not Found" });
    return res.render("Administrador/administrador", {
      UserName: adminUserFound.UserName,
      index: "Admin",
      body:"datosAdmin",
      adminUserFound
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/* ***** ** *** * ***/
import { PrismaClient } from "@prisma/client";
import { SearchUser } from "../Services/ServicesUser.js";
const prisma = new PrismaClient();

export async function MostrarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany();
    if (!usuarios) res.status(401).json({ message: "User not Found" });
    res.render("Administrador/administrador", {
      UserName: req.user,
      body: "listaUsuario",
      usuarios,
      index: "Admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function EliminarUsuario(req, res) {
  const id_usuario = parseInt(req.params.id_usuario, 10);
  try {
    const resultado = await prisma.usuario.delete({
      where: {
        id: id_usuario,
      },
    });
    res.status(200).json({ message: "Usuario Borrado", data: resultado });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}

export async function ActualizarAdmin(req, res) {
  const { Email, Password, UserName, celular} = req.body;
  console.log(req.body)
  const id_adminbody = parseInt(req.params.id_admin, 10);

  try {
    const passwordHash = await bcrypt.hash(Password,10)
    const actualizarAdmin= await prisma.admin.update({
      where: { id: id_adminbody },
      data: {Email,
      Password:passwordHash,
      celular,
      UserName
    }
    });
    res.status(200).json({
      message: "Usuario actualizado",
      data: actualizarAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}

