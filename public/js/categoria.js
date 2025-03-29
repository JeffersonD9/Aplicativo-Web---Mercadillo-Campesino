import { convertirUpperCamelCase } from "../js/upperCamelCase.js";
import {
  eliminarErrores,
  activarModalCrear,
  desactivarModalCrear,
  desactivarModalEliminar,
  activarModalEliminar
} from "../js/modal.js";
import { expresiones,getCookie } from "./expresiones.js";
import {load} from "../js/dataTabla.js";
load();



const catalogo = document.querySelector(".select-catalogo");
const select = document.querySelectorAll("#catalogo");
const url = "http://localhost:3000/MercadilloBucaramanga/Admin/Categorias/";
const btnModalCrearCerrar = document.querySelector(".btnModalCrearCerrar");
const btnModalEliminar = document.querySelector(".btnModalEliminar");
const btnModalEliminarCerrar = document.querySelector(".btnModalEliminarCerrar");

const token = getCookie("token");
const arrayToken = token.split(".");
const tokenPayload = JSON.parse(atob(arrayToken[1]));


let notificacion = document.getElementById("notificacion");
let notificacionLlenarCampos = document.getElementById(
  "notificacionLlenarCampos"
);
let idFila;
let filaTabla;


const formCategoria = document.querySelector("form");
let nombreCategoria = document.querySelector("#categoria");
const btnCrear = document.querySelector("#btn-crear");

let idCatalogo;
let opcion = "";
let idForm = 0;


let campos = {
  nombreDeCategoria: false,
  selectCatalogo: false,
};

// Manejar el evento de cambio en el select
let catalogoSeleccionado;
catalogo.addEventListener("change", function () {
  // Obtener el índice de la opción seleccionada
  var selectedIndex = catalogo.selectedIndex;

  // Obtener el texto de la opción seleccionada
  catalogoSeleccionado = catalogo.options[selectedIndex].text;

  
});

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "categoria":
     
      if (!expresiones.categoria.test(e.target.value.trim())) {
        document
          .querySelector(`#grupocategoria .formulario__input-error`)
          .classList.add("formulario__input-error-activo");
        campos["nombreDeCategoria"] = false;
      } else {
        document
          .querySelector(`#grupocategoria .formulario__input-error`)
          .classList.remove("formulario__input-error-activo");
        campos["nombreDeCategoria"] = true;
      }

      break;
    case "catalogo":
      if (e.target.value === expresiones.categoriaCatalogo) {
        document
          .querySelector(`#grupocatalogo .formulario__input-error`)
          .classList.add("formulario__input-error-activo");
        campos["selectCatalogo"] = false;
      } else {
        document
          .querySelector(`#grupocatalogo .formulario__input-error`)
          .classList.remove("formulario__input-error-activo");
        console.log("aca nombre catalogo");
        console.log(campos);
        campos["selectCatalogo"] = true;
      }
      break;
  }
};

/*Validar el input nombre categoria*/
nombreCategoria.addEventListener("keyup", validarFormulario);
nombreCategoria.addEventListener("click", validarFormulario);
catalogo.addEventListener("click", validarFormulario);

//cerrar el modal crear Categoria cuando de cancelar
btnModalCrearCerrar.addEventListener("click", desactivarModalCrear);

//cerrar el modal eliminar cuando se de cancelar
btnModalEliminarCerrar.addEventListener("click", desactivarModalEliminar)
catalogo.addEventListener("click", () => {
  select.forEach((e) => {
    idCatalogo = e.value;
  });
});

btnCrear.addEventListener("click", () => {
  formCategoria.reset();
  eliminarErrores();
  activarModalCrear();
  campos["selectCatalogo"] = false;
  campos["nombreDeCategoria"] = false;
  notificacionLlenarCampos.innerHTML = ``;
  opcion = "crear";
});

function eliminarCategoria() {
  desactivarModalEliminar();
  fetch(url + idFila, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La categoria no se puede eliminar");
      }
      return response.json();
    })
    .then((data) => {
      filaTabla.parentNode.removeChild(filaTabla); //Elimina la fila
      notificacionExitosa(data);
      tiempoNotificacion();
    })
    .catch((error) => {
      notificacionAlerta(error);  
    });
}


