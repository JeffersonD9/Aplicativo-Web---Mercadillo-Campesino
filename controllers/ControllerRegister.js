import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { CreateAccesToken } from "../Services/CreateToken.js";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function Register(req, res) {
  const { Nombres, Apellidos, UserName, Email, Password, Celular } = req.body;

  try {
    const passwordHash = await bcrypt.hash(Password, 10);
    // const dataImagen =  req.file.originalname
    // const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(dataImagen)));

    const newUser = await prisma.usuario.create({
      data: {
        Nombres,
        Apellidos,
        id_Rol: 1,
        UserName,
        Email,
        Password: passwordHash,
        Celular,
        Imagen: req.file.path,
      },
    });

    const token = await CreateAccesToken({id: newUser.id,UserName: newUser.UserName,});

    res.cookie("token", token);
    res.status(201).send({UserName, Email, redirect: "Usuario",});
  } catch (error) {
    if (
      error.code == "P2002" &&
      error.meta.target.includes("Usuario_UserName_key")
    ) {
      res.status(409).json({
        error: { message: `El usuario ${UserName} ya existe`,
          code: "CONFLICT",
          details: error.meta.target,
        },
      });
    } else if (
      error.code == "P2002" &&
      error.meta.target.includes("Usuario_Email_key")
    ) {
      res.status(409).json({
        error: {
          message: `El correo ingresado ${Email} ya esta existe`,
          code: "CONFLICT",
          details: error.meta.target,
        },
      });
    } else {
      res.status(500).send("Algo salio mal");
      console.log(error);
    }
  }
}

export { Register };
