const email = document.querySelector("#email");
const mensajeError = document.querySelector(".error");
const btnEnviar = document.querySelector(".btn-enviar");
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

email.addEventListener("keyup", eliminarError);
email.addEventListener("blur", eliminarError);

async function enviarEmail(e) {
    e.preventDefault();
    
    // Validar formato de email básico antes de enviar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        mostrarNotificacion(mensajeError, "Verifique que el correo sea correcto", true);
        return;
    }

    try {
        const emailFetch = await fetch(`http://localhost:3000/MercadilloBucaramanga/Restablecer/${email.value}`, {
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
                throw new Error("Verifique que el correo ingresado sea correcto");
            } else {
                throw new Error("La solicitud no fue exitosa");
            }
        }

        const data = await emailFetch.json();
        mostrarNotificacion(notificacion, "Correo enviado con éxito");

    } catch (error) {
        mostrarNotificacion(mensajeError, error.message, true);
    }
}

btnEnviar.addEventListener("click", (e) => {
    enviarEmail(e);
});