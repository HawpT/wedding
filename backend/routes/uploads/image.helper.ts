/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import multer from 'multer';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const uploadPath = join(__dirname, 'uploads');

if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExt = file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, file.fieldname + '-' + Date.now() + fileExt);
  }
});

export const upload = multer({
  storage: storage
});

export function createImageObject(req: any): any {
  return req.file ? {
    data: readFileSync(join(uploadPath, req.file.filename)),
    contentType: 'image/*'
  } : null;
}