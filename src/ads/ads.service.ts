import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
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
    return this.prisma.ad.update({
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
  }

  async findAll() {
    return this.prisma.ad.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
        subcategory: { select: { name: true } },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.ad.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
        subcategory: { select: { name: true } },
        comments: { select: { text: true } },
        images: { select: { url: true } },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateAdDto) {
    return this.prisma.ad.updateMany({
      where: { id, userId },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const deletedAd = await this.prisma.ad.deleteMany({
      where: { id, userId },
    });

    if (!deletedAd.count) {
      throw new Error('Ad not found or not owned by the user');
    }

    return deletedAd;
  }
}
