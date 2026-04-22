import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.resolve(__dirname, '..', '..', 'uploads');
const productUploadDir = path.join(uploadRoot, 'products');
const blogUploadDir = path.join(uploadRoot, 'blog');
const downloadUploadDir = path.join(uploadRoot, 'downloads');

// Ensure upload directories exist
const uploadDirs = [productUploadDir, blogUploadDir, downloadUploadDir];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image' || file.fieldname === 'screenshots') {
      if (req.route.path.includes('/products')) {
        cb(null, productUploadDir);
        return;
      } else if (req.route.path.includes('/blog')) {
        cb(null, blogUploadDir);
        return;
      } else {
        cb(null, productUploadDir);
        return;
      }
    } else if (file.fieldname === 'download') {
      cb(null, downloadUploadDir);
      return;
    }

    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images for products and blog
  if (file.fieldname === 'image' || file.fieldname === 'screenshots') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
  // Allow zip files for downloads
  else if (file.fieldname === 'download') {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed for downloads'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

export default upload;
