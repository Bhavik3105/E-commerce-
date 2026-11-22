import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

export const uploadDir = path.join(process.cwd(), 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const allowed = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

export const photoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDir),
    filename: (_req, file, callback) => {
      const ext = allowed.get(file.mimetype) ?? '.jpg';
      callback(null, `${crypto.randomBytes(16).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowed.has(file.mimetype)) {
      callback(new Error('Use a JPG, PNG, or WEBP photo.'));
      return;
    }
    callback(null, true);
  },
});
