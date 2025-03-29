import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AdsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    userId: string,
    createAdDto: CreateAdDto,
    files: Express.Multer.File[],
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const ad = await this.prisma.ad.create({
      data: {
        userId,
        title: createAdDto.title,
        description: createAdDto.description,
        price: createAdDto.price,
        categoryId: createAdDto.categoryId,
        subcategoryId: createAdDto.subcategoryId,
        location: createAdDto.location,
      },
    });

    let imageUrls: string[] = [];
    if (files.length > 0) {
      const folderName = `ads/${userId}/${ad.id}`;
      imageUrls = await this.cloudinaryService.uploadImages(files, folderName);
    }

    const uploadedImages = imageUrls.map((url) => ({ url }));
    const updatedAd = await this.prisma.ad.update({
      where: { id: ad.id },
      data: {
        images: {
          create: uploadedImages,
        },
      },
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
      },
    });

    return { message: 'Ad created successfully', ad: updatedAd };
  }

  async findAll() {
    const ads = await this.prisma.ad.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
        subcategory: { select: { name: true } },
        images: { select: { url: true } },
      },
    });

    return { message: 'Ads fetched successfully', ads };
  }

  async findOne(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
        subcategory: { select: { name: true } },
        comments: { select: { text: true } },
        images: { select: { url: true } },
      },
    });

    if (!ad) {
      throw new Error('Ad not found');
    }

    return { message: 'Ad fetched successfully', ad };
  }

  async update(id: string, userId: string, dto: UpdateAdDto) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new Error('Ad not found');
    }

    if (ad.userId !== userId) {
      throw new Error('Ad not owned by the user');
    }

    const updatedAd = await this.prisma.ad.update({
      where: { id },
      data: dto as Prisma.AdUpdateInput,
    });

    return { message: 'Ad updated successfully', updatedAd };
  }

  async remove(id: string, userId: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      select: { id: true, userId: true, images: { select: { url: true } } },
    });

    if (!ad) {
      throw new Error('Ad not found');
    }

    if (ad.userId !== userId) {
      throw new Error('Ad not owned by the user');
    }

    if (ad.images.length > 0) {
      const folderName = `ads/${userId}/${ad.id}`;

      for (const image of ad.images) {
        const publicId = image.url.split('/').pop()?.split('.')[0];
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId);
        }
      }
      await this.cloudinaryService.deleteAllImagesInFolder(folderName);
    }

    await this.prisma.ad.delete({ where: { id } });

    return { message: 'Ad deleted successfully' };
  }
}
