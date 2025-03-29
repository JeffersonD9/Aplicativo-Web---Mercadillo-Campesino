"use stric"

import nodemailer from "nodemailer"

import dotenv from 'dotenv';
dotenv.config();

export function enviar_email(email,token){

    let transporter = nodemailer.createTransport({
        service:"gmail",
        port:465,
        secure:true,
        auth:{
            user:process.env.MAILUSER,
            pass:process.env.MAILPASSWD
        }
    });
    

    let mail_options ={
        form: "Pabs",
        to:`${email}`,
        subject:"Cambiar Contraseña",
        html:`<a href="http://localhost:3000/MercadilloBucaramanga/Restablecer/${token}"> ${token}</a>`
    };

    transporter.sendMail(mail_options,(err,inf)=>{
        if(err){
            console.log(err)
        }else{
            console.log("El correo se envio correctamente ", inf.response)
        }
    })
}


