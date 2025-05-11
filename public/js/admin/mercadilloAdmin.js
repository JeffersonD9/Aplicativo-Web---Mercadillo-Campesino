import { getCookie } from "../expresiones.js";
console.log("Mercadillos");

// Configuración base
const MERCADILLOS_URL = `/MercadilloBucaramanga/Admin/Mercadillos`;

// Elementos del DOM
const notificacion = document.getElementById("notificacion");
const btnGuardarNuevo = document.getElementById("btnGuardarNuevo");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

// Modales
const modalCrear = new bootstrap.Modal(document.getElementById('crearModal'));
const modalEditar = new bootstrap.Modal(document.getElementById('editarModal'));
const modalEliminar = new bootstrap.Modal(document.getElementById('eliminarModal'));

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

// Función para cargar los mercadillos desde la API
async function cargarMercadillos() {
    try {
        console.log('Cargando mercadillos...');
        console.log('Token:', getCookie("token"));
        const response = await fetch(`/MercadilloBucaramanga/api/mercadillos`, {
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar mercadillos: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        if (!data || !Array.isArray(data)) {
            throw new Error('Formato de datos inválido: data no es un arreglo');
        }

        mostrarMercadillosEnTabla(data);
    } catch (error) {
        console.error('Error en cargarMercadillos:', error);
        mostrarNotificacion(error.message, 'danger');
    }
}

// Función para mostrar los mercadillos en la tabla
function mostrarMercadillosEnTabla(mercadillos) {
    console.log('Mostrando mercadillos en tabla:', mercadillos);
    const table = $('#dataTable');
    const tbody = table.find('tbody');
    tbody.empty(); // Limpiar el contenido del tbody

    mercadillos.forEach((mercadillo, index) => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', mercadillo.Id);
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="nombre">${mercadillo.Nombre}</span></td>
            <td><span class="direccion">${mercadillo.Direccion || ''}</span></td>
            <td>
                <button class="btn btn-outline-primary btn-sm btn-editar" data-id="${mercadillo.Id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-outline-danger btn-sm btn-eliminar ml-1" data-id="${mercadillo.Id}">
                    <i class="bi bi-trash"></i> Eliminar
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

    // Inicializar DataTables con idioma español incrustado
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
                sortAscending: ": activar para ordenar la columna ascendente",
                sortDescending: ": activar para ordenar la columna descendente"
            }
        },
        destroy: true
    });
}

