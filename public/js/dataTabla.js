const dataTablaOpciones = {
    pageLength: 10,
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "Ningún usuario encontrado",
      info: " _START_ a _END_ de un total de _TOTAL_ registros",
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
  };

  export function load() {
    window.addEventListener("DOMContentLoaded", () => {
      let bodyTable = document.getElementById('table');
      if (bodyTable && bodyTable.rows.length > 0) {
        let prueba = new DataTable(bodyTable, dataTablaOpciones)
          .order([0, "dec"])
          .draw();
      } else {
        console.log("No hay registros en la tabla.");
      }
    });
  }
