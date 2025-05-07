export async function getCategorias(req, res) {
    try {
        console.log("Categorias")
        res.render("Administrador/categorias", {
            body: "categorias",
            index: "Admin",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}