const password = document.querySelector("#password");
const mensajeError = document.querySelector(".error");
const btnCambiar = document.querySelector(".btn-cambiar");
const notificacion = document.querySelector(".notificacion");
function eliminarError() {
  mensajeError.classList.toggle("escondido", true);
}

async function actualizar(e) {
  e.preventDefault();
  var currentURL = window.location.href;

  // Encontrar el índice donde comienza "Restablecer/"
  var startIndex = currentURL.indexOf("Restablecer/") + "Restablecer/".length;
  // Obtener la subcadena de la URL que está después de "Restablecer/"
  var restablecerPart = currentURL.substring(startIndex);
  const arrayToken = restablecerPart.split(".");
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  try {
    const passwordFethc = await fetch(
      "http://localhost:3000/MercadilloBucaramanga/Restablecer",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Password: password.value,
          UserName: tokenPayload.userName,
        }),
      }
    );
    if (!passwordFethc.ok) {
      throw new Error("La solicitud no fue exitosa");
    }

    const data = await passwordFethc.json();

    setTimeout(() => {
      window.location.href = data.redirect;
    }, 2000);
    notificacion.textContent = "Contraseña cambiada con exito";
  } catch (error) {
    mensajeError.classList.toggle("escondido", false);
  }
}

btnCambiar.addEventListener("click", (e) => {
  actualizar(e);
});
