const eliminarModalLabel = document.querySelector("#eliminarModalLabel");
const formP = document.querySelectorAll("form p");

const modalCrear = new bootstrap.Modal(document.getElementById("modalCrear"));
const modalEliminar = new bootstrap.Modal(
  document.getElementById("eliminarModal")
);


export function activarModalCrear() {
  modalCrear.show();
}

export function activarModalEliminar(nombre) {
  modalEliminar.show();
  eliminarModalLabel.textContent = `Esta seguro de Eliminar ${nombre}`;
}

export function desactivarModalCrear() {
  modalCrear.hide();
}

export function desactivarModalEliminar() {
  modalEliminar.hide();
}

//Elimna los errores de etiqueta p del formulario
export function eliminarErrores() {
  formP.forEach((e) => {
    e.classList.remove("formulario__input-error-activo");
    e.classList.add("formulario__input-error");
  });
}
