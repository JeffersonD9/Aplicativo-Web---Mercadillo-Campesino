import { convertirUpperCamelCase } from "../js/upperCamelCase.js";
import { expresiones, getCookie } from "./expresiones.js";
import {
  eliminarErrores,
  activarModalCrear,
  desactivarModalCrear,
  desactivarModalEliminar,
  activarModalEliminar,
} from "../js/modal.js";
import { load } from "../js/dataTabla.js";
load();

const descripcion = document.querySelector("#descripcionProducto");
const precio = document.querySelector("#precio");
const presentacion = document.querySelector("#presentacion");
const formProducto = document.querySelector("form");

const selectDisponibilidad = document.querySelector(".select-disponibilidad");
const disponibilidad = document.querySelectorAll("#disponibilidad");
const fileInput = document.querySelector("#imagenProducto");

const categoria = document.querySelector(".select-categoria");
const select = document.querySelectorAll("#categoria");
const inputs = document.querySelectorAll(" #formulario input");

const btnModalCrearCerrar = document.querySelector(".btnModalCrearCerrar");
const btnCrear = document.querySelector("#btn-crear");

const btnModalEliminar = document.querySelector(".btnModalEliminar");


let notificacion = document.getElementById("notificacion");
let notificacionLlenarCampos = document.getElementById(
  "notificacionLlenarCampos"
);
let idFila;
let filaTabla;
let idProducto;
let opcion = "";
let idForm = 0;
let boolDisponibilidad;
let id_categoria;

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


let campos = {
  nombreProducto: false,
  descripcionProducto: false,
  disponibilidad: false,
  precio: false,
  presentacion: false,
  categoria: false,
};

// Manejar el evento de cambio en el select
let categoriaSeleccionada;
categoria.addEventListener("change", function () {
  // Obtener el índice de la opción seleccionada
  var selectedIndex = categoria.selectedIndex;
  // Obtener el texto de la opción seleccionada
  categoriaSeleccionada = categoria.options[selectedIndex].text;
});

// Manejar el evento de cambio en el select
let disponibilidadSeleccionado;
selectDisponibilidad.addEventListener("change", function () {
  // Obtener el índice de la opción seleccionada
  var selectedIndex = selectDisponibilidad.selectedIndex;
  // Obtener el texto de la opción seleccionada
  disponibilidadSeleccionado = selectDisponibilidad.options[selectedIndex].text;
  // Mostrar el texto seleccionado en la consola (puedes usarlo como necesites)

});

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "nombreProducto":
      validarCampo(expresiones.nombreProducto, e.target, "nombreProducto");
      break;
    case "descripcionProducto":
      validarCampo(
        expresiones.descripcionProducto,
        e.target,
        "descripcionProducto"
      );
      break;
    case "precio":
      validarCampo(expresiones.precio, e.target, "precio");
      break;
    case "presentacion":
      validarCampo(expresiones.presentacion, e.target, "presentacion");
      break;

    case "disponibilidad":
      if (e.target.value === expresiones.disponibilidad) {
        document
          .querySelector(`#grupo_disponibilidad .formulario__input-error`)
          .classList.add("formulario__input-error-activo");
        campos["disponibilidad"] = false;
      } else {
        document
          .querySelector(`#grupo_disponibilidad .formulario__input-error`)
          .classList.remove("formulario__input-error-activo");
        campos["disponibilidad"] = true;
      }

      break;

    case "categoria":
      if (e.target.value === expresiones.categoriaCatalogo) {
        document
          .querySelector(`#grupo_categoria .formulario__input-error`)
          .classList.add("formulario__input-error-activo");
        campos["categoria"] = false;
      } else {
        document
          .querySelector(`#grupo_categoria .formulario__input-error`)
          .classList.remove("formulario__input-error-activo");
        console.log("aca nombre catalogo");
        console.log(campos);
        campos["categoria"] = true;
      }
      break;
  }
};

