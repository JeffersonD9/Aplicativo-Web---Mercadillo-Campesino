import { Router } from "express";
import{authRequired} from "../MiddleWares/ValidateToken.js"

const router = Router()

router.get('/tasks',authRequired,(req,res)=>{res.send("Task")})

export default router