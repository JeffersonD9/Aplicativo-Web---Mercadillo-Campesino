import { Router } from "express";
import { RenderDashboardAdmin, MostrarUsuarios, EliminarUsuario, getUsuariosJson } from '../controllers/ControllerAuthAdmin.js'
import { authRequired } from '../MiddleWares/ValidateToken.js'
import { createMercadillo, deleteMercadillo, getAllMercadillos, getMercadilloById, getMercadillosJson, updateMercadillo } from "../controllers/ControllerMercadillos.js";
import { UpdateVendedor } from "../controllers/ControllerAuthSalesman.js";
import { Register } from "../controllers/ControllerRegister.js";
import { getCategorias } from "../controllers/controllerCategorias.js";
import { getProductosBase } from "../controllers/ControllerProductosBase.js";

const router = Router()

router.get('/Admin', authRequired, RenderDashboardAdmin);
//router.put('/Admin/:id_admin',authRequired, ActualizarAdmin);

router.get('/Admin/Usuarios', authRequired, MostrarUsuarios);
router.get('/api/usuarios', authRequired, getUsuariosJson);
router.delete('/Admin/Usuarios/delete/:id_usuario', authRequired, EliminarUsuario)
router.patch('/Admin/Usuarios/edit/:id_vendedor',authRequired,UpdateVendedor)
router.post("/Admin/Usuarios/Registrar", authRequired,Register);

// Productos

router.get('/Admin/Productos/create');
router.get('/Admin/Productos/edit');
router.get('/Admin/Productos/',getProductosBase);

// Categorias

router.get('/Admin/Categorias/create');
router.get('/Admin/Categorias/edit');
router.get('/Admin/Categorias/',getCategorias);

// Mercadillos

router.get('/Admin/Mercadillos', authRequired, getAllMercadillos)
router.get('/api/mercadillos', authRequired, getMercadillosJson);
router.get('/Admin/Mercadillos/:id_mercadillo', authRequired, getMercadilloById)
router.post('/Admin/Mercadillos/create', authRequired, createMercadillo)
router.patch('/Admin/Mercadillos/:id_mercadillo', authRequired, updateMercadillo)
router.delete('/Admin/Mercadillos/:id_mercadillo', authRequired, deleteMercadillo)






export default router