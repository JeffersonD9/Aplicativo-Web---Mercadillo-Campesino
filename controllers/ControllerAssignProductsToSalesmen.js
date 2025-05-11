import { CustomProducts } from "../Services/CustomProducts.js";
const customProductsService = new CustomProducts();

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
    const { Id_producto, NombreProducto, Descripcion, NombreCategoria } = req.body;
    const userId = req.user.id;

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

export async function actualizarProducto(req, res) {
  try {
    const { Id } = req.params;
    const { NombreProducto, Descripcion, NombreCategoria } = req.body;
    const userId = req.user.id;

    const result = await customProductsService.update(
      Id,
      { NombreProducto, Descripcion, NombreCategoria, userId },
      req.file
    );

    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(404).json({ message: result.error });
    }
  } catch (error) {
    console.error("Error en controlador de productos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
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