//Validar los campos Nombre-Apellido-Usuario-Email
const validarCampo = (expresion, input, campo) => {
  console.log(input);
  if (expresion.test(input.value.trim())) {
    //Verificar si cumple con al expresion regular
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

//asignmos el evento para cada input
inputs.forEach((input) => {
  console.log(input);
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

selectDisponibilidad.addEventListener("click", validarFormulario);
selectDisponibilidad.addEventListener("click", () => {
  disponibilidad.forEach((e) => {
    boolDisponibilidad =  parseInt(e.value);
  });
});

categoria.addEventListener("click", validarFormulario);
categoria.addEventListener("click", () => {
  select.forEach((e) => {
    id_categoria = e.value;
  });
});

btnCrear.addEventListener("click", () => {
  formProducto.reset();
  eliminarErrores();
  activarModalCrear();
  campos["nombreProducto"] = false;
  campos["descripcionProducto"] = false;
  campos["disponibilidadProducto"] = false;
  campos["precioProducto"] = false;
  campos["presentacionProducto"] = false;
  campos["selectCategoria"] = false;
  campos["imagen"] = false;

  notificacionLlenarCampos.innerHTML = ``;
  opcion = "crear";
});      

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-actualizar-producto")) {
    notificacionLlenarCampos.innerHTML = ``;
    eliminarErrores();
    const fila = e.target.parentNode.parentNode;
    idForm = fila.children[0].innerHTML; //traer el indice de la tabla
    idFila = fila;
    nombreProducto.value = fila.children[1].innerHTML; //traer el producto de la tabla
    descripcion.value = fila.children[2].innerHTML; //traer el producto de la tabla

    for (let i = 0; i < selectDisponibilidad.options.length; i++) {
      //seleccionar disponibilidad dependiendo la fila
      if (selectDisponibilidad.options[i].text === fila.children[3].innerHTML) {
        // Establecer la opción como seleccionada en el form
        selectDisponibilidad.selectedIndex = i;
        break;
      }
    }

    precio.value = fila.children[4].innerHTML; 


    for (let i = 0; i < categoria.options.length; i++) {
      //seleccionar disponibilidad dependiendo la fila
      if (categoria.options[i].text === fila.children[5].innerHTML) {
        // Establecer la opción como seleccionada en el form
        categoria.selectedIndex = i;
        break;
      }
    }

    presentacion.value = fila.children[6].innerHTML; 
    opcion = "actualizar";
    activarModalCrear();
  }
});



document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar-producto")) {
    filaTabla = e.target.parentNode.parentNode;
    idFila = filaTabla.firstElementChild.innerHTML;
    const nombreProducto = filaTabla.children[1].innerHTML;
    activarModalEliminar(nombreProducto);
  }
});









