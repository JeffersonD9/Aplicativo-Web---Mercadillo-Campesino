import { check } from "express-validator";
import { validateResult } from "../utils/ValidateHelper.js"

const validateCreate = [

    check('UserName').exists().notEmpty(),
    check('Password').exists().notEmpty(),
    check('Email').exists().not().isEmpty().isEmail(),
    check('Nombres').exists().notEmpty(),
    (req,res,next)=>{

        validateResult (req,res,next)
    }
]
export {validateCreate}