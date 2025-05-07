import { getCookie } from "../expresiones.js";

// Configuración base
const API_BASE_URL = '/MercadilloBucaramanga';
const ADMIN_USUARIOS_URL = `${API_BASE_URL}/Admin/Usuarios`;
const MERCADILLOS_URL = `${API_BASE_URL}/api/mercadillos`;

// Elementos del DOM
const notificacion = document.getElementById("notificacion");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

// Modales
const modalEliminar = new bootstrap.Modal(document.getElementById("eliminarModal"));
const modalActualizar = new bootstrap.Modal(document.getElementById('actualizarModal'));
const modalCrear = new bootstrap.Modal(document.getElementById('crearCampesinoModal'));

// Variables de estado
let idUsuarioAEliminar = null;
let filaAEliminar = null;
let usuarioActual = null;
let mercadillosCache = [];


// Funciones de Notificación


function mostrarNotificacion(mensaje, tipo = "success") {
    notificacion.textContent = mensaje;
    notificacion.className = `alert alert-${tipo} d-block`;
    setTimeout(() => {
        notificacion.classList.add("fade");
        setTimeout(() => {
            notificacion.classList.remove("d-block", "fade");
            notificacion.textContent = "";
        }, 500);
    }, 3000);
}


// Funciones de Mercadillos
async function cargarMercadillos(selectId) {
    try {
        // Usar cache si está disponible
        if (mercadillosCache.length === 0) {
            const response = await fetch(MERCADILLOS_URL, {
                headers: {
                    'Authorization': `Bearer ${getCookie("token")}`
                }
            });
            
            if (!response.ok) throw new Error('Error al cargar mercadillos');
            mercadillosCache = await response.json();
        }
        
        const select = document.getElementById(selectId);
        
        // Limpiar opciones existentes excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Agregar nuevas opciones
        mercadillosCache.forEach(mercadillo => {
            const option = document.createElement('option');
            option.value = mercadillo.Id;
            option.textContent = mercadillo.Nombre;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error al cargar mercadillos:', error);
        mostrarNotificacion('Error al cargar la lista de mercadillos', 'danger');
    }
}


// Funciones CRUD Campesinos


async function crearCampesino() {
    const campesino = {
        Nombres: document.getElementById('nombresNuevo').value,
        Apellidos: document.getElementById('apellidosNuevo').value,
        Email: document.getElementById('emailNuevo').value,
        Celular: document.getElementById('celularNuevo').value,
        Id_Mercadillo: document.getElementById('mercadilloNuevo').value,
        Puesto: Number(document.getElementById('puestoNuevo').value),
        Password: document.getElementById('passwordNuevo').value,
        Roles: 2 // Rol para campesinos
    };

    try {
        const response = await fetch(`${ADMIN_USUARIOS_URL}/Registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify(campesino)
        });

        const data = await response.json();

        if (response.ok) {
            mostrarNotificacion(data.message || 'Campesino creado exitosamente');
            modalCrear.hide();
            setTimeout(() => location.reload(), 1500);
        } else {
            throw new Error(data.message || 'Error al crear campesino');
        }
    } catch (error) {
        console.error('Error al crear campesino:', error);
        mostrarNotificacion(error.message, 'danger');
    }
}


async function actualizarCampoIndividual(id, campo, valor) {
  try {
      // Para el campo Password, solo lo enviamos si tiene valor
      if (campo === 'Password' && !valor) {
          mostrarNotificacion('No se proporcionó nueva contraseña', 'info');
          return;
      }

      // Para el campo Puesto, convertimos a número
      if (campo === 'Puesto') {
          valor = Number(valor) || null;
      }

      const datos = { [campo]: valor };

      const response = await fetch(`${ADMIN_USUARIOS_URL}/edit/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie("token")}`
          },
          body: JSON.stringify(datos)
      });

      const data = await response.json();

      if (response.ok) {
          mostrarNotificacion(`Campo ${campo} actualizado exitosamente`);
          // Actualizar la fila en la tabla si es necesario
          setTimeout(() => location.reload(), 1000);
      } else {
          throw new Error(data.message || `Error al actualizar campo ${campo}`);
      }
  } catch (error) {
      console.error(`Error al actualizar campo ${campo}:`, error);
      mostrarNotificacion(error.message, 'danger');
  }
}

async function eliminarUsuario() {
  if (!idUsuarioAEliminar) {
      console.error("No hay ID de usuario para eliminar");
      return;
  }

  try {
      console.log(`Eliminando usuario con ID: ${idUsuarioAEliminar}`);
      
      const response = await fetch(`${ADMIN_USUARIOS_URL}/delete/${idUsuarioAEliminar}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${getCookie("token")}`
          }
      });

      const data = await response.json();

      if (response.ok) {
          mostrarNotificacion(data.message || 'Campesino eliminado exitosamente');
          filaAEliminar?.remove();
          
          // Cerrar el modal solo después de éxito
          modalEliminar.hide();
          
          // Recargar después de 1 segundo
          setTimeout(() => location.reload(), 1000);
      } else {
          throw new Error(data.message || 'Error al eliminar campesino');
      }
  } catch (error) {
      console.error('Error al eliminar campesino:', error);
      mostrarNotificacion(error.message, 'danger');
  } finally {
      idUsuarioAEliminar = null;
      filaAEliminar = null;
  }
}

async function toggleEstadoUsuario(id, nuevoEstado) {
    try {
        const response = await fetch(`${ADMIN_USUARIOS_URL}/edit/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({ Estado: nuevoEstado })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar estado');
        }
        return true;
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        mostrarNotificacion(error.message, 'danger');
        return false;
    }
}


// Funciones de Interfaz

function actualizarFilaEstado(fila, nuevoEstado) {
    fila.classList.toggle('table-secondary', !nuevoEstado);
    const btn = fila.querySelector('.btn-toggle-estado');
    
    if (nuevoEstado) {
        btn.classList.replace('btn-success', 'btn-warning');
        btn.textContent = 'Desactivar';
        btn.setAttribute('data-estado', 'activo');
    } else {
        btn.classList.replace('btn-warning', 'btn-success');
        btn.textContent = 'Activar';
        btn.setAttribute('data-estado', 'inactivo');
    }
}

async function abrirModalActualizar(campesino) {
  try {
      // Cargar mercadillos y esperar a que termine
      await cargarMercadillos('mercadilloActualizar');

      // Llenar formulario
      document.getElementById('idActualizar').value = campesino.id;
      document.getElementById('nombresActualizar').value = campesino.nombres;
      document.getElementById('apellidosActualizar').value = campesino.apellidos;
      document.getElementById('emailActualizar').value = campesino.email;
      document.getElementById('celularActualizar').value = campesino.celular;

      // Convertir puesto a número y manejar valores no válidos
      const puesto = Number(campesino.puesto);
      document.getElementById('puestoActualizar').value = isNaN(puesto) ? 0 : puesto;

      // Limpiar contraseña
      document.getElementById('passwordActualizar').value = '';

      // Seleccionar mercadillo actual
      if (campesino.idMercadillo) {
          document.getElementById('mercadilloActualizar').value = campesino.idMercadillo;
      }

      modalActualizar.show();
  } catch (error) {
      console.error('Error al abrir modal de actualización:', error);
      mostrarNotificacion('Error al preparar formulario de edición', 'danger');
  }
}


// Manejador de eventos para los botones de actualización individual
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-actualizar-campo')) {
      const btn = e.target;
      const campo = btn.getAttribute('data-campo');
      const id = document.getElementById('idActualizar').value;
      
      let valor;
      const inputId = `${campo.toLowerCase()}Actualizar`;
      
      // Manejar el caso especial del select de mercadillo
      if (campo === 'Id_Mercadillo') {
          valor = document.getElementById('mercadilloActualizar').value;
      } else {
          valor = document.getElementById(inputId).value;
      }

      if (!valor && campo !== 'Password') {
          mostrarNotificacion(`El campo ${campo} no puede estar vacío`, 'warning');
          return;
      }

      // Deshabilitar el botón durante la solicitud
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';

      actualizarCampoIndividual(id, campo, valor).finally(() => {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check"></i> Actualizar';
      });
  }
});



