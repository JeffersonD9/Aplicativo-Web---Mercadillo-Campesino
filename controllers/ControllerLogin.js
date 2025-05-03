import { LoginAdmin } from "./ControllerAuthAdmin.js";
import { LoginSalesman } from "./ControllerAuthSalesman.js";
import { UserServices } from "../Services/UserService.js";
import { Roles } from "../Helpers/ValidationRoles/Roles.js";
const service = new UserServices();

export async function Login(req, res) {
  const { Email } = req.body;
  const role = await service.findRole(Email);

  if (role == null) {
    return res.status(404).json({ message: "El Usuario No Existe" });
  }

  if (role == Roles.VENDEDOR) {
    console.log("Vendor");
    return await LoginSalesman(req, res);
  } else if (role == Roles.ADMIN) {
    console.log("Admin");
    return await LoginAdmin(req, res);
  } else {
    return res.status(404).json({ message: "El Usuario No Existe" });
  }
}

export async function LogOut(req, res) {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  //console.log(req.user.userName)
  return res
    .status(200)
    .json({ redirect: "/MercadilloBucaramanga" });
}

export function Ingresar(req, res) {
  res.render("login");
}

export function IngresarFormRegistroUsuario(req, res) {
  res.render("registrarUsuario");
}
