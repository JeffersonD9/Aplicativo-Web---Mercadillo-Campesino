import { Router } from "express";
import {ProfileSalesman,UpdateVendedor} from '../controllers/ControllerAuthSalesman.js'
import {authRequired} from '../MiddleWares/ValidateToken.js'
import{FileUpload} from "../MiddleWares/FileUpload.js"
const router = Router()

router.get("/Usuario", authRequired, ProfileSalesman)
router.patch("/Usuario/:id_vendedor",authRequired,FileUpload,UpdateVendedor);

export default router