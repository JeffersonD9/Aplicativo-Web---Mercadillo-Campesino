import { check } from "express-validator";
import { validateResult } from "./ValidateRequest.js"

const validateCreate = [
    check('UserName').exists().notEmpty().isString(),
    check('Password').exists().notEmpty().isString(),
    check('Email').exists().not().isEmpty().isEmail(),
    check('Nombres').exists().notEmpty().isString(),
    check('Apellidos').exists().notEmpty().isString(),
    check('Celular').exists().notEmpty().isString(),

    (req,res,next)=>{
        validateResult (req,res,next)
    }
]
export {validateCreate}