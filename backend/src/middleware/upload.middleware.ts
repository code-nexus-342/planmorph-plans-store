import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedCadTypes = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase().substring(1);
  const mimetype = file.mimetype;

  // Check extension
  const isImageExt = allowedImageTypes.test(extname);
  const isCadExt = allowedCadTypes.test(extname);

  if (isImageExt || isCadExt) {
    return cb(null, true);
  } else {
    cb(new Error('Error: File type not allowed! Only images (jpeg, jpg, png, webp) and CAD PDFs are accepted.'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit (CAD files can be large)
  },
  fileFilter: fileFilter,
});
