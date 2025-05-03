import { ProductService } from "../Services/ProductsService.js";
let service = new ProductService()

export const getAllProductos = async (req, res) => {
    try {

        var products = await service.getAll(6);
        console.log(products)
        if (products == null)
            return res.status(204).json({ message: `No Content`, data: [] });
      
        return res.status(200).json(products);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getProductosByCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;

        if (categoria === undefined || categoria === null || categoria === "")
            return res.status(402).json({ message: `La categoria no puede estar vaciá` });

        var products = await service.getByCategory(categoria);
        if (products == null)
            return res.status(204).json({ message: `No Content`, data: [] });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener productos por categoría' });
    }
};
