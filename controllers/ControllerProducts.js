import { ProductService } from "../Services/ProductsService.js";
let service = new ProductService()

export const getAllProductos = async (req, res) => {
    try {

        var products = await service.getAll(6);
      
        if (products == null)
            return res.status(204).json({ message: `No Content`, data: [] });
      
        return res.status(200).json(products);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};


export const getAllProducto = async (req, res) => {
    try {

        var products = await service.getAll();
        console.log(" ********** " , products , " ********* productos ***")
        if (products == null)
            return res.status(204).json({ message: `No Content`, data: [] });
      
        return res.status(200).json(products);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getIndexProductos = async (req, res) => {
 try {
        
        res.render("indexProductos/indexProducto", {
            body: "indexProductos",
            index: "Admin",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
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
