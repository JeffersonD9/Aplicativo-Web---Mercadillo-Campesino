import JTW from "jsonwebtoken";
import {SECRET_TOKEN} from "../config.js"

export const authRequired = (req,res,next)=>{

    const {token} = req.cookies;
    if(!token) return res.redirect("/MercadilloBucaramanga"); //redirecciona a la pagina de inicio cuando no hay token activos
    /*res.status(401).json({message: "No token, Authorization denied"})*/

    JTW.verify(token,SECRET_TOKEN, (err, user)=>{

        if(err) return res.status(403).json({message: "Invalid Token"})
        req.user = user
        next()
    })
}