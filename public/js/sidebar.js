const data = document.querySelector("#data");

function toggleCollapse(index) {
    const buttonId = `toggleButton${index}`;
    const collapseId = `collapseContent${index}`;
    const collapseElement = document.getElementById(collapseId);
    const buttonElement = document.getElementById(buttonId);

    // Verificar el estado actual de la lista
    const isOpen = collapseElement.classList.contains("show");

    // Cambiar el estado de la lista y el botón según el estado actual
    if (isOpen) {
      collapseElement.classList.remove("show");
      buttonElement.classList.remove("bi-arrow-up-short");
      buttonElement.classList.add("bi-arrow-down-short");
      buttonElement.setAttribute("aria-expanded", "false");
    } else {
      buttonElement.classList.remove("bi-arrow-down-short");
      buttonElement.classList.add("bi-arrow-up-short");

      collapseElement.classList.add("show");
      buttonElement.setAttribute("aria-expanded", "true");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const dataElement = document.querySelector("#data");
  
    fetch("/MercadilloBucaramanga/sideBar")
      .then((response) => response.json())
      .then((data) => {

        let html = `<ul class="navbar-nav flex-column">
        
        <a href="/MercadilloBucaramanga/CatalogosRegistrados" class=" btn-catalogo-nav btn btn-catalogo-nav d-flex pt-2 justify-content-start ">
          Catálogos 
        </a>`;
  
        data.categoriasConCatalogo.forEach((catalogo, index) => {
          html += `
            <div class="d-flex mt-2">
            
              <a class="btn-arrow">
                <li
                  class="bi bi-arrow-down-short d-flex justify-content-end align-items-center cursor-pointer btn"
                  id="toggleButton${index}"
                  onclick="toggleCollapse('${index}')"
                ></li>
              </a>
    
              <a
                class="btn-catalogo-nav btn"
                aria-expanded="false"
                href="/MercadilloBucaramanga/filtrar/catalogo/${catalogo.Nombre}"
                aria-controls="collapseContent${index}"
              >
                ${catalogo.Nombre}
              </a>
            </div>
    
            <div class="collapse" id="collapseContent${index}">
              <div class="small m-cate-cat">Categorías</div>
              <ul class="small m-cate-cat">
          `;
  
          for (let i = 0; i < catalogo.categorias.length; i++) {
            html += `
                <li>
                  <a class="text-decoration-none" href="/MercadilloBucaramanga/filtrar/categoria/${catalogo.categorias[i].Nombre}">
                    ${catalogo.categorias[i].Nombre}
                  </a>
                </li>
            `;
          }
  
          html += `
              </ul>
            </div>
          `;
        });
  
        html += `</ul>`;
  
        // Establecer el HTML generado en el elemento #data
        dataElement.innerHTML = html;
  
      })
      .catch((error) => {
        console.error("Error fetching sidebar data:", error);
      });
  });
  