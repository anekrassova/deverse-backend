import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';
import { logger } from '../shared/logger.js';

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      logger.debug({
        msg: '[multer] preparing cloudinary params',
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: (file as Express.Multer.File).size,
      });

      const format = file.mimetype.split('/')[1] || 'png';

      return {
        folder: 'diploma-images',
        format,
        resource_type: 'image',
      };
    },
  }),
  fileFilter: (req, file, cb) => {
    logger.debug({
      msg: '[multer] fileFilter input',
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      headers: {
        'content-type': req.headers['content-type'],
      },
      bodyKeys: Object.keys(req.body || {}),
    });

    if (file.mimetype.startsWith('image/')) {
      logger.debug({ msg: '[multer] file accepted' });
      return cb(null, true);
    }

    logger.debug({ msg: '[multer] file rejected because mimetype is not image/*' });
    return cb(null, false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
