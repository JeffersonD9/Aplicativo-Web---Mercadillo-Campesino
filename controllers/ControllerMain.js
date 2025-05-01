
export function RenderIndex(req, res) {
  try {

    const mensaje = req.query.mensaje;
    console.log("Session", mensaje)
    res.render('index/index',{mensaje});

  } catch (error) {
    res.status(404).json({ message: "Error al ingresar al Index" });
  }

}
