import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const format = file.mimetype.split('/')[1] || 'png';

      return {
        folder: 'diploma-images',
        format,
        resource_type: 'image',
      };
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }

    return cb(null, false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
