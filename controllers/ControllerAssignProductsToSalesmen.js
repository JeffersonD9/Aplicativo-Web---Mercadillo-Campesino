eliminarProducto: async (req, res) => {
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
};