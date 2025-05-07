import { getCookie } from "../expresiones.js";
const API_BASE_URL = '/MercadilloBucaramanga/Admin/Mercadillos';

document.addEventListener('DOMContentLoaded', function() {
    // Manejar clic en botón editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const fila = this.closest('tr');
            const nombre = fila.querySelector('.nombre').textContent;
            const direccion = fila.querySelector('.direccion').textContent;
            
            document.getElementById('idEditar').value = id;
            document.getElementById('nombreEditar').value = nombre;
            document.getElementById('direccionEditar').value = direccion;
        });
    });

    // Manejar clic en botón eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            document.getElementById('idEliminar').value = id;
        });
    });

    // Configurar el botón de confirmar eliminación
    document.getElementById('btnConfirmarEliminar')?.addEventListener('click', function() {
        const id = document.getElementById('idEliminar').value;
        eliminarMercadillo(id);
    });

    // Configurar el botón de guardar edición
    document.getElementById('btnGuardarEdicion')?.addEventListener('click', function() {
        const id = document.getElementById('idEditar').value;
        const nombre = document.getElementById('nombreEditar').value;
        const direccion = document.getElementById('direccionEditar').value;
        
        actualizarMercadillo(id, nombre, direccion);
    });

    // Configurar el botón de crear nuevo
    document.getElementById('btnGuardarNuevo')?.addEventListener('click', function() {
        const nombre = document.getElementById('nombreNuevo').value;
        const direccion = document.getElementById('direccionNueva').value;
        
        crearMercadillo(nombre, direccion);
    });
});

async function eliminarMercadillo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            location.reload();
        } else {
            alert(`Error al eliminar: ${data.message || 'Error desconocido'}`);
            console.error('Detalles del error:', data);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error de conexión al intentar eliminar');
    }
}

async function actualizarMercadillo(id, nombre, direccion) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({ 
                Nombre: nombre, 
                Direccion: direccion 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            location.reload();
        } else {
            alert(`Error al actualizar: ${data.message || 'Error desconocido'}`);
            console.error('Detalles del error:', data);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error de conexión al intentar actualizar');
    }
}

async function crearMercadillo(nombre, direccion) {
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({ 
                Nombre: nombre, 
                Direccion: direccion 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            location.reload();
        } else {
            alert(`Error al crear: ${data.message || 'Error desconocido'}`);
            console.error('Detalles del error:', data);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error de conexión al intentar crear');
    }
}