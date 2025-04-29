import { Router } from "express";
import { RenderDashboardAdmin, MostrarUsuarios, EliminarUsuario } from '../controllers/ControllerAuthAdmin.js'
import { authRequired } from '../MiddleWares/ValidateToken.js'
import { createMercadillo, deleteMercadillo, getAllMercadillos, getMercadilloById, updateMercadillo } from "../controllers/ControllerMercadillos.js";

const router = Router()

router.get('/Admin', authRequired, RenderDashboardAdmin);
//router.put('/Admin/:id_admin',authRequired, ActualizarAdmin);

router.get('/Admin/Usuarios', authRequired, MostrarUsuarios);
router.delete('/Admin/Usuarios/:id_usuario', authRequired, EliminarUsuario)

router.get('/Admin/Mercadillos', authRequired, getAllMercadillos)
router.get('/Admin/Mercadillos/:id_mercadillo', authRequired, getMercadilloById)
router.post('/Admin/Mercadillos/create', authRequired, createMercadillo)
router.put('/Admin/Mercadillos/:id_mercadillo', authRequired, updateMercadillo)
router.delete('/Admin/Mercadillos/:id_mercadillo', authRequired, deleteMercadillo)






export default router