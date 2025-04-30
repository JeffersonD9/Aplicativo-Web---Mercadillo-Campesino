import { expresiones } from "./expresiones.js";
import { convertirUpperCamelCase } from "./upperCamelCase.js";

const formulario = document.querySelector("#formulario");
const inputs = document.querySelectorAll(" #formulario input");
let notificacion = document.getElementById("notificacion");
const fileInput = document.querySelector("#imagen");


const campos = {
  username: false,
  nombre: false,
  password: false,
  email: false,
  apellido: false,
  celular: false,
  imagen: false,
};

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "nombre":
      validarCampo(expresiones.nombre, e.target, "nombre");
      break;
    case "username":
      validarCampo(expresiones.username, e.target, "username");
      break;
    case "apellido":
      validarCampo(expresiones.apellido, e.target, "apellido");
      break;
    case "email":
      validarCampo(expresiones.email, e.target, "email");
      break;
    case "password":
      validarCampo(expresiones.password, e.target, "password");
      break;
    case "celular":
      validarCampo(expresiones.celular, e.target, "celular");
      break;
    case "imagen":
      let archivo = fileInput.files[0];
      if (archivo) {
        //Verificar si cumple con al expresion regular
        document
          .querySelector(`#grupo_imagen .formulario__input-error`)
          .classList.remove("formulario__input-error-activo");
        agregarIconoCorrecto("imagen"); //Agregamos el icono check
      } else {
        document
          .querySelector(`#grupo_imagen .formulario__input-error`)
          .classList.add("formulario__input-error-activo");
        agregarIconoError(imagen); //Agregamos el icono x
      }

      break;
  }
};

function agregarIconoCorrecto(campo) {
  document.getElementById(`grupo_${campo}`).classList.remove("icono-error");
  document.querySelector(`#grupo_${campo}`).classList.add("icono-correcto");
  document
    .querySelector(`#grupo_${campo}  i`)
    .classList.add("bi-check-circle-fill");
  document
    .querySelector(`#grupo_${campo}  i`)
    .classList.remove("bi-x-circle-fill");
}
function agregarIconoError(campo) {
  document.getElementById(`grupo_${campo}`).classList.remove("icono-correcto");
  document.querySelector(`#grupo_${campo}`).classList.add("icono-error");
  document
    .querySelector(`#grupo_${campo}  i`)
    .classList.add("bi-x-circle-fill");
  document
    .querySelector(`#grupo_${campo}  i`)
    .classList.remove("bi-check-circle-fill");
}

//Validar los campos Nombre-Apellido-Usuario-Email
const validarCampo = (expresion, input, campo) => {
  if (expresion.test(input.value.trim()) ) {
    //Verificar si cumple con al expresion regular

    document
      .querySelector(`#grupo_${campo} .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
    agregarIconoCorrecto(campo); //Agregamos el icono check
    campos[campo] = true;
  } else {
    document
      .querySelector(`#grupo_${campo} .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
    agregarIconoError(campo); //Agregamos el icono x
    campos[campo] = false;
  }
};

//asignmos el evento para cada input
inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

//Funcion para registrar los usuarios
async function registrarUsuario(e) {
  e.preventDefault();
  const Nombres = document.getElementById("nombre").value.trim();
  //Nombres = convertirUpperCamelCase(Nombres);
  const Apellidos = document.getElementById("apellido").value.trim();
  //Apellidos = convertirUpperCamelCase(Apellidos);
  const UserName = document.getElementById("username").value.trim();
  const Email = document.getElementById("email").value.trim();
  const Password = document.getElementById("password").value.trim();
  const Celular = document.getElementById("celular").value.trim();

  try {
    const formData = new FormData();
    formData.append("Nombres", Nombres);
    formData.append("Apellidos", Apellidos);
    formData.append("UserName", UserName);
    formData.append("Email", Email);
    formData.append("Password", Password);
    formData.append("Celular", Celular);

    formData.append("file", fileInput.files[0]);
    
    console.log(formData);
    const registroFetch = await fetch(
      "http://localhost:3000/MercadilloBucaramanga/Registrar",
      {
        method: "POST",
        body: formData,
      }
    );
    let json = await registroFetch.json();
    if (registroFetch.ok) {
      //si los datos fueron enviados correctamente
      notificacion.classList.remove("alert-danger", "d-none");
      notificacion.classList.add("alert-success", "d-block");

      notificacion.textContent = "Usuario Registrado"; //mostramos en la vista

      formulario.reset(); //Eliminar los valores del formulario
      document.querySelectorAll(".icono-correcto").forEach((icono) => {
        icono.classList.remove("icono-correcto"); //eliminar la clase
      });

      setTimeout(() => {
        notificacion.classList.add("d-none");
        notificacion.textContent = "";

        window.location.href = json.redirect;
      }, 2000);
    } else {
      //si el usuario no se registró correctamente
      notificacion.classList.remove("alert-success", "d-none");
      notificacion.classList.add("alert-danger", "d-block");
      notificacion.textContent = `${json.error.message}`;

      //agregar el icono error para el usuario o email
      if (json.error.details === "Usuario_UserName_key") {
        agregarIconoError("username");
      }
      if (json.error.details === "Usuario_Email_key") {
        agregarIconoError("email");
      }
    }
  } catch (error) {
    notificacion.textContent = `${error}`;
  }
}

//Evento cuando se da click en el boton registrar
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  //Validamos que los campos se encuentre llenos
  if (
    campos.username &&
    campos.nombre &&
    campos.password &&
    campos.email &&
    campos.apellido &&
    campos.celular
  ) {
    registrarUsuario(e);
  } else {
    //inputs no llenados
    notificacion.classList.remove("d-none");
    notificacion.classList.add("alert-danger", "d-block");
    notificacion.innerHTML = `Debe llenar todos los campos`;

    inputs.forEach((e) => {
      let prueba = document.querySelector(`#grupo_${e.name}`);
      if (!prueba.classList.contains("icono-correcto")) {
        agregarIconoError(e.name);
      }
    });
  }
});
