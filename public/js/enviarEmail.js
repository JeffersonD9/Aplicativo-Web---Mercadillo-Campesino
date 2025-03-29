const email = document.querySelector("#email");
const mensajeError = document.querySelector(".error");
const btnEnviar = document.querySelector(".btn-enviar");
const notificacion = document.querySelector(".notificacion");

function eliminarError(){
    mensajeError.classList.toggle("escondido",true);
 }
 
 email.addEventListener("keyup", eliminarError);
 email.addEventListener("blur", eliminarError);



async function enviarEmail(e) {
    console.log(email.value)
  e.preventDefault();
  try {
    const emailFetch = await fetch(`http://localhost:3000/MercadilloBucaramanga/Restablecer/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email.value,
      }),
    });

    if (!emailFetch.ok) {
      if (emailFetch.status === 400) {
        throw new Error(`Verifique que el correo ingresado sea correcto`);
      } else {
        throw new Error("La solicitud no fue exitosa");
      }
    }

    notificacion.textContent = "Correo Enviado con exito"

    const data = await emailFetch.json();
  } catch (error) {
     mensajeError.classList.toggle("escondido",false);
}
}

btnEnviar.addEventListener("click", (e) => {
  enviarEmail(e);
});
