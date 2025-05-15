import { getCookie } from "../expresiones.js";
console.log("Datos Campesino");

// Configuración base
const API_BASE_URL = '/MercadilloBucaramanga';
const USUARIO_URL = `${API_BASE_URL}/Usuario`;
const token = getCookie("token");
const arrayToken = token.split(".");
const tokenPayload = JSON.parse(atob(arrayToken[1]));


// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "success") {
    const notificacion = document.getElementById("notificacionActualizar");
    if (!notificacion) {
        console.error("Contenedor de notificación no encontrado");
        console.log(mensaje);
        return;
    }
    notificacion.textContent = mensaje;
    notificacion.className = `alert alert-${tipo}`;
    notificacion.classList.remove("d-none");
    setTimeout(() => {
        notificacion.classList.add("d-none");
        notificacion.textContent = "";
    }, 3000);
}

// Función para limpiar notificaciones
function limpiarNotificacion() {
    const notificacion = document.getElementById("notificacionActualizar");
    if (notificacion) {
        notificacion.className = "alert alert-danger d-none";
        notificacion.textContent = "";
    }
}

// Función para actualizar un campo individual
async function actualizarCampoIndividual(id, campo, valor, btn) {
    try {
        // Validaciones
        if (campo === 'Password') {
            if (!valor) {
                mostrarNotificacion('No se proporcionó nueva contraseña', 'info');
                return;
            }
            if (valor.length < 6) {
                mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'warning');
                return;
            }
        }

        if (campo === 'Celular') {
            if (valor.length !== 10) {
                mostrarNotificacion('El celular debe contener exactamente 10 dígitos', 'warning');
                return;
            }
            if (!/^\d{10}$/.test(valor)) {
                mostrarNotificacion('El celular debe contener solo dígitos numéricos', 'warning');
                return;
            }
        }

        if (['Nombres', 'Apellidos'].includes(campo) && !valor.trim()) {
            mostrarNotificacion(`El campo ${campo} no puede estar vacío`, 'warning');
            return;
        }

        const datos = { [campo]: valor };
        console.log('Actualizando campo:', { id, campo, valor });

        const response = await fetch(`${USUARIO_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify(datos)
        });

        const data = await response.json();
        console.log('Respuesta de actualizar campo:', data);

        if (response.ok) {
            mostrarNotificacion(data.message || `Campo ${campo} actualizado exitosamente`, 'success');
            // Actualizar el valor en el formulario
            document.getElementById(`${campo.toLowerCase()}Actualizar`).value = campo === 'Password' ? '' : valor;
        } else {
            throw new Error(data.message || `Error al actualizar campo ${campo}`);
        }
    } catch (error) {
        console.error(`Error al actualizar campo ${campo}:`, error);
        mostrarNotificacion(error.message, 'danger');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check"></i> Actualizar';
        }
    }
}

// Manejadores de eventos
document.addEventListener('DOMContentLoaded', function() {
    // Manejador para botones de actualización
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-actualizar-campo')) {
            e.preventDefault(); // Prevenir cualquier comportamiento predeterminado
            const btn = e.target.closest('.btn-actualizar-campo');
            const campo = btn.getAttribute('data-campo');
            const id = tokenPayload.id;

            // Ignorar campos no editables
            if (['Id_Mercadillo', 'Puesto', 'Email'].includes(campo)) {
                console.log(`El campo ${campo} no es editable`);
                return;
            }

            const inputId = campo === 'Password' ? 'passwordActualizar' : `${campo.toLowerCase()}Actualizar`;
            const valor = document.getElementById(inputId).value.trim();

            if (!valor && campo !== 'Password') {
                mostrarNotificacion(`El campo ${campo} no puede estar vacío`, 'warning');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';

            actualizarCampoIndividual(id, campo, valor, btn);
        }
    });

    // Limpiar notificaciones al cargar la página
    limpiarNotificacion();
});