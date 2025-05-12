import { Router } from "express";
import { ProfileSalesman, UpdateVendedor } from '../controllers/ControllerAuthSalesman.js'
import { authRequired } from '../MiddleWares/ValidateToken.js'
import { actualizarProducto, crearProducto, eliminarProducto, getProductos, getProductosRender } from "../controllers/ControllerAssignProductsToSalesmen.js";
const router = Router()

router.get("/Usuario", authRequired, ProfileSalesman)
router.patch("/Usuario/:id_vendedor", authRequired, UpdateVendedor);

router.get("/Usuario/Productos-Categorizados", authRequired, getProductosRender);
router.get('/Usuario/Asignar-Productos', authRequired, getProductos)
router.post('/Usuario/Asignar-Productos', authRequired, crearProducto)
router.patch('/Usuario/Asignar-Productos/:Id', authRequired, actualizarProducto)
router.delete('/Usuario/Asignar-Productos/:Id', authRequired, eliminarProducto)

export default router