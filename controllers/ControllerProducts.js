import { ProductService } from "../Services/ProductsService.js";
let service = new ProductService()

export const getAllProductos = async (req, res) => {
    try {

        var products = service.getAll(6);
        res.status(200).json(products);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getProductosByCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;   
        var products = service.getByCategory(categoria);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener productos por categoría' });
    }
};
