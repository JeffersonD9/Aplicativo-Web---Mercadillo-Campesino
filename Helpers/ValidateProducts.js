import {validateReq} from '../Helpers/ValidateParams.js'
import {body, check, param, checkExact } from 'express-validator';

export const validateParams = [
    
    check("id").exists().toInt().isInt(),
    (req, res, next) => {
        validateReq(req, res, next);
    }
]

export const validateCreate = [

    check("data").exists(),
    check("data.*.Nombre").exists().isString().notEmpty(),
    check("data.*.Descripcion").exists().isString().notEmpty(),
    check("data.*.Disponibilidad").exists().notEmpty(),
    check("data.*.Precio").exists().isString().notEmpty(),
    checkExact(),
    (req, res, next) => {
        validateReq(req, res, next);
    }
]

export const validateUpdate = [

    param("id").exists().toInt().isNumeric(),
    body("Nombre").exists().isString().notEmpty(),
    body("Descripcion").exists().isString().notEmpty(),
    body("Disponibilidad").exists().notEmpty(),
    body("Precio").exists().isString().notEmpty(),
    checkExact(),
    (req, res, next) => {
        validateReq(req, res, next);
    }
    
]