import { getCookie } from "../expresiones.js";
console.log("Campesinos");

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
let mercadillosCache = [];

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "success") {
    const notificacion = document.getElementById("notificacion");
    notificacion.textContent = mensaje;
    notificacion.className = `alert alert-${tipo} visible`;
    setTimeout(() => {
        notificacion.classList.add("fade");
        setTimeout(() => {
            notificacion.className = "";
            notificacion.textContent = "";
        }, 500);
    }, 3000);
}

// Función para cargar los mercadillos (para selects)
async function cargarMercadillos(selectId) {
    try {
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
        while (select.options.length > 1) {
            select.remove(1);
        }
        
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

// Función para cargar los campesinos desde la API
async function cargarCampesinos() {
    try {
        console.log('Cargando campesinos...');
        console.log('Token:', getCookie("token"));
        const response = await fetch(`/MercadilloBucaramanga/api/usuarios`, {
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar campesinos: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        if (!data || !Array.isArray(data)) {
            throw new Error('Formato de datos inválido: data no es un arreglo');
        }

        // Cargar mercadillos para selects
        await cargarMercadillos('mercadilloActualizar');
        mostrarCampesinosEnTabla(data);
    } catch (error) {
        console.error('Error en cargarCampesinos:', error);
        mostrarNotificacion(error.message, 'danger');
    }
}

// Función para mostrar los campesinos en la tabla
function mostrarCampesinosEnTabla(campesinos) {
    console.log('Mostrando campesinos en tabla:', campesinos);
    const table = $('#dataTable');
    const tbody = table.find('tbody');
    tbody.empty(); // Limpiar el contenido del tbody

    campesinos.forEach((campesino) => {
        const mercadilloNombre = campesino.mercadillo?.Nombre || 'Sin mercadillo';
        const estado = campesino.Estado ? 'activo' : 'inactivo';
        const btnEstadoClase = campesino.Estado ? 'btn-warning' : 'btn-success';
        const btnEstadoTexto = campesino.Estado ? 'Desactivar' : 'Activar';
        const tr = document.createElement('tr');
        tr.setAttribute('data-id-mercadillo', campesino.Id_Mercadillo || '');
        tr.classList.toggle('table-secondary', !campesino.Estado);
        tr.innerHTML = `
            <td>${campesino.Id}</td>
            <td><span class="nombre">${campesino.Nombres}</span></td>
            <td><span class="apellidos">${campesino.Apellidos}</span></td>
            <td><span class="email">${campesino.Email}</span></td>
            <td><span class="celular">${campesino.Celular}</span></td>
            <td><span class="mercadillo">${mercadilloNombre}</span></td>
            <td><span class="puesto">${campesino.Puesto || 0}</span></td>
            <td>
                <button class="btn btn-outline-primary btn-sm btn-actualizar-usuario" data-id="${campesino.Id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-outline-danger btn-sm btn-eliminar-usuario " data-id="${campesino.Id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
                <button class="btn btn-sm btn-toggle-estado ${btnEstadoClase} " data-id="${campesino.Id}" data-estado="${estado}">
                    ${btnEstadoTexto}
                </button>
            </td>
        `;
        tbody.append(tr);
    });

    // Destruir DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable(table)) {
        console.log('Destruyendo DataTables existente...');
        table.DataTable().clear().destroy();
    }

    // Inicializar DataTables con configuración estática en español
    console.log('Inicializando DataTables...');
    table.DataTable({
        language: {
            decimal: "",
            emptyTable: "No hay datos disponibles en la tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de _MAX_ entradas totales)",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "Mostrar _MENU_ entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "No se encontraron registros coincidentes",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            aria: {
                sortAscending: ": activar para ordenar la columna de manera ascendente",
                sortDescending: ": activar para ordenar la columna de manera descendente"
            }
        },
        destroy: true
    });
}

// Función para crear un nuevo campesino
async function crearCampesino(event) {
    event.preventDefault(); // Prevenir comportamiento por defecto del formulario
    console.log('Iniciando creación de campesino...');

    const campesino = {
        Nombres: document.getElementById('nombresNuevo').value.trim(),
        Apellidos: document.getElementById('apellidosNuevo').value.trim(),
        Email: document.getElementById('emailNuevo').value.trim(),
        Celular: document.getElementById('celularNuevo').value.trim(),
        Id_Mercadillo: Number(document.getElementById('mercadilloNuevo').value),
        Puesto: Number(document.getElementById('puestoNuevo').value),
        Password: document.getElementById('passwordNuevo').value.trim(),
        Roles: 2 // Rol para campesinos
    };

    if (!campesino.Nombres || !campesino.Apellidos || !campesino.Email || !campesino.Id_Mercadillo || !campesino.Password) {
        mostrarNotificacion('Todos los campos son requeridos', 'warning');
        return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(campesino.Email)) {
        mostrarNotificacion('El email no es válido', 'warning');
        return;
    }

    // Verificar si el email ya existe
    const table = $('#dataTable').DataTable();
    const emailsExistentes = table
        .rows()
        .nodes()
        .toArray()
        .map(node => node.querySelector('.email')?.textContent.toLowerCase());
    
    if (emailsExistentes.includes(campesino.Email.toLowerCase())) {
        mostrarNotificacion('Ya existe un campesino con este email', 'warning');
        return;
    }

    try {
        console.log('Creando campesino:', campesino);
        const response = await fetch(`${ADMIN_USUARIOS_URL}/Registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify(campesino)
        });

        const dataMercadillo = await response.json();
        console.log('Respuesta completa de la API:', JSON.stringify(dataMercadillo, null, 2));

        if (!response.ok) {
            throw new Error(dataMercadillo.message || 'Error al crear campesino');
        }

        const nuevoCampesino = dataMercadillo.newUser;
        if (!nuevoCampesino || !nuevoCampesino.Id) {
            throw new Error('Respuesta de la API inválida: falta newUser o Id');
        }

        console.log('Nuevo campesino:', nuevoCampesino);
        mostrarNotificacion(dataMercadillo.message || 'Campesino creado exitosamente');

        // Agregar la nueva fila a la tabla
        const mercadilloNombre = nuevoCampesino.mercadillo?.Nombre || 
            mercadillosCache.find(m => m.Id == nuevoCampesino.Id_Mercadillo)?.Nombre || 
            'Sin mercadillo';
        
        try {
            console.log('Agregando fila a DataTables:', nuevoCampesino);
            const newRow = table.row.add([
                nuevoCampesino.Id,
                `<span class="nombre">${nuevoCampesino.Nombres || ''}</span>`,
                `<span class="apellidos">${nuevoCampesino.Apellidos || ''}</span>`,
                `<span class="email">${nuevoCampesino.Email || ''}</span>`,
                `<span class="celular">${nuevoCampesino.Celular || ''}</span>`,
                `<span class="mercadillo">${mercadilloNombre}</span>`,
                `<span class="puesto">${nuevoCampesino.Puesto || 0}</span>`,
                `
                <button class="btn btn-outline-primary btn-sm btn-actualizar-usuario" data-id="${nuevoCampesino.Id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-outline-danger btn-sm btn-eliminar-usuario ml-1" data-id="${nuevoCampesino.Id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
                <button class="btn btn-sm btn-toggle-estado btn-warning ml-1" data-id="${nuevoCampesino.Id}" data-estado="activo">
                    Desactivar
                </button>
                `
            ]).draw(false).node();
            newRow.setAttribute('data-id-mercadillo', nuevoCampesino.Id_Mercadillo || '');
            console.log('Fila agregada exitosamente');
        } catch (error) {
            console.error('Error al agregar fila a DataTables:', error);
            mostrarNotificacion('Campesino creado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning');
            await cargarCampesinos();
        }
    } catch (error) {
        console.error('Error al crear campesino:', error);
        mostrarNotificacion(error.message, 'danger');
    } finally {
        console.log('Cerrando modal de creación...');
        modalCrear.hide();
        document.getElementById('formCrearCampesino').reset();
        // Forzar eliminación del backdrop
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style = '';
    }
}

// Función para actualizar un campo individual
async function actualizarCampoIndividual(id, campo, valor) {
    try {
        if (campo === 'Password' && !valor) {
            mostrarNotificacion('No se proporcionó nueva contraseña', 'info');
            return;
        }

        if (campo === 'Puesto') {
            valor = Number(valor) || null;
        }

        if (campo === 'Email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valor)) {
                mostrarNotificacion('El email no es válido', 'warning');
                return;
            }

            const table = $('#dataTable').DataTable();
            const emailsExistentes = table
                .rows()
                .nodes()
                .toArray()
                .map(node => node.querySelector('.email')?.textContent.toLowerCase());
            const row = table.rows((idx, data, node) => {
                return $(node).find('.btn-actualizar-usuario').data('id') == id;
            }).nodes()[0];
            const currentEmail = row.querySelector('.email')?.textContent.toLowerCase();

            if (emailsExistentes.includes(valor.toLowerCase()) && valor.toLowerCase() !== currentEmail) {
                mostrarNotificacion('Ya existe un campesino con este email', 'warning');
                return;
            }
        }

        const datos = { [campo]: valor };
        console.log('Actualizando campo:', { id, campo, valor });

        const response = await fetch(`${ADMIN_USUARIOS_URL}/edit/${id}`, {
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
            mostrarNotificacion(`Campo ${campo} actualizado exitosamente`);

            // Actualizar la fila en la tabla
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).find('.btn-actualizar-usuario').data('id') == id;
            }).nodes()[0];

            try {
                const rowData = table.row(row).data();
                const updatedRowData = [...rowData];
                switch (campo) {
                    case 'Nombres':
                        updatedRowData[1] = `<span class="nombre">${valor}</span>`;
                        break;
                    case 'Apellidos':
                        updatedRowData[2] = `<span class="apellidos">${valor}</span>`;
                        break;
                    case 'Email':
                        updatedRowData[3] = `<span class="email">${valor}</span>`;
                        break;
                    case 'Celular':
                        updatedRowData[4] = `<span class="celular">${valor}</span>`;
                        break;
                    case 'Id_Mercadillo':
                        const mercadillo = mercadillosCache.find(m => m.Id == valor) || { Nombre: 'Sin mercadillo' };
                        updatedRowData[5] = `<span class="mercadillo">${mercadillo.Nombre}</span>`;
                        row.setAttribute('data-id-mercadillo', valor);
                        break;
                    case 'Puesto':
                        updatedRowData[6] = `<span class="puesto">${valor || 0}</span>`;
                        break;
                }
                table.row(row).data(updatedRowData).draw(false);
                console.log('Fila actualizada exitosamente');
            } catch (error) {
                console.error('Error al actualizar fila en DataTables:', error);
                mostrarNotificacion('Campo actualizado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning');
                await cargarCampesinos();
            }
        } else {
            throw new Error(data.message || `Error al actualizar campo ${campo}`);
        }
    } catch (error) {
        console.error(`Error al actualizar campo ${campo}:`, error);
        mostrarNotificacion(error.message, 'danger');
    }
}

// Función para eliminar un usuario
async function eliminarUsuario() {
    if (!idUsuarioAEliminar) {
        console.error("No hay ID de usuario para eliminar");
        mostrarNotificacion('ID de usuario no válido', 'warning');
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
        console.log('Respuesta de eliminar usuario:', data);

        if (response.ok) {
            mostrarNotificacion(data.message || 'Campesino eliminado exitosamente');
            modalEliminar.hide();

            // Eliminar la fila de la tabla
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).find('.btn-eliminar-usuario').data('id') == idUsuarioAEliminar;
            }).nodes()[0];

            try {
                table.row(row).remove().draw();
                console.log('Fila eliminada exitosamente');
            } catch (error) {
                console.error('Error al eliminar fila en DataTables:', error);
                mostrarNotificacion('Campesino eliminado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning');
                await cargarCampesinos();
            }
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

// Función para cambiar el estado de un usuario
async function toggleEstadoUsuario(id, nuevoEstado) {
    try {
        console.log('Cambiando estado del usuario:', { id, nuevoEstado });
        const response = await fetch(`${ADMIN_USUARIOS_URL}/edit/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({ Estado: nuevoEstado })
        });

        const data = await response.json();
        console.log('Respuesta de cambiar estado:', data);

        if (response.ok) {
            mostrarNotificacion(`Campesino ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`);
            return true;
        } else {
            throw new Error(data.message || 'Error al cambiar estado');
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        mostrarNotificacion(error.message, 'danger');
        return false;
    }
}

// Función para actualizar la fila después de cambiar el estado
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

// Función para abrir el modal de actualización
async function abrirModalActualizar(campesino) {
    try {
        await cargarMercadillos('mercadilloActualizar');
        document.getElementById('idActualizar').value = campesino.id;
        document.getElementById('nombresActualizar').value = campesino.nombres;
        document.getElementById('apellidosActualizar').value = campesino.apellidos;
        document.getElementById('emailActualizar').value = campesino.email;
        document.getElementById('celularActualizar').value = campesino.celular;
        const puesto = Number(campesino.puesto);
        document.getElementById('puestoActualizar').value = isNaN(puesto) ? 0 : puesto;
        document.getElementById('passwordActualizar').value = '';
        if (campesino.idMercadillo) {
            document.getElementById('mercadilloActualizar').value = campesino.idMercadillo;
        }
        modalActualizar.show();
    } catch (error) {
        console.error('Error al abrir modal de actualización:', error);
        mostrarNotificacion('Error al preparar formulario de edición', 'danger');
    }
}

// Manejadores de eventos
document.addEventListener('DOMContentLoaded', function() {
    // Cargar campesinos al iniciar
    console.log('Inicializando página...');
    cargarCampesinos();

    // Botón crear nuevo campesino
    document.getElementById('btnNuevoCampesino')?.addEventListener('click', () => {
        cargarMercadillos('mercadilloNuevo');
        modalCrear.show();
    });

    // Formulario de creación
    const formCrearCampesino = document.getElementById('formCrearCampesino');
    formCrearCampesino?.addEventListener('submit', (event) => {
        event.preventDefault();
        crearCampesino(event);
    });

    // Botones de formularios
    document.getElementById('btnGuardarCampesino')?.addEventListener('click', crearCampesino);
    btnConfirmarEliminar?.addEventListener("click", eliminarUsuario);
    document.getElementById('btnClose')?.addEventListener('click', () => modalEliminar.hide());

    // Manejador de eventos para botones de actualización individual
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-actualizar-campo')) {
            const btn = e.target;
            const campo = btn.getAttribute('data-campo');
            const id = document.getElementById('idActualizar').value;
            
            let valor;
            const inputId = `${campo.toLowerCase()}Actualizar`;
            
            if (campo === 'Id_Mercadillo') {
                valor = document.getElementById('mercadilloActualizar').value;
            } else {
                valor = document.getElementById(inputId).value;
            }

            if (!valor && campo !== 'Password') {
                mostrarNotificacion(`El campo ${campo} no puede estar vacío`, 'warning');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';

            actualizarCampoIndividual(id, campo, valor).finally(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-check"></i> Actualizar';
            });
        }
    });

    // Manejadores de eventos para botones
    document.addEventListener('click', (e) => {
        // Eliminar
        if (e.target.classList.contains('btn-eliminar-usuario')) {
            const fila = e.target.closest('tr');
            idUsuarioAEliminar = fila.querySelector('td:first-child').textContent;
            filaAEliminar = fila;
            
            const nombre = fila.querySelector('.nombre')?.textContent || 'este campesino';
            document.querySelector('#eliminarModal .modal-title').textContent = 
                `¿Eliminar al campesino ${nombre}?`;
            
            modalEliminar.show();
        }
        // Editar
        else if (e.target.classList.contains('btn-actualizar-usuario')) {
            const fila = e.target.closest('tr');
            const campesino = {
                id: fila.querySelector('td:first-child').textContent,
                nombres: fila.querySelector('.nombre')?.textContent || '',
                apellidos: fila.querySelector('.apellidos')?.textContent || '',
                email: fila.querySelector('.email')?.textContent || '',
                celular: fila.querySelector('.celular')?.textContent || '',
                idMercadillo: fila.getAttribute('data-id-mercadillo'),
                puesto: fila.querySelector('.puesto')?.textContent || '0'
            };
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

    // Limpiar formulario al cerrar modal de creación
    $('#crearCampesinoModal').on('hidden.bs.modal', () => {
        console.log('Modal de creación cerrado');
        document.getElementById('formCrearCampesino').reset();
    });
});