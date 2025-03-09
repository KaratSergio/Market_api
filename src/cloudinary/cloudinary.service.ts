import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImages(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const uploadedUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: folderName,
            public_id: file.originalname.split('.')[0],
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result?.secure_url);
          },
        );
        uploadStream.end(file.buffer);
      });

      uploadedUrls.push(uploadedUrl);
    }

    return uploadedUrls;
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  }
}
