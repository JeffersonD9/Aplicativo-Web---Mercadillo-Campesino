import { getCookie } from "../expresiones.js";
console.log("Productos Personalizados");

// Configuración base
const API_BASE_URL = '/MercadilloBucaramanga';
const CATEGORIAS_URL = 'http://18.223.102.119:8080/api-REST/categorized-products';
const PRODUCTOS_URL = `${API_BASE_URL}/Usuario/Asignar-Productos`;

// Inicializar DataTables
let dataTable;
document.addEventListener('DOMContentLoaded', () => {
    dataTable = $('#dataTable').DataTable({
        language: {
            emptyTable: "No hay datos disponibles en la tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de _MAX_ entradas totales)",
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
            }
        }
    });
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success', contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) {
        console.error(`Contenedor ${contenedorId} no encontrado`);
        console.log(mensaje);
        return;
    }
    contenedor.textContent = mensaje;
    contenedor.className = `alert alert-${tipo}`;
    contenedor.classList.remove('d-none');
    setTimeout(() => {
        contenedor.classList.add('d-none');
        contenedor.textContent = '';
    }, 3000);
}

// Función para limpiar notificaciones
function limpiarNotificacion(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (contenedor) {
        contenedor.className = 'alert d-none';
        contenedor.textContent = '';
    }
}

// Cargar categorías
async function cargarCategorias() {
    try {
        const response = await fetch(CATEGORIAS_URL, {
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        if (!data.success) throw new Error('No se encontraron categorías');
        
        return data.data;
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        mostrarNotificacion('Error al cargar categorías', 'danger', 'notificacionCrear');
        return [];
    }
}

// Cargar categorías en un select específico
async function cargarCategoriasEnSelect(selectId) {
    try {
        const categorias = await cargarCategorias();
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = JSON.stringify({ id: categoria.categoryId, name: categoria.categoryName });
            option.textContent = categoria.categoryName;
            select.appendChild(option);
        });
        return categorias;
    } catch (error) {
        console.error('Error al cargar categorías en select:', error);
        mostrarNotificacion('Error al cargar categorías', 'danger', 'notificacionCrear');
        return [];
    }
}

