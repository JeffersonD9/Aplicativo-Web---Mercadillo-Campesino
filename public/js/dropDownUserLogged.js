document.addEventListener('DOMContentLoaded', function() {
    const iniciarSesionBtn = document.getElementById('iniciar-sesion');
    if (iniciarSesionBtn) {
        iniciarSesionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'flex';
            }
        });
    }
    
    const userDropdown = document.querySelector('.user-dropdown');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    
    if (userDropdown) {
        const dropdownToggle = userDropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = userDropdown.querySelector('.dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', function() {

                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                } else {
                    dropdownMenu.style.display = 'block';
                }
            });
            
            document.addEventListener('click', function(e) {
                if (!userDropdown.contains(e.target)) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }
    }
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            fetch('/MercadilloBucaramanga/LogOut', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {

                    mostrarNotificacion('Tu sesión ha finalizado. Redirigiendo...', 'warning');
                    
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
                mostrarNotificacion('Error al cerrar sesión', 'error');
            });
        });
    }
    
    function mostrarNotificacion(mensaje, tipo) {

        let notificacion = document.getElementById('notificacion');
        if (!notificacion) {
            notificacion = document.createElement('div');
            notificacion.id = 'notificacion';
            notificacion.className = 'alert';
            notificacion.style.position = 'fixed';
            notificacion.style.top = '20px';
            notificacion.style.right = '20px';
            notificacion.style.zIndex = '9999';
            notificacion.style.padding = '12px 20px';
            notificacion.style.borderRadius = '8px';
            document.body.appendChild(notificacion);
        }
        
        if (tipo === 'warning') {
            notificacion.style.backgroundColor = '#f8d7da';
            notificacion.style.color = '#721c24';
        } else if (tipo === 'error') {
            notificacion.style.backgroundColor = '#f8d7da';
            notificacion.style.color = '#721c24';
        } else if (tipo === 'success') {
            notificacion.style.backgroundColor = '#d4edda';
            notificacion.style.color = '#155724';
        }
        
        notificacion.textContent = mensaje;
        
        notificacion.style.display = 'block';
        
        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 1500);
    }
});