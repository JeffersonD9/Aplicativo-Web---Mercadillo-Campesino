
export function RenderIndex(req, res) {
  try {

    res.render('index', {
    titulo: 'Mercadillo Campesino',
    usuario: req.usuario,
    mensaje: req.query.mensaje || ''
  });

  } catch (error) {
    res.status(404).json({ message: "Error al ingresar al Index" });
  }

}
