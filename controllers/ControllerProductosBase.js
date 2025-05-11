export async function getProductosBase(req, res) {
    try {
        console.log("Categorias")
        res.render("Administrador/productosBase", {
            body: "productosBase",
            index: "Admin",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}