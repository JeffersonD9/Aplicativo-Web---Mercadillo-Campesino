
export async function getProductos(req, res) {
  try {
    const userId = req.user.id;

    const productos = await prisma.productospersonalizados.findMany({
      where: {
        Id_Usuario: userId
      }
    });

    return res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function crearProducto(req, res) {
  try {
    const { Id_producto, Nombre, Descripcion, Categoria } = req.body;
    const userId = req.user.id;

    // Manejo de imagen
    let rutaImagen = '';
    if (req.file) {
      // Guardar la imagen en una carpeta de uploads
      const uploadDir = path.join(__dirname, '../uploads/productos');

      // Crear directorio si no existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);
      rutaImagen = `/uploads/productos/${fileName}`;
    }

    // Validar datos requeridos
    if (!Id_producto || !Nombre || !Descripcion || !Categoria) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Crear producto en la base de datos
    const nuevoProducto = await prisma.productospersonalizados.create({
      data: {
        Id_Usuario: userId,
        Id_producto: parseInt(Id_producto),
        Nombre,
        Descripcion,
        Imagen: rutaImagen,
        Categoria
      }
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    const { Id_producto, Nombre, Descripcion, Categoria } = req.body;
    const userId = req.user.id;

    // Verificar que el producto exista y pertenezca al usuario
    const productoExistente = await prisma.productospersonalizados.findFirst({
      where: {
        Id: parseInt(id),
        Id_Usuario: userId
      }
    });

    if (!productoExistente) {
      return res.status(404).json({ message: "Producto no encontrado o no tienes permiso para modificarlo" });
    }

    // Manejo de imagen
    let rutaImagen = productoExistente.Imagen;
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (productoExistente.Imagen && fs.existsSync(path.join(__dirname, '..', productoExistente.Imagen))) {
        fs.unlinkSync(path.join(__dirname, '..', productoExistente.Imagen));
      }

      // Guardar nueva imagen
      const uploadDir = path.join(__dirname, '../uploads/productos');

      // Crear directorio si no existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);
      rutaImagen = `/uploads/productos/${fileName}`;
    }

    // Actualizar producto
    const productoActualizado = await prisma.productospersonalizados.update({
      where: {
        Id: parseInt(id)
      },
      data: {
        Id_producto: Id_producto ? parseInt(Id_producto) : productoExistente.Id_producto,
        Nombre: Nombre || productoExistente.Nombre,
        Descripcion: Descripcion || productoExistente.Descripcion,
        Imagen: rutaImagen,
        Categoria: Categoria || productoExistente.Categoria
      }
    });

    return res.status(200).json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar que el producto exista y pertenezca al usuario
    const productoExistente = await prisma.productospersonalizados.findFirst({
      where: {
        Id: parseInt(id),
        Id_Usuario: userId
      }
    });

    if (!productoExistente) {
      return res.status(404).json({ message: "Producto no encontrado o no tienes permiso para eliminarlo" });
    }

    // Eliminar imagen si existe
    if (productoExistente.Imagen && fs.existsSync(path.join(__dirname, '..', productoExistente.Imagen))) {
      fs.unlinkSync(path.join(__dirname, '..', productoExistente.Imagen));
    }

    // Eliminar producto
    await prisma.productospersonalizados.delete({
      where: {
        Id: parseInt(id)
      }
    });

    return res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
