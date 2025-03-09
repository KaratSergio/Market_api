import path from 'path';
import multer from 'multer';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Injectable()
export class CloudinaryStorageService {
  private storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const { userId, adId } = req.params;
      const folder = `ads/${userId}/${adId}`;

      return {
        folder: folder,
        format: file.mimetype.split('/')[1],
        public_id: path.basename(
          file.originalname,
          path.extname(file.originalname),
        ),
        resource_type: 'image',
      };
    },
  });

  multerMiddleware() {
    return multer({ storage: this.storage }).array('images', 5);
  }
}
