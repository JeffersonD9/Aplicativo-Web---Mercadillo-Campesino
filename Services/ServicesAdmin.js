import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

export async function SearchAdmin(Email) {

  const userFound = await prisma.admin.findUnique({
    where: {
      Email: Email,
    },
  });
  return userFound
}

export async function SearchAdminUserName(UserName) {

  const userFound = await prisma.admin.findUnique({
    where: {
      UserName: UserName,
    },
  });
  return userFound
}


export async function CreateCatalog(userfound,productFound){

  const createCat = await prisma.catalogos.create({

        Nombre: productFound.Nombre,
        Descripcion : productFound.Descripcion,
        id_usuario : userfound.id_usuario
  })
  return createCat
}
export async function validatePassword(userFound, Password) {
  const ismatch = await bcrypt.compare(Password, userFound.Password);
  return ismatch
}


export async function UpdateUser(userName, Password) {

const usuarioActualizado = await prisma.usuario.update({
  where: {
    UserName: userName // 
  },
  data: {
    Password: Password // Nueva contraseña que deseas establecer
  }
});
return usuarioActualizado

}



export async function ValidateSessionAdmin(req) {
  
  const adminFound = await prisma.admin.findUnique({
    where: {
      id: req.user.id,
      Email: req.body.Email,
      id_Rol: req.user.role,
    },
  });
  return adminFound;
}
