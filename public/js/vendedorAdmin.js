
const btnModalEliminar = document.querySelector(".btnModalEliminar");
const btnClose = document.querySelector(".btn-close");
let notificacion = document.getElementById("notificacion");
let idUsuarioAEliminar = null;
let filaAEliminar = null;

const modalEliminar = new bootstrap.Modal(document.getElementById("eliminarModal"));

// Función mejorada para manejar el tiempo de notificación
function tiempoNotificacion() {
  // Asegurarse que la notificación esté visible
  notificacion.classList.remove("d-none");
  notificacion.classList.add("d-block");
  
  // Ocultar después de 3 segundos con animación
  setTimeout(() => {
    notificacion.classList.add("fade-out"); // Nueva clase CSS para la animación
    
    setTimeout(() => {
      resetNotificacion(); // Limpiar completamente la notificación
    }, 500); // Duración de la animación
  }, 2500); // Tiempo visible antes de empezar a ocultar
}

// Función para limpiar completamente la notificación
function resetNotificacion() {
  notificacion.classList.remove("d-block", "fade-out", "alert-success", "alert-danger");
  notificacion.classList.add("d-none");
  notificacion.textContent = "";
  notificacion.style.opacity = "1"; // Restablecer opacidad por si acaso
}

// Funciones de notificación modificadas
function notificacionExitosa(data) {
  resetNotificacion();
  notificacion.classList.remove("d-none", "alert-danger");
  notificacion.classList.add("d-block", "alert-success");
  notificacion.textContent = data.message;
  tiempoNotificacion();
}

function notificacionAlerta(data) {
  resetNotificacion();
  notificacion.classList.remove("d-none", "alert-success");
  notificacion.classList.add("d-block", "alert-danger");
  notificacion.textContent = data.message;
  tiempoNotificacion();
}




async function eliminarUsuario() {
  if (!idUsuarioAEliminar || !filaAEliminar) return;

  try {
    const response = await fetch(`http://localhost:3000/MercadilloBucaramanga/Admin/Usuarios/delete/${idUsuarioAEliminar}`, {
      method: "DELETE",
    });

    const json = await response.json();

    if (response.ok) {
      filaAEliminar.remove();
      notificacionExitosa(json);
      tiempoNotificacion();
    } else {
      notificacionAlerta({ message: "Error al eliminar el usuario" });
    }
  } catch (error) {
    console.error(error);
    notificacionAlerta({ message: "Error al realizar la solicitud" });
  }

  desactivarModalEliminar();
  idUsuarioAEliminar = null;
  filaAEliminar = null;
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar-usuario")) {
    const fila = e.target.closest("tr");
    const id = fila.querySelector("td:first-child").textContent;
    const nombreUsuario = fila.querySelector("td:nth-child(2)").textContent;
    
    idUsuarioAEliminar = id;
    filaAEliminar = fila;

    activarModalEliminar(nombreUsuario);
  }
});

function activarModalEliminar(nombreUsuario) {
  const eliminarModalLabel = document.querySelector("#eliminarModal .modal-title");
  if (eliminarModalLabel) {
    eliminarModalLabel.textContent = `¿Eliminar al usuario ${nombreUsuario}?`;
  }
  modalEliminar.show();
}

function desactivarModalEliminar() {
  modalEliminar.hide();
}

// Validación por si los botones no están en el DOM
if (btnModalEliminar) {
  btnModalEliminar.addEventListener("click", eliminarUsuario);
}

if (btnClose) {
  btnClose.addEventListener("click", desactivarModalEliminar);
}





// Modal de actualización
const modalActualizar = new bootstrap.Modal(document.getElementById('actualizarModal'));
let usuarioActual = null;

// Manejar clic en botón de actualizar
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-actualizar-usuario')) {
        const fila = e.target.closest('tr');
        usuarioActual = {
            id: fila.querySelector('td:first-child').textContent,
            nombres: fila.querySelector('td:nth-child(2)').textContent,
            apellidos: fila.querySelector('td:nth-child(3)').textContent,
            email: fila.querySelector('td:nth-child(4)').textContent,
            celular: fila.querySelector('td:nth-child(5)').textContent
        };
        
        // Llenar el modal con los datos actuales
        document.getElementById('usuarioIdActualizar').value = usuarioActual.id;
        document.getElementById('nombresActualizar').value = usuarioActual.nombres;
        document.getElementById('apellidosActualizar').value = usuarioActual.apellidos;
        document.getElementById('emailActualizar').value = usuarioActual.email;
        document.getElementById('celularActualizar').value = usuarioActual.celular;
    }
    
    // Manejar actualización de campos individuales
    if (e.target.classList.contains('btn-actualizar-campo')) {
        const campo = e.target.getAttribute('data-campo');
        const valor = document.getElementById(`${campo.toLowerCase()}Actualizar`).value;
        actualizarCampoUsuario(usuarioActual.id, campo, valor);
    }
});




// Función para actualizar un campo específico
async function actualizarCampoUsuario(id, campo, valor) {
  try {
      const response = await fetch(`http://localhost:3000/MercadilloBucaramanga/Admin/Usuarios/update/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ [campo]: valor })
      });

      const json = await response.json();

      if (response.ok) {
          notificacionExitosa(json);
          tiempoNotificacion();
          // Recargar los datos o actualizar la fila específica
          setTimeout(() => location.reload(), 1000);
      } else {
          notificacionAlerta(json);
      }
  } catch (error) {
      console.error(error);
      notificacionAlerta({ message: 'Error al actualizar el campo' });
  }
}