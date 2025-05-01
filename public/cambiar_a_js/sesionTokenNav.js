import { getCookie } from "./expresiones.js"
const usuario = document.querySelector("#usernameData")
const sesion = document.querySelector("#sesion")
const miEnlaceUsuario = document.querySelector("#miEnlaceUsuario")


const token = getCookie("token");
function isTokenExpired (token){
if(!token){
  usuario.textContent = "Ingresar"
  sesion.textContent = "Registrarse"
  miEnlaceUsuario.href = "/MercadilloBucaramanga/Login"
}else{
  const arrayToken = token.split('.')
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  sesion.textContent = "Cerrar Sesion"

  if(tokenPayload.role === 1){
    miEnlaceUsuario.href = "/MercadilloBucaramanga/Usuario";
  }else if(tokenPayload.role === 2){
    miEnlaceUsuario.href = "/MercadilloBucaramanga/Admin";
  }
}
}

isTokenExpired(token);
