import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ListarDatosPrincipal(req, res) {
  try {
    const usuariosConCategoriasUnicas = await prisma.$queryRaw`
    SELECT ct.Nombre, u.UserName, u.Imagen, u.id
    FROM catalogos ct 
    JOIN categorias c ON ct.id = c.id_Cat 
    JOIN productos p ON p.id_Categoria = c.id join usuario u on u.id = p.id_Usuario
    GROUP BY ct.Nombre, u.UserName`;
    // Procesar los resultados y estructurarlos en el formato deseado
    const dataCatalogo = {};

    let i = 0;
    console.log(usuariosConCategoriasUnicas)
    usuariosConCategoriasUnicas.forEach((row) => {
      const { UserName, Nombre, Imagen, id } = row;
      // Si es la primera vez que encontramos este usuario, inicializamos su entrada en el objeto
     
       if (!dataCatalogo[UserName]) {
        dataCatalogo[UserName] = {
          catalogos: [],
          Imagen,
          id,
        };
        i++;
      }

      // Agregar el nombre del catálogo al arreglo de catálogos del usuario (si no existe ya)
      if (!dataCatalogo[UserName].catalogos.includes(Nombre)) {
        dataCatalogo[UserName].catalogos.push(Nombre);
      }
     
    });
   
    return res.render("main", { body: "catalogosRegistrados", dataCatalogo, UserName:req.user});
    
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

export async function DatosSidebarPrincipal(req, res) {
  try {
    const categoriasConCatalogo = await prisma.catalogos.findMany({
      select: {
        Nombre: true,
        categorias: {
          select: {
            Nombre: true,
            productos: {
              select: {
                Nombre: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({ categoriasConCatalogo });
  } catch (error) {
    console.error("Error al obtener los catalogos y categorias:", error);
  }
}

export async function FiltrarCatalogosPrincipal(req, res) {
  try {
    let catalogo = req.params.nombrecatalogo;
    catalogo = catalogo.charAt(0).toUpperCase() + catalogo.slice(1); //colocar la primera letra en Mayuscula

    let catalogoEncontrado = false;
    const catalogos = await prisma.catalogos.findMany(); //Encontrar los catalogos

    const buscarCatalogos = await prisma.$queryRaw` 
        SELECT ct.Nombre, u.UserName, u.Imagen, u.id
        FROM catalogos ct 
        JOIN categorias c ON ct.id = c.id_Cat 
        JOIN productos p ON p.id_Categoria = c.id 
        JOIN usuario u ON u.id = p.id_Usuario
        WHERE ct.Nombre = ${catalogo}  -- Aquí se filtra por el nombre del catalogo 
        GROUP BY ct.Nombre, u.UserName`; //Buscar los catalogos que conrrespondan al catalogo ingresado

    for (let i = 0; i < catalogos.length; i++) {
      // Verificamos si el nombre es 'Frutas'
      if (catalogos[i].Nombre === catalogo) {
        // Si encontramos un catalogo, retornamos true
        catalogoEncontrado = true;
        break;
      }
    }

    if (catalogoEncontrado) {
      // Si se encontró el catálogo
      let titulo = `Catálogo/${catalogo}`;
      const dataCatalogo = {};
      let i = 0;
      buscarCatalogos.forEach((row) => {
        const { UserName, Nombre, Imagen, id } = row;

        // Si es la primera vez que encontramos este usuario, inicializamos su entrada en el objeto
        if (!dataCatalogo[UserName]) {
          //fs.writeFileSync(path.join("./dbimagenes/" + id + ".png"), Imagen);
          //const imgUsuario = fs.readdirSync(path.join("./dbimagenes/"));
          dataCatalogo[UserName] = {
            catalogos: [],
            Imagen: Imagen,
            id,
          };
          i++;
        }

        // Agregar el nombre del catálogo al arreglo de catálogos del usuario (si no existe ya)
        if (!dataCatalogo[UserName].catalogos.includes(Nombre)) {
          dataCatalogo[UserName].catalogos.push(Nombre);
        }
      });

      return res.render("main", { body: "datosFiltroCatalogo",dataCatalogo,titulo,UserName: req.user });
    } else {
      // Si no se encontró el catálogo, enviamos una respuesta indicando que no se encontraron catálogos
      res.send("No se encontró el catálogo.");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function FiltrarCategoriaPrincipal(req, res) {
  let categoria = req.params.nombrecategoria;
  let titulo = `Categoría/${categoria}`;
  categoria = categoria.charAt(0).toUpperCase() + categoria.slice(1); //colocar la primera letra en Mayuscula
  try {
    const result = await prisma.usuario.findMany({
      where: {
        productos: {
          some: {
            categorias: {
              Nombre: categoria, // Filtrar por nombre de categoría igual a 'categoria'
            },
          },
        },
      },
      include: {
        productos: {
          where: {
            categorias: {
              Nombre: categoria, // Filtrar por nombre de categoría igual a 'categoria'
            },
          },
          include: {
            categorias: true, // Incluir la información de categorías relacionadas con los productos filtrados
          },
        },
      },
    });

    // Ordenar los productos disponibles primero en cada usuario
    result.forEach((usuario) => {
      usuario.Imagen = usuario.Imagen; //le asigno la imagen al usuario
      // console.log("USUARIO ", usuario, " FIN USUARIO");
      usuario.productos.sort((a, b) => {
        // Ordenar por disponibilidad (primero los disponibles)
        if (a.Disponibilidad && !b.Disponibilidad) {
          return -1; // 'a' viene antes de 'b'
        } else if (!a.Disponibilidad && b.Disponibilidad) {
          return 1; // 'b' viene antes de 'a'
        } else {
          return 0; // Mantener el orden original
        }
      });
    });

   

    res.render("main", {body: "datosFiltroCategoria",result,titulo,UserName: req.user });

  } catch (error) {
    console.log(error);
  }
}

export async function MostrarInformacionUsuaro(req, res) {
  try {
    let usuario = req.params.nombreUsuario;
    let usuarioEncontrado = false;
    const usuarios = await prisma.usuario.findMany(); //Encontrar los usuarios

    const dataUsuario = await prisma.$queryRaw`
  SELECT ct.Nombre AS Catalogo, c.Nombre AS Categoria, u.UserName, u.Nombres AS NombresUsuario, u.Apellidos AS ApellidosUsuario, u.Celular AS Celular, u.Imagen, u.id AS UsuarioId, p.Nombre AS NombreProducto, p.Imagen AS ImagenProducto, p.descripcion AS Descripcion, p.precio AS Precio, p.disponibilidad AS Disponibilidad 
  FROM catalogos ct
  JOIN categorias c ON ct.id = c.id_Cat
  JOIN productos p ON p.id_Categoria = c.id
  JOIN usuario u ON u.id = p.id_Usuario
  WHERE u.UserName = ${usuario}
  GROUP BY ct.Nombre, u.UserName, p.Nombre;
`;

    for (let i = 0; i < usuarios.length; i++) {
      // Verificamos si el nombre del usuarios corresponde a pasado por la perticion
      if (usuarios[i].UserName === usuario) {
        // Si encontramos un usuario, retornamos true
        usuarioEncontrado = true;
        break;
      }
    }
   
    const data = {};// Objeto donde almacenaremos los datos agrupados
    if (usuarioEncontrado) {
      

      // Recorremos los datos obtenidos de la consulta
      dataUsuario.forEach((row) => {

        const {
          UserName,
          NombresUsuario,
          ApellidosUsuario,
          Celular,
          Imagen,
          UsuarioId,
          Catalogo,
          Categoria,
          NombreProducto,
          Descripcion,
          Precio,
          Disponibilidad,
          ImagenProducto
        } = row;

        
        const producto = {
          NombreProducto,
          Descripcion,
          Precio,
          Disponibilidad,
          ImagenProducto
        };

       
      
        // Verificamos si el usuario ya existe en dataUsuario
        if (!data[UserName]) {
          // Si el usuario no existe, lo inicializamos con su información básica y detalles
       
          data[UserName] = {
            Imagen: Imagen,
            UserName,
            NombresUsuario,
            ApellidosUsuario,
            Celular,
            catalogos: {}, // Usamos un objeto para almacenar los catálogos únicos
          };
        }

        // Si el catálogo aún no está registrado para este usuario, lo inicializamos
        if (!data[UserName].catalogos[Catalogo]) {
          data[UserName].catalogos[Catalogo] = {};
        }

        // Si la categoría aún no está registrada para este catálogo, la inicializamos
        if (!data[UserName].catalogos[Catalogo][Categoria]) {
          data[UserName].catalogos[Catalogo][Categoria] = [];
        }

        // Agregamos el producto a la lista de productos de la categoría dentro del catálogo
        data[UserName].catalogos[Catalogo][Categoria].push(producto);
      });

      
    } else {
      res.send("Usuario no esta registrado");
    }

    // Ahora data contiene los datos agrupados por catálogo, categoría y productos
    console.log(data);

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element1 = data[key];
       
        for (const key in element1) {
          if (Object.hasOwnProperty.call(element1, key)) {
            const element = element1[key];
            console.log("********* " , element,  " *********")
             for (const key in element) {
              if (Object.hasOwnProperty.call(element, key)) {
                const element2 = element[key];
                console.log(element2)
              }
             }
          }
        }
      }
    }


    res.render("main", { data, titulo: "", body: "indexUsuario",UserName: req.user  });
  } catch (error) {
    console.log(error);
  }
}




//Nuevo
export async function MostrarProductos(req, res){

try {
  
  const productos = await prisma.usuario.findMany({
    include: {
      productos: {
        include: {
          categorias: true, // Incluir la información de categorías relacionadas con los productos
        },
      },
    },
  });
  

return res.render("main", { body: "mostrarProductos", productos, UserName:req.user, titulo:"Productos"});


} catch (error) {
  console.log(error)
}




}
