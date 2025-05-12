import { getCookie } from "../expresiones.js";
console.log("Productos Personalizados");

// Configuración base
const API_BASE_URL = '/MercadilloBucaramanga';
const CATEGORIAS_URL = 'http://18.223.102.119:8080/api-REST/categorized-products';
const PRODUCTOS_URL = `${API_BASE_URL}/Usuario/Asignar-Productos`;
const token = getCookie("token");
const arrayToken = token.split(".");
const tokenPayload = JSON.parse(atob(arrayToken[1]));



// Inicializar DataTables
let dataTable;
document.addEventListener('DOMContentLoaded', () => {
    dataTable = $('#dataTable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
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
        
        const select = document.getElementById('categoriaNuevo');
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        data.data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = JSON.stringify({ id: categoria.categoryId, name: categoria.categoryName });
            option.textContent = categoria.categoryName;
            select.appendChild(option);
        });
        return data.data;
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        mostrarNotificacion('Error al cargar categorías', 'danger', 'notificacionCrear');
        return [];
    }
}

// Cargar productos por categoría
async function cargarProductosPorCategoria(categoriaId) {
    try {
        const response = await fetch(CATEGORIAS_URL, {
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        if (!data.success) throw new Error('No se encontraron productos');
        
        const select = document.getElementById('productoNuevo');
        select.innerHTML = '<option value="">Seleccione un producto</option>';
        
        const categoria = data.data.find(cat => cat.categoryId == categoriaId);
        if (categoria && categoria.products) {
            categoria.products.forEach(producto => {
                const option = document.createElement('option');
                option.value = JSON.stringify({ id: producto.id, name: producto.name });
                option.textContent = producto.name;
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
    const imagen = document.getElementById('imagenNuevo').value.trim();

    try {
        // Validaciones
        if (!categoriaValue) throw new Error('Debe seleccionar una categoría');
        if (!productoValue) throw new Error('Debe seleccionar un producto');

        const categoria = JSON.parse(categoriaValue);
        const producto = JSON.parse(productoValue);

        const datos = {
            Id_producto: producto.id,
            NombreProducto: producto.name,
            Descripcion: descripcion,
            Imagen: imagen || null,
            NombreCategoria: categoria.name
            
        };

        const response = await fetch(PRODUCTOS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify(datos)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al crear producto');

        mostrarNotificacion('Producto creado exitosamente', 'success', 'notificacionCrear');
        $('#crearProductoModal').modal('hide');
        document.getElementById('formCrearProducto').reset();
        recargarTabla();
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
        
        dataTable.clear();
        data.data.forEach(producto => {
            dataTable.row.add([
                producto.Id,
                producto.Nombre,
                producto.Descripcion,
                producto.Imagen || '',
                producto.Categoria,
                `
                <a href="#" class="btn btn-outline-danger btn-sm btn-eliminar-producto" data-id="${producto.Id}" data-toggle="modal" data-target="#eliminarModal" role="button">
                    <i class="bi bi-trash"></i>
                </a>
                `
            ]).draw();
        });
    } catch (error) {
        console.error('Error al recargar tabla:', error);
        mostrarNotificacion('Error al recargar la tabla', 'danger', 'notificacionCrear');
    }
}

// Manejadores de eventos
document.addEventListener('DOMContentLoaded', () => {
    // Limpiar y cargar categorías al abrir el modal
    $('#crearProductoModal').on('show.bs.modal', () => {
        limpiarNotificacion('notificacionCrear');
        document.getElementById('formCrearProducto').reset();
        cargarCategorias();
        document.getElementById('productoNuevo').innerHTML = '<option value="">Seleccione un producto</option>';
    });

    // Cargar productos al cambiar categoría
    document.getElementById('categoriaNuevo').addEventListener('change', (e) => {
        const categoriaValue = e.target.value;
        if (categoriaValue) {
            const categoria = JSON.parse(categoriaValue);
            cargarProductosPorCategoria(categoria.id);
        } else {
            document.getElementById('productoNuevo').innerHTML = '<option value="">Seleccione un producto</option>';
        }
    });

    // Botón guardar
    document.getElementById('btnGuardarProducto').addEventListener('click', (e) => {
        e.preventDefault();
        crearProducto();
    });
});