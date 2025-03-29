import { Router } from "express";
import {Register} from '../controllers/ControllerRegister.js'
import {Login, LogOut} from '../controllers/ControllerLogin.js'
import {validateCreate} from '../Helpers/ValidateUsers.js'
import{FileUpload} from "../MiddleWares/FileUpload.js"
import {Ingresar,IngresarFormRegistroUsuario} from '../controllers/ControllerLogin.js'
import { EnviarCorreo,FromCambiarPassword,RestablecerPassword,ActualizarPassword } from "../controllers/ControllerAuthSalesman.js";


const router = Router()
router.get("/Login", Ingresar)
router.post("/Login", Login)

router.get("/Registrar", IngresarFormRegistroUsuario)
router.post("/Registrar",FileUpload,Register)
router.post("/LogOut",LogOut)

router.get("/Restablecer", FromCambiarPassword)
router.post("/Restablecer/:email", EnviarCorreo)

router.get("/Restablecer/:token", RestablecerPassword)
router.put("/Restablecer", ActualizarPassword)



export default router