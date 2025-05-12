import { MercadilloService } from "../Services/MercadillosService.js";

const service = new MercadilloService();

/**
 * Obtiene todos los mercadillos
 * @param {Request} req - Objeto de solicitud 
 * @param {Response} res - Objeto de respuesta
 */
export async function getAllMercadillos(req, res) {
    try {
        const mercadillos = await service.getAll();
        // res.status(200).json({
        //     success: true,
        //     data: mercadillos
        // });

        res.render("Administrador/mercadillo", {
            UserName: req.user,
            body: "mercadillo",
            mercadillo: mercadillos,
            index: "Admin",
        });

        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}



export async function getMercadillosJson(req, res) {
    try {
        const mercadillos = await service.getAll();
        console.log(mercadillos)
        res.status(200).json(mercadillos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


/**
 * Obtiene un mercadillo por su ID
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
export async function getMercadilloById(req, res) {
    try {
        const id_mercadillo = parseInt(req.params.id, 10);

        if (isNaN(id_mercadillo)) {
            return res.status(400).json({ message: "ID de mercadillo inválido" });
        }

        const mercadillo = await service.getById(id_mercadillo);

        if (mercadillo == null) {
            return res.status(404).json({ message: `No se encontró el mercadillo con ID: ${id_mercadillo}` });
        }

        res.status(200).json({
            success: true,
            data: mercadillo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Crea un nuevo mercadillo
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
export async function createMercadillo(req, res) {
    try {
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Datos de mercadillo vacíos" });
        }

        const newMercadillo = await service.create(data);

        res.status(201).json({
            success: true,
            message: "Mercadillo creado correctamente",
            data: newMercadillo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Actualiza un mercadillo existente
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
export async function updateMercadillo(req, res) {
    try {
        const id_mercadillo = parseInt(req.params.id_mercadillo, 10);
        const data = req.body;

        if (isNaN(id_mercadillo)) {
            return res.status(400).json({ message: "ID de mercadillo inválido" });
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Datos de actualización vacíos" });
        }

        const updatedMercadillo = await service.update(id_mercadillo, data);

        if (updatedMercadillo == null) {
            return res.status(400).json({ message: "Error al actualizar el mercadillo" });
        }
        res.status(200).json({
            message: "Mercadillo actualizado correctamente",
            data: updatedMercadillo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Elimina un mercadillo
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
export async function deleteMercadillo(req, res) {
    try {
        
        const id_mercadillo = parseInt(req.params.id_mercadillo, 10);
        if (isNaN(id_mercadillo)) {
            return res.status(400).json({ message: "ID de mercadillo inválido" });
        }

        const deletedMercadillo = await service.delete(id_mercadillo);

        if (!deletedMercadillo) {
            return res.status(404).json({ message: `No se encontró el mercadillo con ID: ${id_mercadillo}` });
        }

        res.status(200).json({
            message: "Mercadillo eliminado correctamente",
            data: deletedMercadillo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}