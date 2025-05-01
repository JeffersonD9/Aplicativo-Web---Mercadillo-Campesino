
import { Router } from 'express';
const router = Router();
import { getAllProductos, getProductosByCategoria } from '../controllers/ControllerProducts.js';

router.get('/Inicio/Productos', getAllProductos);
//router.get('/featured', getFeaturedProductos);
router.get('/categoria/:categoria', getProductosByCategoria);

export default router;