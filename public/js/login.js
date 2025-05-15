
const forminciarSesion = document.querySelector('[data-inicio-sesion]');
const inputs = document.querySelectorAll('[data-inicio-sesion] input');
const mensajeError = document.querySelector(".error");

//asignmos el evento para cada input
inputs.forEach((input) => {
  console.log(input)
  input.addEventListener("keyup", eliminarError);
  input.addEventListener("blur", eliminarError);
});


function eliminarError() {
  if (!mensajeError.classList.contains("escondido")) {
    mensajeError.classList.add("escondido");
  }
}

async function iniciarSesion(e) {
  e.preventDefault();
  let Email = (document.getElementById('email').value).trim();
  let Password = (document.getElementById('password').value).trim();
  console.log("ingreso acá")
  try {
    const registroInicio = await fetch(
      "http://localhost:3000/MercadilloBucaramanga/Login",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          Email,
          Password
        }),
      }
    );

    if (!registroInicio.ok) {
      if (registroInicio.status === 429) {
        mensajeError.textContent = "Has superado el número de intentos. Intenta de nuevo en 10 minutos.";
        console.log("Mensaje error 429:", mensajeError.textContent);
      } else {
        mensajeError.textContent = "Correo o contraseña incorrectos.";
      }
      mensajeError.classList.remove("escondido");
      return;
    }

    const jsonInicio = await registroInicio.json();
    window.location.href = jsonInicio.redirect;


  } catch (e) {
    console.log(e.message);
  }
}

forminciarSesion.addEventListener("submit", (e) => { iniciarSesion(e) });