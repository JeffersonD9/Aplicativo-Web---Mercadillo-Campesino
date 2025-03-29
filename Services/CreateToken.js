import {SECRET_TOKEN} from "../config.js"
import  Jwt  from "jsonwebtoken";

async function CreateAccesToken(payload){
   return  new Promise((resolve,reject)=>{
        Jwt.sign(
            payload,      
            SECRET_TOKEN,
            {
            expiresIn: "1d",
            },
            (err,token) =>{
                if(err)reject(err)
                resolve(token)             
            }
        );
    })
    
}

export{CreateAccesToken}