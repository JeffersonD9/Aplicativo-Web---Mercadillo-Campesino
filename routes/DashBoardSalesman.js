import { Router } from "express";
import { ProfileSalesman, UpdateVendedor } from '../controllers/ControllerAuthSalesman.js'
import { authRequired } from '../MiddleWares/ValidateToken.js'

import { actualizarProducto, crearProducto, eliminarProducto, getProductos, getProductosRender } from "../controllers/ControllerAssignProductsToSalesmen.js";
import { upload } from "../configMulter/multer.js";
import { noCache } from "../MiddleWares/cache.js";

const router = Router()

router.get("/Usuario", authRequired, noCache, ProfileSalesman)
router.patch("/Usuario/:id_vendedor", authRequired, noCache, UpdateVendedor);

router.get("/Usuario/Productos-Categorizados", authRequired, noCache, getProductosRender);
router.get('/Usuario/Asignar-Productos', authRequired, noCache, getProductos)
router.post('/Usuario/Asignar-Productos', authRequired, upload.single('Imagen'), noCache, crearProducto)
router.patch('/Usuario/Asignar-Productos/:Id', authRequired, authRequired, upload.single('Imagen'), noCache, actualizarProducto)
router.delete('/Usuario/Asignar-Productos/:Id', authRequired, noCache, eliminarProducto)

export default router