// Cargar productos por categoría
async function cargarProductosPorCategoria(categoriaId, selectId, productoNombre = '') {
    try {
        const response = await fetch(CATEGORIAS_URL, {
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        if (!data.success) throw new Error('No se encontraron productos');
        
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Seleccione un producto</option>';
        
        const categoria = data.data.find(cat => cat.categoryId == categoriaId);
        if (categoria && categoria.products) {
            categoria.products.forEach(producto => {
                const option = document.createElement('option');
                option.value = JSON.stringify({ id: producto.id, name: producto.name });
                option.textContent = producto.name;
                if (producto.name === productoNombre) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error al cargar productos', 'danger', 'notificacionCrear');
    }
}

// Crear producto personalizado
async function crearProducto() {
    const categoriaValue = document.getElementById('categoriaNuevo').value;
    const productoValue = document.getElementById('productoNuevo').value;
    const descripcion = document.getElementById('descripcionNuevo').value.trim();
    const imagenInput = document.getElementById('imagenNuevo');
    const imagen = imagenInput.files[0];

    try {
        // Validaciones
        if (!categoriaValue) throw new Error('Debe seleccionar una categoría');
        if (!productoValue) throw new Error('Debe seleccionar un producto');
        if (!descripcion) throw new Error('La descripción es obligatoria');
        if (imagen && !imagen.type.startsWith('image/')) {
            throw new Error('El archivo seleccionado no es una imagen válida');
        }

        const categoria = JSON.parse(categoriaValue);
        const producto = JSON.parse(productoValue);

        const formData = new FormData();
        formData.append('Id_producto', producto.id);
        formData.append('NombreProducto', producto.name);
        formData.append('Descripcion', descripcion);
        formData.append('NombreCategoria', categoria.name);
        if (imagen) {
            formData.append('Imagen', imagen);
        }

        const response = await fetch(PRODUCTOS_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: formData
        });

        const data = await response.json();
        console.log('Respuesta de crear producto:', data);
        if (!response.ok) throw new Error(data.message || 'Error al crear producto');

        const productoCreado = data || {};
        if (!productoCreado.Id) throw new Error('No se recibió el ID del producto creado');

        mostrarNotificacion('Producto creado exitosamente', 'success', 'notificacionCrear');

        // Agregar la nueva fila a la tabla dinámicamente
        try {
            const table = $('#dataTable').DataTable();

            // Construir los datos de la nueva fila
            const baseUrl = 'http://localhost:3000';
            const imagenUrl = productoCreado.Imagen && productoCreado.Imagen.startsWith('/')
                ? `${baseUrl}${productoCreado.Imagen}`
                : productoCreado.Imagen;
            const imagenHtml = imagenUrl && imagenUrl.startsWith('http')
                ? `<img src="${imagenUrl}?t=${Date.now()}" alt="Producto" style="max-width: 100px;">`
                : productoCreado.Imagen
                ? `<span>${productoCreado.Imagen}</span>`
                : '<span>Sin imagen</span>';

            const estadoHtml = productoCreado.Estado
                ? '<span class="estado">Habilitado</span>'
                : '<span class="estado">Deshabilitado</span>';

            const accionesHtml = `
                <a href="#" class="btn btn-outline-warning btn-sm btn-actualizar-producto" data-id="${productoCreado.Id}" data-toggle="modal" data-target="#actualizarProductoModal" role="button">
                    <i class="bi bi-pencil"></i>
                </a>
                <a href="#" class="btn btn-outline-danger btn-sm btn-eliminar-producto" data-id="${productoCreado.Id}" data-toggle="modal" data-target="#eliminarModal" role="button">
                    <i class="bi bi-trash"></i>
                </a>
                ${productoCreado.Estado
                    ? `<a href="#" class="btn btn-outline-secondary btn-sm btn-deshabilitar-producto" data-id="${productoCreado.Id}" role="button"><i class="bi bi-eye-slash"></i></a>`
                    : `<a href="#" class="btn btn-outline-success btn-sm btn-habilitar-producto" data-id="${productoCreado.Id}" role="button"><i class="bi bi-eye"></i></a>`
                }
            `;

            const newRowData = [
                productoCreado.Id,
                `<span class="nombre">${productoCreado.NombreProducto}</span>`,
                `<span class="descripcion">${productoCreado.Descripcion}</span>`,
                imagenHtml,
                `<span class="categoria">${productoCreado.NombreCategoria}</span>`,
                estadoHtml,
                accionesHtml
            ];

            // Agregar la fila con el atributo data-id-producto
            const rowNode = table.row.add(newRowData).node();
            $(rowNode).attr('data-id-producto', productoCreado.Id);
            table.draw(false);
            console.log('Fila agregada exitosamente a DataTables');
        } catch (error) {
            console.error('Error al agregar fila en DataTables:', error);
            mostrarNotificacion('Producto creado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning', 'notificacionCrear');
            await recargarTabla();
        }

        // Restablecer el formulario y cerrar el modal
        document.getElementById('formCrearProducto').reset();
        document.getElementById('imagenPrevia').style.display = 'none';
        $('#crearProductoModal').modal('hide');
    } catch (error) {
        console.error('Error al crear producto:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionCrear');
    }
}

// Recargar tabla
async function recargarTabla() {
    try {
        const response = await fetch(PRODUCTOS_URL, {
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) throw new Error('Formato de datos inválido');

        const table = $('#dataTable');
        if ($.fn.DataTable.isDataTable(table)) {
            console.log('Destruyendo DataTables existente...');
            table.DataTable().clear().destroy();
        }

        table.find('tbody').empty();

        data.data.forEach(producto => {
            const baseUrl = 'http://localhost:3000';
            const imagenUrl = producto.Imagen && producto.Imagen.startsWith('/')
                ? `${baseUrl}${producto.Imagen}`
                : producto.Imagen;
            const imagenHtml = imagenUrl && imagenUrl.startsWith('http')
                ? `<img src="${imagenUrl}" alt="Producto" style="max-width: 100px;">`
                : producto.Imagen
                ? `<span>${producto.Imagen}</span>`
                : '<span>Sin imagen</span>';

            const estadoHtml = producto.Estado
                ? '<span class="estado">Habilitado</span>'
                : '<span class="estado">Deshabilitado</span>';

            const accionesHtml = `
                <a href="#" class="btn btn-outline-warning btn-sm btn-actualizar-producto" data-id="${producto.Id}" data-toggle="modal" data-target="#actualizarProductoModal" role="button">
                    <i class="bi bi-pencil"></i>
                </a>
                <a href="#" class="btn btn-outline-danger btn-sm btn-eliminar-producto" data-id="${producto.Id}" data-toggle="modal" data-target="#eliminarModal" role="button">
                    <i class="bi bi-trash"></i>
                </a>
                ${producto.Estado
                    ? `<a href="#" class="btn btn-outline-secondary btn-sm btn-deshabilitar-producto" data-id="${producto.Id}" role="button"><i class="bi bi-eye-slash"></i></a>`
                    : `<a href="#" class="btn btn-outline-success btn-sm btn-habilitar-producto" data-id="${producto.Id}" role="button"><i class="bi bi-eye"></i></a>`
                }
            `;

            const tr = document.createElement('tr');
            tr.setAttribute('data-id-producto', producto.Id);
            tr.innerHTML = `
                <td>${producto.Id}</td>
                <td><span class="nombre">${producto.NombreProducto}</span></td>
                <td><span class="descripcion">${producto.Descripcion}</span></td>
                <td>${imagenHtml}</td>
                <td><span class="categoria">${producto.NombreCategoria}</span></td>
                <td>${estadoHtml}</td>
                <td>${accionesHtml}</td>
            `;
            table.find('tbody').append(tr);
        });

        console.log('Inicializando DataTables...');
        table.DataTable({
            language: {
                emptyTable: "No hay datos disponibles en la tabla",
                info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                infoFiltered: "(filtrado de _MAX_ entradas totales)",
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
                }
            },
            destroy: true
        });
    } catch (error) {
        console.error('Error al recargar tabla:', error);
        mostrarNotificacion('Error al recargar la tabla', 'danger', 'notificacionCrear');
    }
}

// Función para cargar datos en el modal de edición
async function cargarDatosParaEditar(productoId) {
    try {
        // Primero cargamos las categorías
        const categorias = await cargarCategoriasEnSelect('categoriaActualizar');
        
        // Obtenemos los datos del producto de la tabla
        const fila = document.querySelector(`tr[data-id-producto="${productoId}"]`);
        if (!fila) throw new Error('No se encontró el producto en la tabla');
        
        const nombre = fila.querySelector('.nombre').textContent;
        const descripcion = fila.querySelector('.descripcion').textContent;
        const categoriaNombre = fila.querySelector('.categoria').textContent;
        const imagenSrc = fila.querySelector('img') ? fila.querySelector('img').src : '';
        
        // Buscamos la categoría correspondiente
        const categoria = categorias.find(cat => cat.categoryName === categoriaNombre);
        if (!categoria) throw new Error('No se encontró la categoría del producto');
        
        // Llenamos los campos del modal
        document.getElementById('productoIdActualizar').value = productoId;
        document.getElementById('descripcionActualizar').value = descripcion;
        
        // Seleccionamos la categoría en el select
        const selectCategoria = document.getElementById('categoriaActualizar');
        selectCategoria.value = JSON.stringify({ id: categoria.categoryId, name: categoria.categoryName });
        
        // Cargamos los productos de la categoría seleccionada
        await cargarProductosPorCategoria(categoria.categoryId, 'productoActualizar', nombre);
        
        // Configuramos la imagen previa si existe
        const imagenPrevia = document.getElementById('imagenPreviaActualizar');
        if (imagenSrc) {
            imagenPrevia.src = imagenSrc;
            imagenPrevia.style.display = 'block';
        } else {
            imagenPrevia.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error al cargar datos para editar:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionActualizar');
    }
}

// Función para actualizar un campo específico del producto
async function actualizarCampoProducto(productoId, campo, valor) {
    try {
        const formData = new FormData();
        formData.append(campo, valor);

        const response = await fetch(`${PRODUCTOS_URL}/${productoId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: formData
        });

        const data = await response.json();
        console.log(`Respuesta de actualizar ${campo}:`, data);
        if (!response.ok) throw new Error(data.message || `Error al actualizar ${campo}`);
        console.log("DATA ************ ", data)
        const productoActualizado = data || {};
        console.log(`Producto actualizado:`, productoActualizado);

        mostrarNotificacion(`${campo} actualizado exitosamente`, 'success', 'notificacionActualizar');

        try {
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).attr('data-id-producto') == productoId;
            }).nodes()[0];

            if (!row) throw new Error('Fila no encontrada en la tabla');

            const rowData = table.row(row).data();
            const updatedRowData = [...rowData];

            if (campo === 'Descripcion') {
                updatedRowData[2] = `<span class="descripcion">${valor}</span>`;
            } else if (campo === 'Imagen') {
                const baseUrl = 'http://localhost:3000';
                let imagenUrl;

                // Priorizar la URL de la imagen devuelta por la API
                console.log(productoActualizado, " ***************************")
                if (productoActualizado.Imagen) {
                    imagenUrl = productoActualizado.Imagen.startsWith('/')
                        ? `${baseUrl}${productoActualizado.Imagen}`
                        : productoActualizado.Imagen.startsWith('http')
                        ? productoActualizado.Imagen
                        : `${baseUrl}/${productoActualizado.Imagen}`; // Manejar URLs relativas sin /
                    console.log(`URL de la imagen desde API: ${imagenUrl}`);
                } else {
                    console.warn('No se encontró Imagen en la respuesta de la API. Intentando mantener la imagen actual...');
                    // Intentar mantener la imagen actual
                    imagenUrl = rowData[3].includes('img src="')
                        ? rowData[3].match(/src="([^"]+)"/)?.[1]
                        : null;
                    console.log(`URL de la imagen desde rowData: ${imagenUrl}`);

                    // Si no hay URL válida, recargar la tabla para obtener la imagen actualizada
                    if (!imagenUrl) {
                        console.warn('No se pudo determinar la URL de la imagen. Recargando tabla...');
                        mostrarNotificacion('Imagen actualizada, pero no se pudo mostrar. Recargando datos...', 'warning', 'notificacionActualizar');
                        await recargarTabla();
                        $('#actualizarProductoModal').modal('hide');
                        return;
                    }
                }

                updatedRowData[3] = imagenUrl && imagenUrl.startsWith('http')
                    ? `<img src="${imagenUrl}?t=${Date.now()}" alt="Producto" style="max-width: 100px;">`
                    : '<span>Sin imagen</span>';
                console.log(`Celda de imagen actualizada: ${updatedRowData[3]}`);
            }

            table.row(row).data(updatedRowData).draw(false);
            console.log('Fila actualizada exitosamente');
        } catch (error) {
            console.error(`Error al actualizar fila en DataTables para ${campo}:`, error);
            mostrarNotificacion(`${campo} actualizado, pero no se pudo actualizar la tabla. Recargando datos...`, 'warning', 'notificacionActualizar');
            await recargarTabla();
        }

        $('#actualizarProductoModal').modal('hide');
    } catch (error) {
        console.error(`Error al actualizar ${campo}:`, error);
        mostrarNotificacion(error.message, 'danger', 'notificacionActualizar');
    }
}

async function actualizarCamposProducto(productoId, campos) {
    try {
        const formData = new FormData();
        for (const [key, value] of Object.entries(campos)) {
            formData.append(key, value);
        }

        const response = await fetch(`${PRODUCTOS_URL}/${productoId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: formData
        });

        const data = await response.json();
        console.log('Respuesta de actualizar campos:', data);
        if (!response.ok) throw new Error(data.message || 'Error al actualizar campos');

        const productoActualizado = data.data || {};

        mostrarNotificacion('Campos actualizados exitosamente', 'success', 'notificacionActualizar');

        try {
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).attr('data-id-producto') == productoId;
            }).nodes()[0];

            if (!row) throw new Error('Fila no encontrada en la tabla');

            const rowData = table.row(row).data();
            const updatedRowData = [...rowData];

            // Actualizar las columnas correspondientes con las clases adecuadas
            if (campos.NombreProducto) {
                updatedRowData[1] = `<span class="nombre">${campos.NombreProducto}</span>`;
            }
            if (campos.NombreCategoria) {
                updatedRowData[4] = `<span class="categoria">${campos.NombreCategoria}</span>`;
            }

            table.row(row).data(updatedRowData).draw(false);
            console.log('Fila actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar fila en DataTables:', error);
            mostrarNotificacion('Campos actualizados, pero no se pudo actualizar la tabla. Recargando datos...', 'warning', 'notificacionActualizar');
            await recargarTabla();
        }

        $('#actualizarProductoModal').modal('hide');
    } catch (error) {
        console.error('Error al actualizar campos:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionActualizar');
    }
}

// Función para eliminar un producto
async function eliminarProducto(productoId) {
    try {
        const response = await fetch(`${PRODUCTOS_URL}/${productoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            }
        });

        const data = await response.json();
        console.log('Respuesta de eliminar producto:', data);
        if (!response.ok) throw new Error(data.message || 'Error al eliminar producto');

        mostrarNotificacion('Producto eliminado exitosamente', 'success', 'notificacionEliminar');

        // Eliminar la fila de la tabla dinámicamente
        try {
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).attr('data-id-producto') == productoId;
            }).nodes()[0];

            if (!row) throw new Error('Fila no encontrada en la tabla');

            table.row(row).remove().draw(false);
            console.log('Fila eliminada exitosamente de DataTables');
        } catch (error) {
            console.error('Error al eliminar fila en DataTables:', error);
            mostrarNotificacion('Producto eliminado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning', 'notificacionEliminar');
            await recargarTabla();
        }

        $('#eliminarModal').modal('hide');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionEliminar');
    }
}

// Función para habilitar/deshabilitar un producto
async function cambiarEstadoProducto(productoId, estado) {
    try {
        const formData = new FormData();
        formData.append('Estado', estado);
        
        const response = await fetch(`${PRODUCTOS_URL}/${productoId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: formData
        });

        const data = await response.json();
        console.log('Respuesta de cambiar estado:', data);
        if (!response.ok) throw new Error(data.message || 'Error al cambiar el estado del producto');

        mostrarNotificacion(`Producto ${estado ? 'habilitado' : 'deshabilitado'} exitosamente`, 'success', 'notificacionCrear');

        // Actualizar la fila en(activity) en la tabla
        try {
            const table = $('#dataTable').DataTable();
            const row = table.rows((idx, data, node) => {
                return $(node).attr('data-id-producto') == productoId;
            }).nodes()[0];

            if (!row) throw new Error('Fila no encontrada en la tabla');

            const rowData = table.row(row).data();
            const updatedRowData = [...rowData];

            // Actualizar la columna de estado
            updatedRowData[5] = estado
                ? '<span class="estado">Habilitado</span>'
                : '<span class="estado">Deshabilitado</span>';

            // Actualizar la columna de acciones (botones)
            updatedRowData[6] = `
                <a href="#" class="btn btn-outline-warning btn-sm btn-actualizar-producto" data-id="${productoId}" data-toggle="modal" data-target="#actualizarProductoModal" role="button">
                    <i class="bi bi-pencil"></i>
                </a>
                <a href="#" class="btn btn-outline-danger btn-sm btn-eliminar-producto" data-id="${productoId}" data-toggle="modal" data-target="#eliminarModal" role="button">
                    <i class="bi bi-trash"></i>
                </a>
                ${estado
                    ? `<a href="#" class="btn btn-outline-secondary btn-sm btn-deshabilitar-producto" data-id="${productoId}" role="button"><i class="bi bi-eye-slash"></i></a>`
                    : `<a href="#" class="btn btn-outline-success btn-sm btn-habilitar-producto" data-id="${productoId}" role="button"><i class="bi bi-eye"></i></a>`
                }
            `;

            table.row(row).data(updatedRowData).draw(false);
            console.log('Fila actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar fila en DataTables:', error);
            mostrarNotificacion('Estado actualizado, pero no se pudo actualizar la tabla. Recargando datos...', 'warning', 'notificacionCrear');
            await recargarTabla();
        }
    } catch (error) {
        console.error('Error al cambiar el estado del producto:', error);
        mostrarNotificacion(error.message, 'danger', 'notificacionCrear');
    }
}

// Manejadores de eventos
document.addEventListener('DOMContentLoaded', () => {
    // Limpiar y cargar categorías al abrir el modal de creación
    $('#crearProductoModal').on('show.bs.modal', () => {
        limpiarNotificacion('notificacionCrear');
        document.getElementById('formCrearProducto').reset();
        document.getElementById('imagenPrevia').style.display = 'none';
        cargarCategoriasEnSelect('categoriaNuevo');
        document.getElementById('productoNuevo').innerHTML = '<option value="">Seleccione un producto</option>';
    });

    // Limpiar notificaciones al abrir el modal de eliminación
    $('#eliminarModal').on('show.bs.modal', () => {
        limpiarNotificacion('notificacionEliminar');
    });

    // Cargar productos al cambiar categoría en modal de creación
    document.getElementById('categoriaNuevo').addEventListener('change', (e) => {
        const categoriaValue = e.target.value;
        if (categoriaValue) {
            const categoria = JSON.parse(categoriaValue);
            cargarProductosPorCategoria(categoria.id, 'productoNuevo');
        } else {
            document.getElementById('productoNuevo').innerHTML = '<option value="">Seleccione un producto</option>';
        }
    });

    // Vista previa de la imagen en modal de creación
    document.getElementById('imagenNuevo').addEventListener('change', (e) => {
        const imagenPrevia = document.getElementById('imagenPrevia');
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            imagenPrevia.src = URL.createObjectURL(file);
            imagenPrevia.style.display = 'block';
        } else {
            imagenPrevia.style.display = 'none';
            imagenPrevia.src = '';
        }
    });

    // Botón guardar en modal de creación
    document.getElementById('btnGuardarProducto').addEventListener('click', (e) => {
        e.preventDefault();
        crearProducto();
    });

    // Manejador para abrir el modal de edición
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-actualizar-producto')) {
            const productoId = e.target.closest('.btn-actualizar-producto').getAttribute('data-id');
            cargarDatosParaEditar(productoId);
        }
    });

    // Manejador para actualizar categoría y producto
    document.getElementById('btnActualizarCategoriaProducto').addEventListener('click', () => {
        const productoId = document.getElementById('productoIdActualizar').value;
        const categoriaValue = document.getElementById('categoriaActualizar').value;
        const productoValue = document.getElementById('productoActualizar').value;
        if (!categoriaValue || !productoValue) {
            mostrarNotificacion('Debe seleccionar una categoría y un producto', 'danger', 'notificacionActualizar');
            return;
        }
        const categoria = JSON.parse(categoriaValue);
        const producto = JSON.parse(productoValue);
        const campos = {
            NombreCategoria: categoria.name,
            NombreProducto: producto.name,
            Id_producto: producto.id
        };
        actualizarCamposProducto(productoId, campos);
    });

    document.getElementById('btnActualizarDescripcion').addEventListener('click', () => {
        const productoId = document.getElementById('productoIdActualizar').value;
        const descripcion = document.getElementById('descripcionActualizar').value.trim();
        if (!descripcion) {
            mostrarNotificacion('La descripción es obligatoria', 'danger', 'notificacionActualizar');
            return;
        }
        actualizarCampoProducto(productoId, 'Descripcion', descripcion);
    });

    document.getElementById('btnActualizarImagen').addEventListener('click', () => {
        const productoId = document.getElementById('productoIdActualizar').value;
        const imagenInput = document.getElementById('imagenActualizar');
        const imagen = imagenInput.files[0];
        if (!imagen) {
            mostrarNotificacion('Debe seleccionar una imagen', 'danger', 'notificacionActualizar');
            return;
        }
        if (!imagen.type.startsWith('image/')) {
            mostrarNotificacion('El archivo debe ser una imagen válida', 'danger', 'notificacionActualizar');
            return;
        }
        actualizarCampoProducto(productoId, 'Imagen', imagen);
    });

    // Vista previa de la imagen en el modal de edición
    document.getElementById('imagenActualizar').addEventListener('change', (e) => {
        const imagenPrevia = document.getElementById('imagenPreviaActualizar');
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            imagenPrevia.src = URL.createObjectURL(file);
            imagenPrevia.style.display = 'block';
        } else {
            imagenPrevia.style.display = 'none';
            imagenPrevia.src = '';
        }
    });

    // Cargar productos cuando cambia la categoría en el modal de edición
    document.getElementById('categoriaActualizar').addEventListener('change', (e) => {
        const categoriaValue = e.target.value;
        if (categoriaValue) {
            const categoria = JSON.parse(categoriaValue);
            const productoActual = document.getElementById('productoActualizar').value;
            const productoNombre = productoActual ? JSON.parse(productoActual).name : '';
            cargarProductosPorCategoria(categoria.id, 'productoActualizar', productoNombre);
        } else {
            document.getElementById('productoActualizar').innerHTML = '<option value="">Seleccione un producto</option>';
        }
    });

    // Manejador para abrir el modal de eliminación y guardar el ID del producto
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-eliminar-producto')) {
            const productoId = e.target.closest('.btn-eliminar-producto').getAttribute('data-id');
            // Guardar el ID del producto en el botón de confirmación
            document.getElementById('btnConfirmarEliminar').setAttribute('data-id', productoId);
        }
    });

    // Manejador para confirmar la eliminación
    document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
        const productoId = document.getElementById('btnConfirmarEliminar').getAttribute('data-id');
        if (productoId) {
            eliminarProducto(productoId);
        } else {
            mostrarNotificacion('No se encontró el ID del producto', 'danger', 'notificacionEliminar');
        }
    });

    // Manejadores para habilitar/deshabilitar producto
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-habilitar-producto')) {
            const productoId = e.target.closest('.btn-habilitar-producto').getAttribute('data-id');
            cambiarEstadoProducto(productoId, true); // Cambia a habilitado (true)
            console.log(true)
        } else if (e.target.closest('.btn-deshabilitar-producto')) {
            console.log("Deshabilitando producto");
            const productoId = e.target.closest('.btn-deshabilitar-producto').getAttribute('data-id');
            console.log("falso")
            cambiarEstadoProducto(productoId, false); // Cambia a deshabilitado (false)
        }
    });

    // Cargar datos iniciales
    recargarTabla();
});