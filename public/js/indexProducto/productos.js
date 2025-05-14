document.addEventListener('DOMContentLoaded', () => {
  let allProducts = []; // Variable para almacenar todos los productos
  let selectedMercadillo = null; // Almacenar el mercadillo seleccionado
  let selectedProduct = null; // Almacenar el producto seleccionado
  let selectedProducer = null; // Almacenar el productor seleccionado
  let selectedCategory = null; // Almacenar la categoría seleccionada

  // Función para renderizar las tarjetas de productos
  const renderProducts = (products) => {
    const contentDiv = document.getElementById('productos');
    if (products.length === 0) {
      contentDiv.innerHTML = '<p class="text-muted p-2">No se encontraron productos</p>';
    } else {
      contentDiv.innerHTML = products.map((product, index) => {
        // Truncar descripción si excede 100 caracteres
        const maxLength = 100;
        let description = product.description || 'Sin descripción';
        let truncatedDescription = description;
        let showMoreLink = '';

        if (description.length > maxLength) {
          truncatedDescription = description.substring(0, maxLength) + '...';
          showMoreLink = `
            <a href="#" class="text-primary" data-toggle="modal" data-target="#descriptionModal${index}">Ver más</a>
          `;
        }

        return `
          <div class="col mb-4">
            <div class="card shadow-sm border-0 rounded-4 h-100">
              <!-- Imagen o placeholder -->
              ${product.image ? `
                <img src="${product.image}" 
                     class="card-img-top rounded-top-4" 
                     alt="${product.title}" 
                     style="height: 200px; object-fit: cover;">
              ` : `
                <div class="bg-secondary rounded-top-4 d-flex align-items-center justify-content-center text-white" 
                     style="height: 200px;">
                  <span class="fw-semibold">Sin imagen</span>
                </div>
              `}
              <!-- Cuerpo -->
              <div class="card-body">
                <small class="text-uppercase text-danger fw-bold">${product.category || 'Sin categoría'}</small>
                <h5 class="card-title fw-bold text-dark mt-1" style="color: #000 !important;">${product.title}</h5>
                <p class="mb-1" style="font-style: italic;">
                  <i class="bi bi-person-fill text-dark"></i>
                  <span class="fst-italic" style="color: #538d22;">${product.producer || 'No especificado'}</span>
                </p>
                <p class="mb-1" style="font-style: italic;">
                  <i class="bi bi-geo-alt-fill text-danger"></i>
                  <span class="fst-italic" style="color: #538d22;">${product.mercadillo || 'No especificado'}</span>
                </p>
                <p class="text-muted fst-italic">${truncatedDescription} ${showMoreLink}</p>
                <!-- Botón centrado (solo si hay número de teléfono) -->
                ${product.phone ? `
                  <div class="mt-3 d-flex justify-content-between">
                    <p class="m-0 text-danger fw-bold">Puesto ${product.puesto}</p>
                    <a href="https://wa.me/${product.phone}" target="_blank" class="btn btn-success btn-sm fw-bold">
                      <i class="bi bi-whatsapp"></i> 
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>
            <!-- Modal para descripción completa -->
            ${description.length > maxLength ? `
              <div class="modal fade" id="descriptionModal${index}" tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel${index}" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="descriptionModalLabel${index}">${product.title}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <textarea class="form-control" readonly style="width: 100%; height: 200px; resize: none; overflow-y: auto;">${description}</textarea>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  };

  // Función para renderizar categorías y productores
  const renderCategoriesAndProducers = (products) => {
    // Agrupar productos por categoría
    const groupedByCategory = products.reduce((acc, product) => {
      const { category, title } = product;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(title);
      return acc;
    }, {});

    // Obtener productores únicos
    const producers = [...new Set(products.map(product => product.producer || 'Sin productor'))];

    // Convertir el objeto agrupado en arreglo de categorías
    const categories = Object.keys(groupedByCategory).map(category => ({
      categoria: category,
      productos: groupedByCategory[category]
    }));

    // Generar el HTML dinámico
    const container = document.getElementById('dynamic-categories');
    let html = '';

    if (categories.length === 0 && producers.length === 0) {
      html = '<p class="text-muted p-2">No hay categorías ni productores disponibles</p>';
    } else {
      // Sección de Categorías
      if (categories.length > 0) {
        html += '<h6 class="p-2 m-0 font-weight-bold  text-light">Categorías</h6>';
        categories.forEach((item, index) => {
          html += `
            <li class="nav-item">
              <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#categoryCollapse${index}"
                 aria-expanded="true" aria-controls="categoryCollapse${index}">
                <i class="fas fa-fw fa-cog"></i>
                <span>${item.categoria}</span>
              </a>
              <div id="categoryCollapse${index}" class="collapse" aria-labelledby="categoryHeading${index}" data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                  <h6 class="collapse-header m-0 pl-2">${item.categoria}</h6>
          `;

          item.productos.forEach(producto => {
            html += `<a class="collapse-item m-0 pl-2" href="#" data-product="${producto}">${producto}</a>`;
          });

          html += `
                </div>
              </div>
            </li>
          `;
        });
      }

      // Sección de Productores
      if (producers.length > 0) {
        html += `
          <h6 class="p-2 m-0 font-weight-bold text-light mt-3">Productores</h6>
          <li class="nav-item">
            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#producerCollapse"
               aria-expanded="true" aria-controls="producerCollapse">
              <i class="fas fa-fw fa-user"></i>
              <span>Productores</span>
            </a>
            <div id="producerCollapse" class="collapse" aria-labelledby="producerHeading" data-parent="#accordionSidebar">
              <div class="bg-white py-2 collapse-inner rounded">
                <h6 class="collapse-header m-0 pl-2">Productores</h6>
        `;

        producers.forEach(producer => {
          html += `<a class="collapse-item m-0 pl-2" href="#" data-producer="${producer}">${producer}</a>`;
        });

        html += `
              </div>
            </div>
          </li>
        `;
      }
    }

    // Insertar el HTML en el contenedor
    container.innerHTML = html;
  };

  // Función para renderizar los botones de mercadillos y categorías
  const renderMercadillos = (mercadillos, products) => {
    // Filtrar productos por mercadillo seleccionado, si existe
    const filteredProducts = selectedMercadillo
      ? products.filter(product => product.mercadillo === selectedMercadillo)
      : products;

    // Obtener categorías únicas de los productos filtrados
    const categories = [...new Set(filteredProducts.map(product => product.category || 'Sin categoría').filter(c => c))];

    const mercadillosDiv = document.getElementById('mercadillos');
    mercadillosDiv.innerHTML = `
      <h5 class="mb-3">Filtrar por Mercadillo</h5>
      <div class="d-flex flex-wrap gap-2 mb-4 flex-sm-column flex-md-row">
        <button type="button" class="btn btn-outline-success flex-fill flex-sm-grow-0 ${selectedMercadillo === null ? 'active' : ''}" data-mercadillo="todos">Todos</button>
        ${mercadillos.map(mercadillo => `
          <button type="button" class="btn btn-outline-success flex-fill flex-sm-grow-0 ${selectedMercadillo === mercadillo ? 'active' : ''}" data-mercadillo="${mercadillo}">${mercadillo}</button>
        `).join('')}
      </div>
      <h5 class="mb-3">Filtrar por Categoría</h5>
      <div class="d-flex flex-wrap gap-2 flex-sm-column flex-md-row">
        <button type="button" class="btn btn-outline-success flex-fill flex-sm-grow-0 ${selectedCategory === null ? 'active' : ''}" data-category="todas">Todas</button>
        ${categories.map(category => `
          <button type="button" class="btn btn-outline-success flex-fill flex-sm-grow-0 ${selectedCategory === category ? 'active' : ''}" data-category="${category}">${category}</button>
        `).join('')}
      </div>
    `;
  };

  // Función para aplicar filtros a #productos
  const applyProductFilters = (searchTerm = '') => {
    let filteredProducts = allProducts;

    if (selectedMercadillo) {
      filteredProducts = filteredProducts.filter(product =>
        product.mercadillo === selectedMercadillo
      );
    }

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product =>
        (product.category || 'Sin categoría') === selectedCategory
      );
    }

    if (selectedProducer) {
      filteredProducts = filteredProducts.filter(product =>
        (product.producer || 'Sin productor') === selectedProducer
      );
    }

    if (selectedProduct) {
      filteredProducts = filteredProducts.filter(product =>
        product.title === selectedProduct
      );
    }

    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        (product.mercadillo && product.mercadillo.toLowerCase().includes(searchTerm))
      );
    }

    // Renderizar solo #productos
    renderProducts(filteredProducts);
  };

  // Función para aplicar filtros a #dynamic-categories
  const applyCategoryFilters = () => {
    let filteredProducts = allProducts;

    if (selectedMercadillo) {
      filteredProducts = filteredProducts.filter(product =>
        product.mercadillo === selectedMercadillo
      );
    }

    // Renderizar categorías y productores
    renderCategoriesAndProducers(filteredProducts);
  };

  // Hacer la solicitud a la ruta /Inicio/Productos
  fetch('/MercadilloBucaramanga/todosProductos')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      return response.json();
    })
    .then(data => {
      allProducts = data; // Guardar los productos
      console.log(data);

      // Obtener mercadillos únicos
      const mercadillos = [...new Set(data.map(product => product.mercadillo).filter(m => m))];

      // Renderizar botones de mercadillos y categorías
      renderMercadillos(mercadillos, allProducts);

      // Renderizar categorías y productores iniciales
      renderCategoriesAndProducers(allProducts);

      // Renderizar todos los productos inicialmente
      renderProducts(allProducts);

      // Configurar el buscador
      const searchForm = document.querySelector('.navbar-search');
      const searchInput = searchForm.querySelector('input');
      const searchButton = searchForm.querySelector('button');

      // Evento para los botones de mercadillos
      document.getElementById('mercadillos').addEventListener('click', (e) => {
        if (e.target.matches('button[data-mercadillo]')) {
          const mercadillo = e.target.dataset.mercadillo;
          selectedMercadillo = mercadillo === 'todos' ? null : mercadillo;
          selectedProduct = null; // Restablecer producto seleccionado
          selectedProducer = null; // Restablecer productor seleccionado
          selectedCategory = null; // Restablecer categoría seleccionada

          // Resaltar el botón seleccionado
          document.querySelectorAll('#mercadillos button[data-mercadillo]').forEach(btn => {
            btn.classList.remove('active');
          });
          e.target.classList.add('active');

          // Actualizar botones de categorías
          renderMercadillos(mercadillos, allProducts);

          // Resaltar el botón "Todas" de categorías por defecto
          document.querySelectorAll('#mercadillos button[data-category]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'todas') {
              btn.classList.add('active');
            }
          });

          applyCategoryFilters(); // Actualizar #dynamic-categories
          applyProductFilters(searchInput.value.trim().toLowerCase()); // Actualizar #productos
        }
      });

      // Evento para los botones de categorías
      document.getElementById('mercadillos').addEventListener('click', (e) => {
        if (e.target.matches('button[data-category]')) {
          const category = e.target.dataset.category;
          selectedCategory = category === 'todas' ? null : category;
          selectedProduct = null; // Restablecer producto seleccionado
          selectedProducer = null; // Restablecer productor seleccionado

          // Resaltar el botón seleccionado
          document.querySelectorAll('#mercadillos button[data-category]').forEach(btn => {
            btn.classList.remove('active');
          });
          e.target.classList.add('active');

          applyProductFilters(searchInput.value.trim().toLowerCase()); // Actualizar #productos
        }
      });

      // Evento para los productos y productores en #dynamic-categories
      document.getElementById('dynamic-categories').addEventListener('click', (e) => {
        if (e.target.matches('a[data-product]') || e.target.closest('a[data-product]')) {
          e.preventDefault();
          const link = e.target.closest('a[data-product]');
          selectedProduct = link.dataset.product;
          selectedProducer = null; // Restablecer productor seleccionado
          applyProductFilters(searchInput.value.trim().toLowerCase()); // Actualizar #productos
        } else if (e.target.matches('a[data-producer]') || e.target.closest('a[data-producer]')) {
          e.preventDefault();
          const link = e.target.closest('a[data-producer]');
          selectedProducer = link.dataset.producer;
          selectedProduct = null; // Restablecer producto seleccionado
          applyProductFilters(searchInput.value.trim().toLowerCase()); // Actualizar #productos
        }
      });

      // Evento para el formulario (submit)
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar recarga de página
        applyProductFilters(searchInput.value.trim().toLowerCase()); // Actualizar solo #productos
      });

      // Evento para el botón
      searchButton.addEventListener('click', () => {
        applyProductFilters(searchInput.value.trim().toLowerCase()); // Actualizar solo #productos
      });

      // Evento para el input (búsqueda en tiempo real)
      searchInput.addEventListener('input', () => {
        applyProductFilters(searchInput.value.trim().toLowerCase()); // Actualizar solo #productos
      });
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('dynamic-categories').innerHTML = '<p class="text-danger p-2">Error al cargar las categorías y productores</p>';
      document.getElementById('productos').innerHTML = '<p class="text-danger p-2">Error al cargar los productos</p>';
      document.getElementById('mercadillos').innerHTML = '<p class="text-danger p-2">Error al cargar los mercadillos</p>';
    });
});