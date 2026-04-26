import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }

    return cb(null, false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
