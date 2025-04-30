import { CreateAccesToken } from "../Services/CreateToken.js";
import { UserServices } from "../Services/UserService.js";
import { Roles } from "../Helpers/ValidationRoles/Roles.js";
const service = new UserServices();

export async function LoginAdmin(req, res) {

  const { Email, Password } = req.body;
  try {

    const role = Roles.ADMIN;
    const nameToken = Email.split('@')[0];
    
    const userValidate = await service.validateUserLogin(Email, role, Password);
    
    if (userValidate == null)
      return res.status(400).json({ message: "Invalidate Credentials" });

    const token = await CreateAccesToken({
      id: userValidate.Id,
      role: role,
      Name: nameToken,
    });

    res.cookie("token", token);
    res.status(201).send({
      Email: userValidate.Email,
      redirect: "Admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function RenderDashboardAdmin(req, res) {
  try {

    
    const adminUserFound = await service.validateSession(req);
    if (adminUserFound == null) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    return res.render("Administrador/administrador", {
      UserName: adminUserFound.UserName,
      index: "Admin",
      body: "datosAdmin",
      adminUserFound
    });
  } catch (error) {
    console.error("Error en ProfileAdmin:", error);
    return res.status(500).json({ message: error.message });
  }
}

export async function MostrarUsuarios(req, res) {
  try {

    const usuarios = await service.getAllUsers();
    if (usuarios == null) res.status(401).json({ message: "Users not Found" });

    res.render("Administrador/administrador", {
      UserName: req.user,
      body: "listaUsuarios",
      usuarios,
      index: "Admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function EliminarUsuario(req, res) {

  try {

    const id_usuario = parseInt(req.params.id_usuario, 10);
    const result = service.deleteUser(id_usuario);
    
    res.status(200).json({ message: "Usuario Borrado", data: result });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
}

// export async function ActualizarAdmin(req, res) {

//   const { Email, Password, UserName, celular } = req.body;
//   console.log(req.body)
//   const id_adminbody = parseInt(req.params.id_admin, 10);

//   try {
//     const passwordHash = await bcrypt.hash(Password, 10)
//     const actualizarAdmin = await prisma.admin.update({
//       where: { id: id_adminbody },
//       data: {
//         Email,
//         Password: passwordHash,
//         celular,
//         UserName
//       }
//     });
//     res.status(200).json({
//       message: "Usuario actualizado",
//       data: actualizarAdmin,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error });
//     console.log(error);
//   }
// }

