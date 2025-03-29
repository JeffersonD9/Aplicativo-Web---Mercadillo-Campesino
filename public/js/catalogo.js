import { convertirUpperCamelCase } from "../js/upperCamelCase.js";
import {
  eliminarErrores,
  activarModalCrear,
  desactivarModalCrear,
  desactivarModalEliminar,
  activarModalEliminar,
} from "../js/modal.js";
import { expresiones, getCookie } from "./expresiones.js";
import { load } from "../js/dataTabla.js";
load();

const btnModalCerrar = document.querySelector(".btnModalCerrar");
let notificacion = document.getElementById("notificacion");
const btnCrear = document.querySelector("#btn-crear");
const formCatalogo = document.querySelector("form");
const catalogo = document.querySelector("#catalogo");
const btnModalEliminar = document.querySelector(".btnModalEliminar");

let notificacionLlenarCampos = document.getElementById(
  "notificacionLlenarCampos"
);

let idCatalogo;
let opcion = "";
let idForm = 0;
let idFila;
let filaTabla;

const token = getCookie("token");
const arrayToken = token.split(".");
const tokenPayload = JSON.parse(atob(arrayToken[1]));


function tiempoNotificacion() {
  setTimeout(() => {
    notificacion.classList.add("d-none");
    notificacion.textContent = "";
  }, 3000);
}

function notificacionExitosa(data) {
  notificacion.classList.remove("alert-danger", "d-none");
  notificacion.classList.add("alert-success", "d-block");
  notificacion.textContent = data.message;
}

function notificacionAlerta(data) {
  notificacion.classList.remove("alert-success", "d-none");
  notificacion.classList.add("alert-danger", "d-block");
  notificacion.textContent = data.message;
}

btnModalCerrar.addEventListener("click", desactivarModalCrear);

let campos = {
  nombreCatalogo: false,
};

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "catalogo":
      console.log(e.target.value.trim());
      if (!expresiones.catalogo.test(e.target.value.trim())) {
        document
          .querySelector(`#grupo_catalogo .formulario__input-error`)
          .classList.add("formulario__input-error-activo");
        campos["nombreCatalogo"] = false;
      } else {
        document
          .querySelector(`#grupo_catalogo  .formulario__input-error`)
          .classList.remove("formulario__input-error-activo");
        campos["nombreCatalogo"] = true;
      }

      break;
  }
};

/*Validar el input nombre catalogo*/
catalogo.addEventListener("keyup", validarFormulario);
catalogo.addEventListener("click", validarFormulario);

//borro los valores de los inputs y errores del formulario
btnCrear.addEventListener("click", () => {
  formCatalogo.reset();
  eliminarErrores();
});

async function actualizarOCrear() {
  const nombreCatalogo = document.querySelector("#catalogo").value.trim();
  if (opcion === "crear") {
    try {
      const catalogo = await fetch(
        "http://localhost:3000/MercadilloBucaramanga/Admin/Catalogos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nombre: convertirUpperCamelCase(nombreCatalogo),
            id_Admin: tokenPayload.id,
          }),
        }
      );

      if (!catalogo.ok) {
        if (catalogo.status === 400) {
          throw new Error(`Catálogo ${nombreCatalogo} ya existe`);
        } else {
          throw new Error("La solicitud no fue exitosa");
        }
      }
      const data = await catalogo.json();
      var nuevaFila = `
      <tr>
        <td>${data.catalogo.id}</td>
        <td>${data.catalogo.Nombre}</td>
        <td>
          <a href="#" class="btn-actualizar-catalogo">Actualizar</a>
          <a href="#" class="btn-eliminar-catalogo">Eliminar</a>
        </td>
      </tr>
    `;

      // Agregar la nueva fila al final de la tabla
      $("#table tbody").prepend(nuevaFila);
      notificacionExitosa(data);
      tiempoNotificacion();
    } catch (error) {
      console.log("Error ", error);
    }
  }

  if (opcion == "actualizar") {
    try {
      const catalogo = await fetch(
        `http://localhost:3000/MercadilloBucaramanga/Admin/Catalogos/${idForm}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nombre: convertirUpperCamelCase(nombreCatalogo),
            id_Admin: tokenPayload.id,
            id: parseInt(idForm),
          }),
        }
      );

      if (!catalogo.ok) {
        if (catalogo.status === 400) {
          console.log(nombreCatalogo.value)
          throw new Error(`Catalogo ${nombreCatalogo} ya existe`);
        } else {
          throw new Error("La solicitud no fue exitosa");
        }
      }
      const data = await catalogo.json();
      idFila.cells[1].textContent = data.catalogo.Nombre;
      notificacionExitosa(data);
      tiempoNotificacion();
    } catch (error) {
      notificacionAlerta(error)    
    }
  }
}


async function eliminarCatalogo() {
  desactivarModalEliminar();
  try {
    const catalogo = await fetch(
      `http://localhost:3000/MercadilloBucaramanga/Admin/Catalogos/${idFila}`,
      {
        method: "DELETE",
      }
    );

    if (!catalogo.ok) {
        throw new Error("El cátalogo no se puede eliminar");
    }
    const data = await catalogo.json();

      filaTabla.parentNode.removeChild(filaTabla); //Elimina la fila
      notificacionExitosa(data);
      tiempoNotificacion();
  } catch (error) {
    notificacionAlerta(error)    
  }
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar-catalogo")) {
    filaTabla = e.target.parentNode.parentNode;
    idFila = filaTabla.firstElementChild.innerHTML;
    const nombreCatalogo = filaTabla.children[1].innerHTML;
    activarModalEliminar(nombreCatalogo);
  }
});



btnModalEliminar.addEventListener("click", () => {
  eliminarCatalogo();
});



formCatalogo.addEventListener("submit", (e) => {
  e.preventDefault();
  const elementoConClase = document.querySelector(".formulario__input-error-activo");
  if(catalogo.value !=="" && elementoConClase === null ){
    campos.nombreCatalogo= true
  }

  if (campos.nombreCatalogo) {
    actualizarOCrear();
    desactivarModalCrear();
  } else {
    notificacionLlenarCampos.classList.remove("d-none");
    notificacionLlenarCampos.classList.add("alert-danger", "d-block");
    notificacionLlenarCampos.innerHTML = `Verifique que todos los campos esten bien llenados`;
  }
});

btnCrear.addEventListener("click", () => {
  formCatalogo.reset();
  eliminarErrores();
  activarModalCrear();
  campos["nombreCatalogo"] = false;
  notificacionLlenarCampos.innerHTML = ``;
  opcion = "crear";
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-actualizar-catalogo")) {
    notificacionLlenarCampos.innerHTML = ``;
    eliminarErrores();
    const fila = e.target.parentNode.parentNode;
    idForm = fila.children[0].innerHTML; //traer el indice de la tabla
    idFila = fila;
    catalogo.value = fila.children[1].innerHTML; //traer el catalogo de la tabla
    opcion = "actualizar";
    activarModalCrear();
  }
});
