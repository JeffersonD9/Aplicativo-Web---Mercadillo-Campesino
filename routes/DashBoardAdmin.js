import { Router } from "express";
import { RenderDashboardAdmin, MostrarUsuarios, EliminarUsuario, getPuestoSugerido } from '../controllers/ControllerAuthAdmin.js'
import { authRequired } from '../MiddleWares/ValidateToken.js'
import { createMercadillo, deleteMercadillo, getAllMercadillos, getMercadilloById, updateMercadillo } from "../controllers/ControllerMercadillos.js";
import { UpdateVendedor } from "../controllers/ControllerAuthSalesman.js";
import { Register } from "../controllers/ControllerRegister.js";

const router = Router()

router.get('/Admin', authRequired, RenderDashboardAdmin);
//router.put('/Admin/:id_admin',authRequired, ActualizarAdmin);

router.get('/Admin/Usuarios', authRequired, MostrarUsuarios);
router.delete('/Admin/Usuarios/delete:id_usuario', authRequired, EliminarUsuario)
router.patch('/Admin/Usuarios/edit/:id_vendedor', authRequired, UpdateVendedor)
router.post("/Admin/Usuarios/Registrar", Register)
router.get('/Admin/Usuarios/puesto-sugerido',getPuestoSugerido)

// Productos

router.get('/Admin/Productos/create');
router.get('/Admin/Productos/edit');
router.get('/Admin/Productos/');

// Categorias

router.get('/Admin/Categorias/create');
router.get('/Admin/Categorias/edit');
router.get('/Admin/Categorias/');

// Mercadillos

router.get('/Admin/Mercadillos', authRequired, getAllMercadillos)
router.get('/Admin/Mercadillos/:id_mercadillo', authRequired, getMercadilloById)
router.post('/Admin/Mercadillos/create', authRequired, createMercadillo)
router.patch('/Admin/Mercadillos/:id_mercadillo', authRequired, updateMercadillo)
router.delete('/Admin/Mercadillos/:id_mercadillo', authRequired, deleteMercadillo)


export default router