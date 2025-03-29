import { expresiones } from "./expresiones.js";
import { getCookie } from "./expresiones.js";
const usuario = document.querySelector(".usuarioAdmin");
const celular = document.querySelector(".celular");
const correo = document.querySelector(".correo");
const password = document.querySelector(".password");
const btnActivar = document.querySelector(".btn-activar");
const btnActualizarCampos = document.querySelector(".btnActualizarCampos");
const inputs = document.querySelectorAll(" #formulario input");
let notificacion = document.getElementById("notificacion");

const token = getCookie("token");

function desactivarCampos() {
  celular.disabled = true;
  usuario.disabled = true;
  correo.disabled = true;
  password.disabled = true;
  btnActualizarCampos.disabled = true;
}

function activarCampos() {
  celular.disabled = false;
  usuario.disabled = false;
  correo.disabled = false;
  password.disabled = false;
  btnActualizarCampos.disabled = false;
}

btnActivar.addEventListener("click", (e) => {
  e.preventDefault();
  activarCampos();
  btnActivar.disabled = true
});

async function actualizar(e) {
  e.preventDefault();
  try {
    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    const admin = await fetch(
      `http://localhost:3000/MercadilloBucaramanga/Admin/${tokenPayload.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: correo.value,
          UserName: usuario.value,
          celular: celular.value,
          Password: password.value,
        }),
      }
    );

    const adminJson = await admin.json();

    if (admin.ok) {
        notificacion.classList.remove("alert-danger", "d-none");
        notificacion.classList.add("alert-success", "d-block");
        notificacion.textContent = "Actualizado"; //mostramos en la vista
     
        correo.value = adminJson.data.Email
        usuario.value = adminJson.data.UserName
        celular.value = adminJson.data.celular
        password.value = adminJson.data.Password

        desactivarCampos();
        btnActivar.disabled = false;
    } else {
    throw new Error("El usuario o email ya estan registrados");

    }
  } catch (error) {
    notificacion.classList.remove("alert-success", "d-none");
    notificacion.classList.add("alert-danger", "d-block");
    notificacion.textContent = `${error}`;
    
}
}

const campos = {
  usuarioAdmin: false,
  celular: false,
  correo: false,
  email: false,
  password: false,
  
};

const validarCampo = (expresion, input, campo) => {
  if (expresion.test(input.value.trim())) {
    document
      .querySelector(`#grupo_${campo} .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
    campos[campo] = true;
  } else {
    document
      .querySelector(`#grupo_${campo} .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
    campos[campo] = false;
  }
};

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "usuarioAdmin":
      console.log(e.target.name);
      validarCampo(expresiones.username, e.target, "usuarioAdmin");
      break;
    case "celular":
      validarCampo(expresiones.celular, e.target, "celular");
      break;
    case "correo":
      validarCampo(expresiones.email, e.target, "correo");
      break;
    case "password":
      validarCampo(expresiones.password, e.target, "password");
      break;
  }
};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});


btnActualizarCampos.addEventListener("click", (e) => {
    const elementoConClase = document.querySelector(".formulario__input-error-activo");
    if(password.value !=="" && usuario.value !=="" && celular.value !==""&& correo.value !==""  && elementoConClase === null ){
        campos.password = true,
        campos.usuarioAdmin = true,
        campos.correo = true,
        campos.celular = true
      }
  e.preventDefault();

    //Validamos que los campos se encuentre llenos
    if (
      campos.usuarioAdmin &&
      campos.celular &&
      campos.correo &&
      campos.password 
      
    ) {
      actualizar(e);
    } else {
      //inputs no llenados
     
      notificacion.classList.remove("d-none");
      notificacion.classList.add("alert-danger", "d-block");
      notificacion.innerHTML = `Verifique que todos los campos esten bien llenados`;
    }
  }
);

document.addEventListener("DOMContentLoaded", function () {
  // Desactivar los campos al cargar la página
  desactivarCampos();
  
});
