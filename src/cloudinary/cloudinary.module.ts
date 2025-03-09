import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryStorageService } from './cloudinary.storage';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, CloudinaryStorageService],
  exports: [CloudinaryService, CloudinaryStorageService],
})
export class CloudinaryModule {}