// Manejadores de Eventos

document.addEventListener("click", (e) => { 
    // Eliminar
    if (e.target.classList.contains("btn-eliminar-usuario")) {
        const fila = e.target.closest("tr");
        idUsuarioAEliminar = fila.querySelector("td:first-child").textContent;
        console.log(idUsuarioAEliminar);
        filaAEliminar = fila;
        
        document.querySelector("#eliminarModal .modal-title").textContent = 
            `¿Eliminar al campesino ${fila.querySelector("td:nth-child(2)").textContent}?`;
        
        modalEliminar.show();
    }
    
    // Editar
    else if (e.target.classList.contains('btn-actualizar-usuario')) {
        const fila = e.target.closest('tr');
        const campesino = {
            id: fila.querySelector('td:first-child').textContent,
            nombres: fila.querySelector('td:nth-child(2)').textContent,
            apellidos: fila.querySelector('td:nth-child(3)').textContent,
            email: fila.querySelector('td:nth-child(4)').textContent,
            celular: fila.querySelector('td:nth-child(5)').textContent,
            idMercadillo: fila.getAttribute('data-id-mercadillo'),
            puesto: fila.querySelector('td:nth-child(7)').textContent
          
        };
        console.log(campesino)
        
        abrirModalActualizar(campesino);
    }
    
    // Cambiar estado
    else if (e.target.classList.contains('btn-toggle-estado')) {
        const btn = e.target;
        const fila = btn.closest('tr');
        const id = fila.querySelector('td:first-child').textContent;
        const nuevoEstado = btn.getAttribute('data-estado') === 'activo' ? false : true;
        
        if (confirm(`¿Estás seguro de ${nuevoEstado ? 'activar' : 'desactivar'} este campesino?`)) {
            toggleEstadoUsuario(id, nuevoEstado).then(success => {
                if (success) {
                    actualizarFilaEstado(fila, nuevoEstado);
                }
            });
        }
    }
});

// Botón crear nuevo campesino
document.getElementById('btnNuevoCampesino')?.addEventListener('click', () => {
    cargarMercadillos('mercadilloNuevo');
});

// Botones de formularios
document.getElementById('btnGuardarCampesino')?.addEventListener('click', crearCampesino);
btnConfirmarEliminar?.addEventListener("click", eliminarUsuario);
document.getElementById('btnClose')?.addEventListener('click', () => modalEliminar.hide());

// Limpiar formulario al cerrar modal de creación
$('#crearCampesinoModal').on('hidden.bs.modal', () => {
    document.getElementById('formCrearCampesino').reset();
});