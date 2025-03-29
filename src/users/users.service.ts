import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUser(
    id: string,
    data: any,
    currentUser: any,
    file?: Express.Multer.File,
  ) {
    if (id !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own account');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    delete data.id;
    delete data.role;
    delete data.createdAt;
    delete data.updatedAt;

    if (file) {
      // Delete the old avatar if it exists
      if (user.avatar) {
        const oldPublicId = user.avatar.split('/').pop()?.split('.')[0];
        if (oldPublicId) await this.cloudinaryService.deleteFile(oldPublicId);
      }

      // Uploading a new avatar
      const uploadedUrls = await this.cloudinaryService.uploadImages(
        [file],
        `users/${id}`,
      );
      data.avatar = uploadedUrls[0];
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string, currentUser: any) {
    if (id !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own account');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.avatar) {
      const publicId = user.avatar.split('/').pop()?.split('.')[0];
      if (publicId) await this.cloudinaryService.deleteFile(publicId);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
