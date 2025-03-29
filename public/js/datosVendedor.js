import { expresiones } from "./expresiones.js";
import { getCookie } from "./expresiones.js";
import { convertirUpperCamelCase } from "../js/upperCamelCase.js";

const usuario = document.querySelector(".userName");
const nombre = document.querySelector(".nombre");
const apellido = document.querySelector(".apellido");
const celular = document.querySelector(".celular");
const correo = document.querySelector(".correo");
const password = document.querySelector(".password");
const btnActualizarCampos = document.querySelector(".btnActualizarCampos");
const btnActivar = document.querySelector(".btn-activar");
const inputs = document.querySelectorAll(" #formulario input");
let notificacion = document.getElementById("notificacion");
const fileInput = document.querySelector("#imagen");
const imagenText = document.querySelector("#imagenText");

const formVendedor = document.querySelector("form");

const token = getCookie("token");

const campos = {
  usuario: false,
  nombre: false,
  apellido: false,
  celular: false,
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
    case "userName":
      console.log(e.target.name);
      validarCampo(expresiones.username, e.target, "usuarioAdmin");
      break;
    case "nombre":
      validarCampo(expresiones.nombre, e.target, "nombre");
      break;
    case "email":
      validarCampo(expresiones.email, e.target, "email");
      break;

    case "apellido":
      validarCampo(expresiones.apellido, e.target, "apellido");
      break;
    case "celular":
      validarCampo(expresiones.celular, e.target, "celular");
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
  


function desactivarCampos() {
  imagen.disabled = true;
  apellido.disabled = true;
  nombre.disabled = true;
  celular.disabled = true;
  usuario.disabled = true;
  correo.disabled = true;
  password.disabled = true;
  btnActualizarCampos.disabled = true;
  imagenText.disabled = true;
}

function activarCampos() {
  imagen.disabled = false;
  apellido.disabled = false;
  nombre.disabled = false;
  celular.disabled = false;
  usuario.disabled = false;
  correo.disabled = false;
  password.disabled = false;
  btnActualizarCampos.disabled = false;
}

btnActivar.addEventListener("click", (e) => {
  e.preventDefault();
  activarCampos();
  btnActivar.disabled = true;
});

async function actualizar() {
  try {
    const archivo = fileInput.files[0];

    const formData = new FormData();
    formData.append("Nombre", convertirUpperCamelCase(nombre.value.trim()));
    formData.append("Usuario", usuario.value.trim());
    formData.append("Apellido", apellido.value.trim());
    formData.append("Celular", celular.value);
    formData.append("Email", correo.value.trim());
    formData.append("Password", password.value.trim());

    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    let textoImagen;
    if (fileInput.value === "") {
      //valido en caso de que no haya ingresado un archivo tome el valor que antes tenia
      textoImagen = imagenText.value;
      formData.append("file", textoImagen);
    } else {
      formData.append("file", archivo);
    }

    const vendedor = await fetch(
      `http://localhost:3000/MercadilloBucaramanga/Usuario/${tokenPayload.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    if (!vendedor.ok) {
      throw new Error("La solicitud no fue exitosa");
    }
    notificacion.classList.remove("alert-danger", "d-none");
    notificacion.classList.add("alert-success", "d-block");
    notificacion.textContent = "Actualizado"; //mostramos en la vista

    const data = await vendedor.json();
    nombre.textContent = data.userfound.Nombres;
    apellido.textContent = data.userfound.Apellidos;
    usuario.textContent = data.userfound.UserName;
    celular.textContent = data.userfound.Celular;
    correo.textContent = data.userfound.Email;
    password.textContent = data.userfound.Password;
    imagenText.value = data.userfound.Imagen;

    desactivarCampos();
    btnActivar.disabled = false;
  } catch (error) {
    notificacion.classList.remove("alert-success", "d-none");
    notificacion.classList.add("alert-danger", "d-block");
    notificacion.textContent = `${error}`;
  }
}

formVendedor.addEventListener("submit", (e) => {
  e.preventDefault();

  const elementoConClase = document.querySelector(".formulario__input-error-activo");
  if(password.value !=="" && apellido.value !=="" && nombre.value !=="" && usuario.value !=="" && celular.value !==""&& correo.value !==""  && elementoConClase === null ){
    campos.password = true,
    campos.usuario = true,
    campos.email = true,
    campos.celular = true
    campos.nombre = true
    campos.apellido = true
  }

  if(campos.apellido && campos.celular && campos.email && campos.password && campos.usuario && campos.nombre){
     actualizar();
  }else{
    notificacion.classList.remove("d-none");
    notificacion.classList.add("alert-danger", "d-block");
    notificacion.innerHTML = `Verifique que todos los campos esten bien llenados`;
  }
 
});

document.addEventListener("DOMContentLoaded", function () {
  // Desactivar los campos al cargar la página
  desactivarCampos();
});
