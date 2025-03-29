import multer from 'multer'
import path from 'path';

export async function SaveImage(){

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'Image_Products'));
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    return storage
}

export async function CatchImage(){

}

export async function LoadImage(){
    

}

const upload = multer({ storage: storage });