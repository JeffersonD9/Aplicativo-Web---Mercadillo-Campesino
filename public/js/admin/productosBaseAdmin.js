import { getCookie } from "../expresiones.js";
console.log("Productos");

// Configuración base
const API_BASE_URL = 'http://18.223.102.119:8080/api-REST';
const PRODUCTOS_URL = `${API_BASE_URL}/products`;
const CATEGORIAS_URL = `${API_BASE_URL}/categories`;

// Elementos del DOM
const btnGuardarNuevo = document.getElementById("btnGuardarNuevo");
const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

// Modales
const modalCrear = new bootstrap.Modal(document.getElementById('crearModal'));
const modalEditar = new bootstrap.Modal(document.getElementById('editarModal'));
const modalEliminar = new bootstrap.Modal(document.getElementById('eliminarModal'));

// Almacenar categorías para mapear id_Category a nombres
let categoriasMap = {};

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "success", contenedorId) {
    const notificacion = document.getElementById(contenedorId);
    if (!notificacion) {
        console.error(`Contenedor de notificación ${contenedorId} no encontrado`);
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
function limpiarNotificacion(contenedorId) {
    const notificacion = document.getElementById(contenedorId);
    if (notificacion) {
        notificacion.className = "alert d-none";
        notificacion.textContent = "";
    }
}

// Función para cargar las categorías desde la API
async function cargarCategorias() {
    try {
        console.log('Cargando categorías...');
        const response = await fetch(CATEGORIAS_URL, {
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar categorías: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Categorías recibidas:', data);
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Formato de datos inválido: data.data no es un arreglo');
        }

        // Crear mapa de categorías
        categoriasMap = {};
        data.data.forEach(categoria => {
            categoriasMap[categoria.Id] = categoria.Name;
        });

        // Llenar los select de los modales
        llenarSelectCategorias(data.data);
    } catch (error) {
        console.error('Error en cargarCategorias:', error);
        console.log(error.message);
    }
}

// Función para llenar los select de categorías en los modales
function llenarSelectCategorias(categorias) {
    const selectCrear = document.getElementById('categoriaNuevo');
    const selectEditar = document.getElementById('categoriaEditar');

    selectCrear.innerHTML = '<option value="">Seleccione una categoría</option>';
    selectEditar.innerHTML = '<option value="">Seleccione una categoría</option>';

    categorias.forEach(categoria => {
        const optionCrear = document.createElement('option');
        optionCrear.value = categoria.Id;
        optionCrear.textContent = categoria.Name;
        selectCrear.appendChild(optionCrear);

        const optionEditar = document.createElement('option');
        optionEditar.value = categoria.Id;
        optionEditar.textContent = categoria.Name;
        selectEditar.appendChild(optionEditar);
    });
}

// Función para cargar los productos desde la API
async function cargarProductos() {
    try {
        console.log('Cargando productos...');
        console.log('Token:', getCookie("token"));
        const response = await fetch(PRODUCTOS_URL, {
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Formato de datos inválido: data.data no es un arreglo');
        }

        mostrarProductosEnTabla(data.data);
    } catch (error) {
        console.error('Error en cargarProductos:', error);
        console.log(error.message);
    }
}

// Función para mostrar los productos en la tabla
function mostrarProductosEnTabla(productos) {
    console.log('Mostrando productos en tabla:', productos);
    const table = $('#dataTable');
    const tbody = table.find('tbody');
    tbody.empty(); // Limpiar el contenido del tbody

    productos.forEach((producto, index) => {
        const categoriaNombre = categoriasMap[producto.id_Category] || 'Sin categoría';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="nombre">${producto.Name}</td>
            <td class="categoria">${categoriaNombre}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm btn-editar" data-id="${producto.Id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-outline-danger btn-sm btn-eliminar ml-1" data-id="${producto.Id}">
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

    // Configuración de idioma personalizada
    const dataTablaOpciones = {
        pageLength: 10,
        language: {
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "Ningún usuario encontrado",
            info: "_START_ a _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Ningún usuario encontrado",
            infoFiltered: "(filtrados desde _MAX_ registros totales)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior",
            },
        },
        destroy: true // Asegura que DataTables pueda reinicializarse
    };

    // Inicializar DataTables
    console.log('Inicializando DataTables...');
    table.DataTable(dataTablaOpciones);
}

// Función para crear un nuevo producto
async function crearProducto() {
    const nombre = document.getElementById('nombreNuevo').value.trim();
    const descripcion = document.getElementById('descripcionNuevo').value.trim();
    const idCategoria = document.getElementById('categoriaNuevo').value;

    if (!nombre) {
        mostrarNotificacion('El nombre del producto es requerido', 'warning', 'notificacionCrear');
        return;
    }
    if (!idCategoria) {
        mostrarNotificacion('La categoría es requerida', 'warning', 'notificacionCrear');
        return;
    }

    // Verificar si el nombre ya existe en la tabla
    const table = $('#dataTable').DataTable();
    const nombresExistentes = table
        .rows()
        .data()
        .toArray()
        .map(row => row[1].toLowerCase());
    
    if (nombresExistentes.includes(nombre.toLowerCase())) {
        mostrarNotificacion('Ya existe un producto con este nombre', 'warning', 'notificacionCrear');
        return;
    }

    try {
        console.log('Creando producto:', { nombre, descripcion, idCategoria });
        const response = await fetch(`${PRODUCTOS_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({
                Name: nombre,
                Description: descripcion,
                CategoryId: parseInt(idCategoria)
            })
        });

        const data = await response.json();
        console.log('Respuesta de crear producto:', JSON.stringify(data, null, 2));

        if (response.ok) {
            // Validar que la respuesta contiene los campos esperados
            if (!data || !data.productId || !data.productName) {
                console.error('Respuesta de la API inválida:', data);
                throw new Error('Respuesta de la API inválida: no se devolvió el producto creado');
            }

            mostrarNotificacion('Producto creado exitosamente', 'success', 'notificacionCrear');
            modalCrear.hide();
            document.getElementById('formCrear').reset();

            // Agregar la nueva fila a la tabla
            const nuevoProducto = data;
            const categoriaNombre = categoriasMap[nuevoProducto.id_category] || 'Sin categoría';
            const rowCount = table.rows().count() + 1;

            try {
                console.log('Agregando fila a DataTables:', {
                    rowCount,
                    Name: nuevoProducto.productName,
                    categoriaNombre,
                    Id: nuevoProducto.productId
                });
                table.row.add([
                    rowCount,
                    `<span class="nombre">${nuevoProducto.productName}</span>`,
                    `<span class="categoria">${categoriaNombre}</span>`,
                    `
                    <button class="btn btn-outline-primary btn-sm btn-editar" data-id="${nuevoProducto.productId}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-eliminar ml-1" data-id="${nuevoProducto.productId}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                    `
                ]).draw(false);
                console.log('Fila agregada exitosamente');
            } catch (error) {
                console.error('Error al agregar fila a DataTables:', error);
                mostrarNotificacion('Producto creado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning', 'notificacionCrear');
                await cargarProductos();
            }
        } else {
            if (data.message && data.message.includes('already exists')) {
                mostrarNotificacion('Ya existe un producto con este nombre', 'danger', 'notificacionCrear');
            } else {
                throw new Error(data.message || `Error al crear producto: ${response.statusText}`);
            }
        }
    } catch (error) {
        console.error('Error en crearProducto:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionCrear');
    }
}

// Función para cargar datos en el modal de edición
function cargarDatosEdicion(btn) {
    console.log('Cargando datos para edición...');
    const id = btn.getAttribute('data-id');
    const fila = btn.closest('tr');
    const nombre = fila.querySelector('.nombre').textContent;
    const categoriaId = Object.keys(categoriasMap).find(key => categoriasMap[key] === fila.querySelector('.categoria').textContent);

    // Obtener descripción haciendo una llamada a la API
    fetch(`${PRODUCTOS_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${getCookie("token")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data) {
            document.getElementById('idEditar').value = id;
            document.getElementById('nombreEditar').value = nombre;
            document.getElementById('descripcionEditar').value = data.data.Description || '';
            document.getElementById('categoriaEditar').value = categoriaId || data.data.id_Category;
            modalEditar.show();
        } else {
            mostrarNotificacion('Error al cargar datos del producto', 'danger', 'notificacionEditar');
        }
    })
    .catch(error => {
        console.error('Error al cargar datos para edición:', error);
        mostrarNotificacion('Error al cargar datos del producto', 'danger', 'notificacionEditar');
    });
}

// Función para actualizar un producto
async function actualizarProducto() {
    const id = document.getElementById('idEditar').value;
    const nombre = document.getElementById('nombreEditar').value.trim();
    const descripcion = document.getElementById('descripcionEditar').value.trim();
    const idCategoria = document.getElementById('categoriaEditar').value;

    if (!nombre) {
        mostrarNotificacion('El nombre del producto es requerido', 'warning', 'notificacionEditar');
        return;
    }
    if (!idCategoria) {
        mostrarNotificacion('La categoría es requerida', 'warning', 'notificacionEditar');
        return;
    }

    try {
        console.log('Actualizando producto:', { id, nombre, descripcion, idCategoria });
        const response = await fetch(`${PRODUCTOS_URL}/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({
                Name: nombre,
                Description: descripcion,
                CategoryId: parseInt(idCategoria)
            })
        });

        const data = await response.json();
        console.log('Respuesta de actualizar producto:', data);

        if (response.ok) {
            mostrarNotificacion('Producto actualizado exitosamente', 'success', 'notificacionEditar');
            modalEditar.hide();

            // Actualizar la fila en la tabla
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).find('.btn-editar').data('id') == id;
            }).nodes()[0];

            const categoriaNombre = categoriasMap[idCategoria] || 'Sin categoría';
            const rowData = table.row(row).data();
            const rowIndex = rowData[0]; // Mantener el número de fila

            try {
                console.log('Actualizando fila en DataTables:', {
                    rowIndex,
                    Name: nombre,
                    categoriaNombre,
                    Id: id
                });
                table.row(row).data([
                    rowIndex,
                    `<span class="nombre">${nombre}</span>`,
                    `<span class="categoria">${categoriaNombre}</span>`,
                    `
                    <button class="btn btn-outline-primary btn-sm btn-editar" data-id="${id}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm btn-eliminar ml-1" data-id="${id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                    `
                ]).draw(false);
                console.log('Fila actualizada exitosamente');
            } catch (error) {
                console.error('Error al actualizar fila en DataTables:', error);
                mostrarNotificacion('Producto actualizado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning', 'notificacionEditar');
                await cargarProductos();
            }
        } else {
            throw new Error(data.message || `Error al actualizar producto: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en actualizarProducto:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionEditar');
    }
}

// Función para eliminar un producto
async function eliminarProducto() {
    const id = document.getElementById('idEliminar').value;
    if (!id) {
        mostrarNotificacion('ID de producto no válido', 'warning', 'notificacionEliminar');
        return;
    }

    try {
        console.log('Eliminando producto con ID:', id);
        const response = await fetch(`${PRODUCTOS_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            }
        });

        const data = await response.json();
        console.log('Respuesta de eliminar producto:', data);

        if (response.ok) {
            mostrarNotificacion('Producto eliminado exitosamente', 'success', 'notificacionEliminar');
            modalEliminar.hide();

            // Eliminar la fila de la tabla
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).find('.btn-eliminar').data('id') == id;
            }).nodes()[0];

            table.row(row).remove().draw();
        } else {
            throw new Error(data.message || `Error al eliminar producto: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error en eliminarProducto:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionEliminar');
    }
}

// Manejadores de eventos
document.addEventListener('DOMContentLoaded', function() {
    // Cargar categorías y productos al iniciar
    console.log('Inicializando página...');
    cargarCategorias().then(() => cargarProductos());

    // Evento para crear nuevo producto
    btnGuardarNuevo.addEventListener('click', async function() {
        btnGuardarNuevo.disabled = true;
        try {
            await crearProducto();
        } finally {
            btnGuardarNuevo.disabled = false;
        }
    });

    // Evento para actualizar producto
    btnGuardarEdicion.addEventListener('click', actualizarProducto);

    // Evento para confirmar eliminación
    btnConfirmarEliminar.addEventListener('click', eliminarProducto);

    // Delegación de eventos para botones de editar y eliminar
    document.addEventListener('click', function(e) {
        const btnEditar = e.target.closest('.btn-editar');
        const btnEliminar = e.target.closest('.btn-eliminar');

        if (btnEditar) {
            cargarDatosEdicion(btnEditar);
        }

        if (btnEliminar) {
            const id = btnEliminar.getAttribute('data-id');
            document.getElementById('idEliminar').value = id;
            modalEliminar.show();
        }
    });

    // Limpiar formulario y notificaciones al cerrar modales
    $('#crearModal').on('hidden.bs.modal', () => {
        console.log('Modal de creación cerrado');
        document.getElementById('formCrear').reset();
        limpiarNotificacion('notificacionCrear');
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style = '';
    });

    $('#editarModal').on('hidden.bs.modal', () => {
        console.log('Modal de edición cerrado');
        limpiarNotificacion('notificacionEditar');
    });

    $('#eliminarModal').on('hidden.bs.modal', () => {
        console.log('Modal de eliminación cerrado');
        limpiarNotificacion('notificacionEliminar');
    });
});