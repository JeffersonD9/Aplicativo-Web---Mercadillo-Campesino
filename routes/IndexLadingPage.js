
import { Router } from 'express';
const router = Router();
import { getAllProducto, getAllProductos, getIndexProductos, getProductosByCategoria } from '../controllers/ControllerProducts.js';

router.get('/Inicio/Productos', getAllProductos);
router.get('/todosProductos', getAllProducto);
//router.get('/featured', getFeaturedProductos);
router.get('/categoria/:categoria', getProductosByCategoria);

router.get("/productos", getIndexProductos)



export default router;