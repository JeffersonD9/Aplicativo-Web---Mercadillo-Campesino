import { Router } from "express";
import {ProfileSalesman,UpdateVendedor} from '../controllers/ControllerAuthSalesman.js'
import {authRequired} from '../MiddleWares/ValidateToken.js'
import {GetProductById,CreateProduct,GetProducts,DeleteProduct,UpdateProduct} from '../controllers/ControllerProducts.js'
import {validateCreate,validateUpdate,validateParams} from '../Helpers/ValidateProducts.js'
import{FileUpload} from "../MiddleWares/FileUpload.js"
const router = Router()

router.get("/Usuario", authRequired, ProfileSalesman)
router.put("/Usuario/:id_vendedor",authRequired,FileUpload,UpdateVendedor);

router.get("/Productos",authRequired, GetProducts) //Ruta para mostrar productos -
router.post("/Productos",authRequired,FileUpload,CreateProduct)
router.put("/Productos/:id_producto",authRequired,FileUpload,UpdateProduct)
router.delete("/Productos/:id_producto",authRequired,DeleteProduct)



export default router