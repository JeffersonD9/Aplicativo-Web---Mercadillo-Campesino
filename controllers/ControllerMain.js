
export function RenderIndex(req, res) {
  try {

    res.render('index/index');

  } catch (error) {
    res.status(404).json({ message: "Error al ingresar al Index" });
  }

}
