import jwt from "jsonwebtoken";
import { SECRET_TOKEN } from "../config.js"

export const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      req.usuario = null;
      return next();
    }

    const decoded = jwt.verify(token, SECRET_TOKEN);
    
    req.usuario = {
      username: decoded.Name || decoded.nameToken,
      nombre: decoded.Name || decoded.nameToken,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);

    req.usuario = null;
    next();
  }
};
