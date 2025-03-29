import {validationResult } from 'express-validator'

export const validateReq = (req, res, next)=>{

    try {
       validationResult(req).throw()
       return next();
    } catch (error) {
        
        res.status(400);
        res.json({success: false, errors: error.array()});
    }
}
