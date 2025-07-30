import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const profileDest = path.join(__dirname, '../public/profileImages/');

        cb(null, profileDest);
    },

    filename: (req, file, cb) => {
        const fileName = file.originalname.split('.')[0];

        const profileImageName =
            Date.now() + ' ' + fileName + path.extname(file.originalname);

        cb(null, profileImageName);
    },
});

const profileImageUpload = multer({ storage });

export default profileImageUpload;