// Función para crear un nuevo mercadillo
async function crearMercadillo() {
    const nombre = document.getElementById('nombreNuevo').value.trim();
    const direccion = document.getElementById('direccionNueva').value.trim();

    if (!nombre || !direccion) {
        mostrarNotificacion('El nombre y la dirección del mercadillo son requeridos', 'warning');
        return;
    }

    // Verificar si el nombre ya existe
    const table = $('#dataTable').DataTable();
    const nombresExistentes = table
        .rows()
        .data()
        .toArray()
        .map(row => row[1].toLowerCase());
    
    if (nombresExistentes.includes(nombre.toLowerCase())) {
        mostrarNotificacion('Ya existe un mercadillo con este nombre', 'warning');
        return;
    }

    try {
        console.log('Creando mercadillo:', { nombre, direccion });
        const response = await fetch(`${MERCADILLOS_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({ Nombre: nombre, Direccion: direccion })
        });

        const dataMercadillo = await response.json();
        const data = dataMercadillo.data;
        console.log('Respuesta de crear mercadillo:', JSON.stringify(data, null, 2));

        if (response.ok) {
            // Nota: Asume que la API devuelve { Id, Nombre, Direccion }. Si es diferente, ajustar los campos.
            if (!data || !data.Id || !data.Nombre || !data.Direccion) {
                console.error('Respuesta de la API inválida:', data);
                throw new Error('Respuesta de la API inválida: no se devolvió el mercadillo creado');
            }

            mostrarNotificacion('Mercadillo creado exitosamente');
            modalCrear.hide();
            document.getElementById('formCrear').reset();

            // Agregar la nueva fila a la tabla
            const nuevoMercadillo = data;
            const rowCount = table.rows().count() + 1;

            try {
                console.log('Agregando fila a DataTables:', {
                    rowCount,
                    Nombre: nuevoMercadillo.Nombre,
                    Direccion: nuevoMercadillo.Direccion,
                    Id: nuevoMercadillo.Id
                });
                const newRow = table.row.add([
                    rowCount,
                    `<span class="nombre">${nuevoMercadillo.Nombre}</span>`,
                    `<span class="direccion">${nuevoMercadillo.Direccion}</span>`,
                    `
                    <button class="btn btn-outline-primary btn-sm btn-editar" data-id="${nuevoMercadillo.Id}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-eliminar ml-1" data-id="${nuevoMercadillo.Id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                    `
                ]).draw(false).node();
                newRow.setAttribute('data-id', nuevoMercadillo.Id);
                console.log('Fila agregada exitosamente');
            } catch (error) {
                console.error('Error al agregar fila a DataTables:', error);
                mostrarNotificacion('Mercadillo creado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning');
                await cargarMercadillos();
            }
        } else {
            throw new Error(data.message || `Error al crear mercadillo: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en crearMercadillo:', error);
        mostrarNotificacion(error.message, 'danger');
    }
}

// Función para cargar datos en el modal de edición
function cargarDatosEdicion(btn) {
    console.log('Cargando datos para edición...');
    const id = btn.getAttribute('data-id');
    const fila = btn.closest('tr');
    const nombreElement = fila.querySelector('.nombre');
    const direccionElement = fila.querySelector('.direccion');

    if (!nombreElement || !direccionElement) {
        console.error('No se encontraron las clases .nombre o .direccion en la fila:', fila);
        mostrarNotificacion('Error al cargar datos del mercadillo: estructura de la tabla inválida', 'danger');
        return;
    }

    const nombre = nombreElement.textContent;
    const direccion = direccionElement.textContent;
    document.getElementById('idEditar').value = id;
    document.getElementById('nombreEditar').value = nombre;
    document.getElementById('direccionEditar').value = direccion;
    modalEditar.show();
}

// Función para actualizar un campo individual
async function actualizarCampoIndividual(id, campo, valor) {
    try {
        if (!valor) {
            mostrarNotificacion(`El campo ${campo} no puede estar vacío`, 'warning');
            return;
        }

        // Verificar si el nombre ya existe (solo para Nombre)
        if (campo === 'Nombre') {
            const table = $('#dataTable').DataTable();
            const nombresExistentes = table
                .rows()
                .data()
                .toArray()
                .map(row => row[1].toLowerCase());
            const row = table.rows((idx, data, node) => {
                return $(node).find('.btn-editar').data('id') == id;
            }).nodes()[0];
            const currentName = table.row(row).data()[1].toLowerCase();

            if (nombresExistentes.includes(valor.toLowerCase()) && valor.toLowerCase() !== currentName) {
                mostrarNotificacion('Ya existe un mercadillo con este nombre', 'warning');
                return;
            }
        }

        const datos = { [campo]: valor };
        console.log('Actualizando campo:', { id, campo, valor });

        const response = await fetch(`${MERCADILLOS_URL}/${id}`, {
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
                return $(node).find('.btn-editar').data('id') == id;
            }).nodes()[0];

            try {
                const rowData = table.row(row).data();
                const updatedRowData = [...rowData];
                if (campo === 'Nombre') {
                    updatedRowData[1] = `<span class="nombre">${valor}</span>`;
                } else if (campo === 'Direccion') {
                    updatedRowData[2] = `<span class="direccion">${valor}</span>`;
                }
                table.row(row).data(updatedRowData).draw(false);
                console.log('Fila actualizada exitosamente');
            } catch (error) {
                console.error('Error al actualizar fila en DataTables:', error);
                mostrarNotificacion('Campo actualizado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning');
                await cargarMercadillos();
            }
        } else {
            throw new Error(data.message || `Error al actualizar campo ${campo}`);
        }
    } catch (error) {
        console.error(`Error al actualizar campo ${campo}:`, error);
        mostrarNotificacion(error.message, 'danger');
    }
}

// Función para eliminar un mercadillo
async function eliminarMercadillo() {
    const id = document.getElementById('idEliminar').value;
    if (!id) {
        mostrarNotificacion('ID de mercadillo no válido', 'warning');
        return;
    }

    try {
        console.log('Eliminando mercadillo con ID:', id);
        const response = await fetch(`${MERCADILLOS_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            }
        });

        const data = await response.json();
        console.log('Respuesta de eliminar mercadillo:', data);

        if (response.ok) {
            mostrarNotificacion('Mercadillo eliminado exitosamente');
            modalEliminar.hide();

            // Eliminar la fila de la tabla
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).find('.btn-eliminar').data('id') == id;
            }).nodes()[0];

            try {
                table.row(row).remove().draw();
                console.log('Fila eliminada exitosamente');
            } catch (error) {
                console.error('Error al eliminar fila en DataTables:', error);
                mostrarNotificacion('Mercadillo eliminado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning');
                await cargarMercadillos();
            }
        } else {
            throw new Error(data.message || `Error al eliminar mercadillo: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en eliminarMercadillo:', error);
        mostrarNotificacion(error.message, 'danger');
    }
}

// Manejadores de eventos
document.addEventListener('DOMContentLoaded', function() {
    // Cargar mercadillos al iniciar
    console.log('Inicializando página...');
    cargarMercadillos();

    // Evento para crear nuevo mercadillo
    btnGuardarNuevo.addEventListener('click', crearMercadillo);

    // Evento para confirmar eliminación
    btnConfirmarEliminar.addEventListener('click', eliminarMercadillo);

    // Delegación de eventos para botones de editar, eliminar y actualizar campo
    document.addEventListener('click', function(e) {
        const btnEditar = e.target.closest('.btn-editar');
        const btnEliminar = e.target.closest('.btn-eliminar');
        const btnActualizarCampo = e.target.closest('.btn-actualizar-campo');

        if (btnEditar) {
            cargarDatosEdicion(btnEditar);
        }

        if (btnEliminar) {
            const id = btnEliminar.getAttribute('data-id');
            document.getElementById('idEliminar').value = id;
            modalEliminar.show();
        }

        if (btnActualizarCampo) {
            const campo = btnActualizarCampo.getAttribute('data-campo');
            const id = document.getElementById('idEditar').value;
            const inputId = campo === 'Nombre' ? 'nombreEditar' : 'direccionEditar';
            const valor = document.getElementById(inputId).value.trim();

            btnActualizarCampo.disabled = true;
            btnActualizarCampo.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';

            actualizarCampoIndividual(id, campo, valor).finally(() => {
                btnActualizarCampo.disabled = false;
                btnActualizarCampo.innerHTML = '<i class="bi bi-check"></i> Actualizar';
            });
        }
    });

    // Limpiar formulario al cerrar modal de creación
    $('#crearModal').on('hidden.bs.modal', () => {
        console.log('Modal de creación cerrado');
        document.getElementById('formCrear').reset();
    });
});