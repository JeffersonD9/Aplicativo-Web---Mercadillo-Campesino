import multer from "multer";
import path from "path";

// Configurar Multer para guardar archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("imagenes")); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nombre original del archivo con timestamp
  },
});

// Crear una instancia de Multer con la configuración de almacenamiento
const FileUpload = multer({ storage: storage }).single("file");

export { FileUpload };
