import multer from 'multer';
import { fileURLToPath } from 'url';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) throw new AppError(constants.BAD_REQUEST, 'Image is required');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const profileDest = path.join(__dirname, '../public/blogImages/');

    cb(null, profileDest);
  },

  filename: (req, file, cb) => {
    const fileName = file.originalname.split('.')[0];

    const profileImageName =
      Date.now() + ' ' + fileName + path.extname(file.originalname);

    cb(null, profileImageName);
  },
});

const blogImageUpload = multer({ storage });

export default blogImageUpload;
