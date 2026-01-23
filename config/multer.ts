import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'diploma-images',
      format: file.mimetype.split('/')[1],
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;
