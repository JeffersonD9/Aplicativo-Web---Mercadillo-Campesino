
// Obtener el botón
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Mostrar el botón cuando el usuario se desplaza hacia abajo 20px desde la parte superior de la página
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Desplazarse hacia arriba cuando se hace clic en el botón
scrollToTopBtn.addEventListener("click", function() {
    document.body.scrollTop = 0; // Para navegadores Safari
    document.documentElement.scrollTop = 0; // Para otros navegadores
});