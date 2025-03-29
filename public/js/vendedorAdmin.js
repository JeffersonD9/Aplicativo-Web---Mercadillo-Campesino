import {load} from "../js/dataTabla.js";
load();
  
  const btnModalEliminar = document.querySelector(".btnModalEliminar");
  const btnModalCerrar = document.querySelector(".btnModalCerrar");
  const btnClose = document.querySelector(".btn-close");
  let notificacion = document.getElementById("notificacion");
  let idUsuarioAEliminar = null;
  let filaAEliminar = null;

  const modalEliminar = new bootstrap.Modal(
    document.getElementById("eliminarModal")
  );

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

  async function eliminarUsuario() {
    desactivarModalEliminar();
    if (!idUsuarioAEliminar || !filaAEliminar) return;

    try {
      const response = await fetch(`http://localhost:3000/MercadilloBucaramanga/Admin/Usuarios/${idUsuarioAEliminar}`, {
        method: "DELETE",
      });

      let json = await response.json();

      if (response.ok) {
        filaAEliminar.parentNode.removeChild(filaAEliminar); // Elimina la fila
        notificacionExitosa(json);
        tiempoNotificacion();
      } else {
        notificacionAlerta('Error al eliminar el usuario');
      }
    } catch (error) {
      notificacionAlerta('Error al realizar la solicitud:', error);
    }

    idUsuarioAEliminar = null;
    filaAEliminar = null;
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar-usuario")) {
      const fila = e.target.closest('tr');
      const id = fila.firstElementChild.innerHTML;
      const nombreUsuario = fila.children[1].innerHTML;

      idUsuarioAEliminar = id;
      filaAEliminar = fila;

      activarModalEliminar(id, nombreUsuario);
    }
  });

  function activarModalEliminar(id, nombreUsuario) {
    const eliminarModalLabel = document.getElementById("eliminarModalLabel");
    eliminarModalLabel.textContent = `Está seguro de Eliminar Usuario ${nombreUsuario}`;
    modalEliminar.show();
  }

  function desactivarModalEliminar() {
    modalEliminar.hide();
  }

  btnModalEliminar.addEventListener("click", eliminarUsuario);
  btnModalCerrar.addEventListener("click",desactivarModalEliminar);
  btnClose.addEventListener("click",desactivarModalEliminar);
