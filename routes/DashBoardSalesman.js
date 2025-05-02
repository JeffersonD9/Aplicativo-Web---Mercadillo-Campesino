import { Router } from "express";
import { ProfileSalesman, UpdateVendedor } from '../controllers/ControllerAuthSalesman.js'
import { authRequired } from '../MiddleWares/ValidateToken.js'
const router = Router()

router.get("/Usuario", authRequired, ProfileSalesman)
router.patch("/Usuario/:id_vendedor", authRequired, UpdateVendedor);

router.get("/Usuario/Productos-Categorizados", authRequired)
router.get('/Usuario/Asignar-Productos', authRequired)
router.post('/Usuario/Asignar-Productos', authRequired)
router.patch('/Usuario/Asignar-Productos', authRequired)
router.delete('/Usuario/Asignar-Productos', authRequired)

export default router