btnModalEliminar.addEventListener("click", () => {
  eliminarCategoria();
});


function notificacionAlerta(data) {
  notificacion.classList.remove("alert-success", "d-none");
  notificacion.classList.add("alert-danger", "d-block");
  notificacion.textContent = data.message;
}

function notificacionExitosa(data) {
  notificacion.classList.remove("alert-danger", "d-none");
  notificacion.classList.add("alert-success", "d-block");
  notificacion.textContent = data.message;
}

function tiempoNotificacion() {
  setTimeout(() => {
    notificacion.classList.add("d-none");
    notificacion.textContent = "";
  }, 3000);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar-usuario")) {
    filaTabla = e.target.parentNode.parentNode;
    idFila = filaTabla.firstElementChild.innerHTML;
    const nombreCategoria = filaTabla.children[1].innerHTML;
    activarModalEliminar(nombreCategoria);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-actualizar-usuario")) {
    eliminarErrores();
    const fila = e.target.parentNode.parentNode;
    idForm = fila.children[0].innerHTML; //traer el indice de la tabla
    idFila = fila;
    nombreCategoria.value = fila.children[1].innerHTML; //traer la categoria de la tabla
    for (let i = 0; i < catalogo.options.length; i++) {
      //seleccionar el catalogo dependiendo la fila
      if (catalogo.options[i].text === fila.children[2].innerHTML) {
        // Establecer la opción como seleccionada en el form
        catalogo.selectedIndex = i;
        break;
      }
    }
    opcion = "actualizar";
    notificacionLlenarCampos.innerHTML = ``;
    activarModalCrear();
  }
});

function actualizarOCrear() {
  if (opcion === "crear") {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre: convertirUpperCamelCase(nombreCategoria.value).trim(),
        id_Cat: parseInt(catalogo.value),
        id_Admin:tokenPayload.id
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error(
              `Categoria ${nombreCategoria.value} ya se encuentra registrada`
            );
          } else {
            throw new Error("La solicitud no fue exitosa");
          }
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        var nuevaFila = `
        <tr>
          <td>${data.categorias.id}</td>
          <td>${data.categorias.Nombre}</td>
          <td>${catalogoSeleccionado}</td>
          <td>
            <a href="#" class="btn-eliminar-usuario">Eliminar</a>
            <a href="#" class="btn-actualizar-usuario">Actualizar</a>
          </td>
        </tr>
      `;

        // Agregar la nueva fila al final de la tabla
        $("#table tbody").prepend(nuevaFila);

        notificacionExitosa(data);
        tiempoNotificacion();
      })
      .catch((error) => {
        notificacionAlerta(error);
      });
  }
  if (opcion == "actualizar") {
    fetch(url + idForm, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre: convertirUpperCamelCase(nombreCategoria.value).trim(),
        id_Cat: parseInt(catalogo.value),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error(`Categoria ${nombreCategoria.value} ya existe`);
          } else {
            throw new Error("La solicitud no fue exitosa");
          }
        }
        return response.json();
      })
      .then((data) => {
        idFila.cells[1].textContent = convertirUpperCamelCase(
          nombreCategoria.value
        ).trim();
        idFila.cells[2].textContent = catalogoSeleccionado;
        notificacionExitosa(data);
        tiempoNotificacion();
      })
      .catch((error) => {
        notificacionAlerta(error);
      });
  }
}

formCategoria.addEventListener("submit", (e) => {
  e.preventDefault();
  const elementoConClase = document.querySelector(".formulario__input-error-activo");
  if(nombreCategoria.value !=="" && select.value !=="" && elementoConClase === null ){
    campos.nombreDeCategoria= true;
    campos.selectCatalogo = true

  }
  if (campos.nombreDeCategoria && campos.selectCatalogo) {
    actualizarOCrear();
    desactivarModalCrear();
  } else {
    notificacionLlenarCampos.classList.remove("d-none");
    notificacionLlenarCampos.classList.add("alert-danger", "d-block");
    notificacionLlenarCampos.innerHTML = `Debe llenar todos los campos`;
  }
});

