import { CreateAccesToken } from "../Services/CreateToken.js";
import { UserServices } from "../Services/UserService.js";
import { Roles } from "../Helpers/ValidationRoles/Roles.js";
import { MercadilloService } from "../Services/MercadillosService.js";

const service = new UserServices();
const mercadilloService = new MercadilloService();

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

    
    const adminUserFound = await service.validateSession(req.user);
    if (adminUserFound == null) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    
    return res.render("Administrador/administrador", {
      UserName: adminUserFound.UserName,
      index: "Admin",
      body: "administrador",
      adminUserFound
    });
    
  } catch (error) {
    console.error("Error en ProfileAdmin:", error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getPuestoSugerido(req, res) {
    try {
        const idMercadillo = parseInt(req.query.id_Mercadillo);

        if (!idMercadillo || isNaN(idMercadillo)) {
            return res.status(400).json({ error: 'id_Mercadillo requerido y debe ser numérico' });
        }

        const puesto = await mercadilloService.GetSuggestPost(idMercadillo);
        return res.json({ puesto });

    } catch (error) {
        console.error("Error al obtener puesto sugerido:", error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function MostrarUsuarios(req, res) {
  try {
      const usuarios = await service.getAllUsers();
      
      if (usuarios == null) return res.status(401).json({ message: "Users not Found" });

      // Opcional: Transformar los datos para facilitar el acceso en la vista
      const usuariosConMercadillo = usuarios.map(user => ({
          ...user,
          nombreMercadillo: user.mercadillo?.Nombre || 'Sin mercadillo asignado'
      }));

      res.render("Administrador/campesinos", {
          UserName: req.user,
          body: "campesinos",
          campesino: usuariosConMercadillo,
          index: "Admin",
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


export async function getUsuariosJson(req, res) {
      try {
          const usuarios = await service.getAllUsers();
          console.log(usuarios)
          res.status(200).json(usuarios);
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

