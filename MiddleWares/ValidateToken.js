import JTW from "jsonwebtoken";
import { SECRET_TOKEN } from "../config.js"

export const authRequired = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.redirect("/MercadilloBucaramanga?mensaje=sesionFinalizada");
      }

    JTW.verify(token, SECRET_TOKEN, (err, user) => {

        if (err) return res.status(403).json({ message: "Invalid Token" })
        req.user = user
        next()
    })
}