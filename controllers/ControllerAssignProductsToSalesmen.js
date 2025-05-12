import { CustomProducts } from "../Services/CustomProducts.js";
const customProductsService = new CustomProducts();

export async function getProductosRender(req, res) {
    try {
     const userId = req.user.id;
     const result = await customProductsService.getProductsByUserId(userId);

      res.render("Campesino/productos", {
          UserName: req.user,
          body: "productos",
          data: result,
          index: "campesino",
      });
      console.log(result.data)
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

export async function getProductos(req, res) {
  try {
    const userId = req.user.id;
    const result = await customProductsService.getProductsByUserId(userId);

    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(500).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error en controlador de productos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


export async function crearProducto(req, res) {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const { Id_producto, NombreProducto, Descripcion, NombreCategoria } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!Id_producto || isNaN(Id_producto)) {
      return res.status(400).json({ message: 'Id_producto es obligatorio y debe ser un número' });
    }
    if (!NombreProducto) {
      return res.status(400).json({ message: 'NombreProducto es obligatorio' });
    }
    if (!Descripcion) {
      return res.status(400).json({ message: 'Descripción es obligatoria' });
    }
    if (!NombreCategoria) {
      return res.status(400).json({ message: 'NombreCategoria es obligatorio' });
    }
    // Opcional: Validar imagen si es obligatoria
    // if (!req.file) {
    //   return res.status(400).json({ message: 'Imagen es obligatoria' });
    // }

    console.log('Datos extraídos:', { Id_producto, NombreProducto, Descripcion, NombreCategoria, userId });

    const result = await customProductsService.create(
      { Id_producto, NombreProducto, Descripcion, NombreCategoria, userId },
      req.file
    );

    if (result.success) {
      return res.status(201).json(result.data);
    } else {
      return res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error en controlador de productos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


// export async function actualizarProducto(req, res) {
//   try {
//     const { Id } = req.params;
//     const { NombreProducto, Descripcion, NombreCategoria } = req.body;
//     const userId = req.user.id;

//     const result = await customProductsService.update(
//       Id,
//       { NombreProducto, Descripcion, NombreCategoria, userId },
//       req.file
//     );

//     if (result.success) {
//       return res.status(200).json(result.data);
//     } else {
//       return res.status(404).json({ message: result.error });
//     }
//   } catch (error) {
//     console.error("Error en controlador de productos:", error);
//     return res.status(500).json({ message: "Error interno del servidor" });
//   }
// }
export async function actualizarProducto(req, res) {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('req.params:', req.params);

    const { Id } = req.params;
    const userId = req.user.id;
    const updates = {};

    // Construir objeto de actualización dinámicamente
    if ('Id_producto' in req.body) {
      updates.Id_producto = req.body.Id_producto;
    }
    if ('NombreProducto' in req.body) {
      updates.NombreProducto = req.body.NombreProducto;
    }
    if ('Descripcion' in req.body) {
      updates.Descripcion = req.body.Descripcion;
    }
    if ('NombreCategoria' in req.body) {
      updates.NombreCategoria = req.body.NombreCategoria;
    }
    
    if ('Estado' in req.body) {
      updates.Estado = req.body.Estado;
    }
    
    // Validar si se proporcionó al menos un campo para actualizar
    if (Object.keys(updates).length === 0 && !req.file) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    // Agregar Id y userId al objeto de actualización
    updates.Id = parseInt(Id);
    updates.userId = userId;

    console.log('Datos para actualizar:', updates, 'Archivo:', req.file);

    // Llamar al servicio de actualización
    const result = await customProductsService.update(updates, req.file);

    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Error en controlador de actualizar producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}




export async function eliminarProducto(req, res) {
  try {
    const { Id } = req.params;
    const userId = req.user.id;

    const result = await customProductsService.delete(Id, userId);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error en controlador de productos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}