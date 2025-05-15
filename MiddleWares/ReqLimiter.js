import rateLimit from "express-rate-limit"

export const requestLimiter = rateLimit({
    windowMsL: 1 * 60 * 100, // 1 minuto
    max: 100,
    message: 'Demasiadas solicitudes. Intenta mas tarde'
})

export const loginRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 100, // indica 10 minutos
    max: 5,
    message: 'Demasiados intentos de login. Intentalo de nuevo en 10 minutos',
    standardHeaders: true,
    legacyHeaders: false,
})