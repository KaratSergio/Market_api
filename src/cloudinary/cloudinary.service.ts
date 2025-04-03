import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  // UPLOAD IMAGES
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

  // DELETE IMAGES
  async deleteFile(publicId: string): Promise<UploadApiResponse> {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
    return result;
  }

  // Method to delete all images in a folder
  async deleteAllImagesInFolder(folderName: string): Promise<void> {
    try {
      // Get a list of all images in the folder
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderName,
        max_results: 500,
      });

      if (result.resources.length > 0) {
        // Delete all images
        for (const resource of result.resources) {
          const publicId = resource.public_id;
          const deleteResult = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
          });
          console.log(`Removed image with publicId: ${publicId}`, deleteResult);
        }
      } else {
        console.log(`There are no images to delete in ${folderName}`);
      }
    } catch (error) {
      console.error('Error deleting images from folder:', error);
    }
  }
}
