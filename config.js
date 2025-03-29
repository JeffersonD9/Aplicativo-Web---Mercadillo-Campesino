import {config} from 'dotenv'

config()

//Settings 

export const PORT = process.env.PORT || 3000
export const SECRET_TOKEN = "Secret-Token"