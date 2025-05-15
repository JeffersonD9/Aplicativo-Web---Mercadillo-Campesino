const password = document.querySelector("#password");
const mensajeError = document.querySelector(".error");
const btnCambiar = document.querySelector(".btn-cambiar");
const notificacion = document.querySelector(".notificacion");

function mostrarNotificacion(elemento, mensaje, esError = false) {
    elemento.textContent = mensaje;
    elemento.classList.remove("d-none");
    elemento.classList.toggle("alert-danger", esError);
    elemento.classList.toggle("alert-info", !esError);

    // Ocultar después de 5 segundos
    setTimeout(() => {
        elemento.classList.add("d-none");
    }, 5000);
}

function eliminarError() {
    mensajeError.classList.add("d-none");
}

password.addEventListener("keyup", eliminarError);
password.addEventListener("blur", eliminarError);

async function actualizar(e) {
    e.preventDefault();

    // Validar longitud de la contraseña
    if (password.value.length <= 8) {
        mostrarNotificacion(mensajeError, "La contraseña debe tener más de 8 caracteres", true);
        return;
    }

    var currentURL = window.location.href;
    var startIndex = currentURL.indexOf("Restablecer/") + "Restablecer/".length;
    var restablecerPart = currentURL.substring(startIndex);
    const arrayToken = restablecerPart.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    try {
        const passwordFetch = await fetch(
            "http://localhost:3000/MercadilloBucaramanga/Restablecer",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Password: password.value,
                    Email: tokenPayload.userName,
                }),
            }
        );

        if (!passwordFetch.ok) {
            throw new Error("Error al cambiar la contraseña");
        }

        const data = await passwordFetch.json();
        mostrarNotificacion(notificacion, "Contraseña cambiada con éxito");

        setTimeout(() => {
            window.location.href = "/MercadilloBucaramanga";
        }, 2000);

    } catch (error) {
        mostrarNotificacion(mensajeError, error.message, true);
    }
}

btnCambiar.addEventListener("click", (e) => {
    actualizar(e);
});