async function actualizarOCrearProducto() {
const nombreProducto = document.getElementById("nombreProducto").value.trim()
  if (opcion === "crear") {
    try {

      const precioProducto = parseFloat(precio.value);
      const archivo = fileInput.files[0];
      const formData = new FormData();
      formData.append("Nombre", convertirUpperCamelCase(nombreProducto.trim()));
      formData.append("Descripcion", descripcion.value.trim());
      formData.append("Disponibilidad", boolDisponibilidad);
      formData.append("Precio", precioProducto);
      formData.append("Presentacion", presentacion.value.trim());
      formData.append("id_Categoria", parseInt(id_categoria));
      formData.append("id_Usuario",parseInt(tokenPayload.id))
      formData.append("file", archivo);
    
      const producto = await fetch(
        "http://localhost:3000/MercadilloBucaramanga/Productos",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!producto.ok) {
        if (producto.status === 400) {
          throw new Error(`Catálogo ${nombreCatalogo} ya existe`);
        } else {
          throw new Error("La solicitud no fue exitosa");
        }
      }

      let productoJson = await producto.json();
      console.log("Productos ", productoJson)
      var nuevaFila = `
      <tr>
        <td>${productoJson.productos.id}</td>
        <td>${productoJson.productos.Nombre}</td>
        <td>${productoJson.productos.Descripcion}</td>
        <td>${productoJson.productos.Disponibilidad}</td>
        <td>${productoJson.productos.Precio}</td>
        <td>${productoJson.productos.Categoria}</td>
        <td>${productoJson.productos.Presentacion}</td>
        <td> <a  href="/${productoJson.productos.Imagen}" target="_blank"> <img class="img-vendedor-producto" src="/${productoJson.productos.Imagen}" alt="Imagen Producto"> </a> </td>
        <td>
          <a href="#" class="btn-actualizar-producto">Actualizar</a>
          <a href="#" class="btn-eliminar-producto">Eliminar</a>
        </td>
      </tr>
    `;
      // Agregar la nueva fila al final de la tabla
      $("#table tbody").prepend(nuevaFila);
      notificacionExitosa(productoJson);
      tiempoNotificacion();
    } catch (error) {
      notificacionAlerta(error)  
    }
  }


  if(opcion ==="actualizar"){

    try {

      const precioProducto = parseFloat(precio.value);
      const archivo = fileInput.files[0];
      const formData = new FormData();
      formData.append("Nombre", convertirUpperCamelCase(nombreProducto.trim()));
      formData.append("Descripcion", descripcion.value.trim());
      formData.append("Disponibilidad", boolDisponibilidad);
      formData.append("Precio", precioProducto);
      formData.append("Presentacion", presentacion.value.trim());
      formData.append("id_Categoria", parseInt(categoria.value || id_categoria));
      formData.append("id_Usuario",parseInt(tokenPayload.id))
      formData.append("id",parseInt(idForm))
      let src;
      if(fileInput.value ===""){ //valido en caso de que no haya ingresado un archivo tome el valor que antes tenia
        let td = idFila.cells[7];
        let img = td.querySelector("a img");
        src = img.getAttribute('src')
        src = src.substring(1);
        img.setAttribute('src', `/${src}`);

        formData.append("file",src)
        console.log("No se coloca imagen ", src)
      }else{

        formData.append("file", archivo);
      }
      

      const producto = await fetch(
        `http://localhost:3000/MercadilloBucaramanga/Productos/${idForm}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!producto.ok) {
          throw new Error("La solicitud no fue exitosa");
      }

      const data = await producto.json();
      console.log(data)
      idFila.cells[1].textContent = data.producto.Nombre;
      idFila.cells[2].textContent = data.producto.Descripcion;
      idFila.cells[3].textContent = disponibilidadSeleccionado || selectDisponibilidad.options[selectDisponibilidad.selectedIndex].text;
      idFila.cells[4].textContent = data.producto.Precio;
      idFila.cells[5].textContent = categoriaSeleccionada || categoria.options[categoria.selectedIndex].text;
      idFila.cells[6].textContent = data.producto.Presentacion;
      

      idFila.cells[7].textContent = "";

    // Crear elemento de enlace
    const enlace = document.createElement('a');
    enlace.href = `/${data.producto.Imagen}`;
    enlace.target = '_blank';
    // Crear el elemento de imagen
    const img = document.createElement('img');
    img.className = 'img-vendedor-producto';
    img.src = `/${data.producto.Imagen}`;
    img.alt = 'Imagen Producto';

     // Añade la imagen al enlace
     enlace.appendChild(img);

      // Añade el enlace a la celda
      idFila.cells[7].appendChild(enlace);


      notificacionExitosa(data);
      tiempoNotificacion();
    } catch (error) {
      notificacionAlerta(error)    
    }
  }
}

btnModalEliminar.addEventListener("click", () => {
  eliminarCatalogo();
});



async function eliminarCatalogo() {
  desactivarModalEliminar();
  try {
    const producto = await fetch(
      `http://localhost:3000/MercadilloBucaramanga/Productos/${idFila}`,
      {
        method: "DELETE",
      }
    );

    if (!producto.ok) {
        throw new Error("El Producto no se puede eliminar");
    }
    const data = await producto.json();

      filaTabla.parentNode.removeChild(filaTabla); //Elimina la fila
      notificacionExitosa(data);
      tiempoNotificacion();
  } catch (error) {
    notificacionAlerta(error)    
  }
}






btnModalEliminar.addEventListener("click", () => {
  desactivarModalCrear();
});

//cerrar el modal crear producto cuando de cancelar
btnModalCrearCerrar.addEventListener("click", desactivarModalCrear);

formProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const elementoConClase = document.querySelector(".formulario__input-error-activo");
  if(categoria.value !=="" && descripcion.value!=="" && precio.value !=="" && presentacion.value !=="" && selectDisponibilidad.value!=="" && categoria.value !=="" && elementoConClase === null ){
    console.log("Categoria ", categoria.value)
    campos.nombreProducto= true
    campos.descripcionProducto= true
    campos.categoria= true
    campos.disponibilidad= true
    campos.precio= true
    campos.presentacion= true
  
  }  

  if(campos.descripcionProducto && campos.disponibilidad && campos.categoria && campos.nombreProducto && campos.presentacion && campos.precio ){
       actualizarOCrearProducto();
       desactivarModalCrear();
      }else{
        notificacionLlenarCampos.classList.remove("d-none");
        notificacionLlenarCampos.classList.add("alert-danger","d-block");
        notificacionLlenarCampos.innerHTML = `Debe llenar todos los campos`;
      }
});
