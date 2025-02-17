import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAdDto: CreateAdDto) {
    return await this.prisma.ad.create({
      data: {
        userId,
        title: createAdDto.title,
        description: createAdDto.description,
        price: createAdDto.price,
        categoryId: createAdDto.categoryId,
        subcategoryId: createAdDto.subcategoryId,
        location: createAdDto.location,
        images: {
          create: createAdDto.images.map((image) => ({
            url: image.url,
          })),
        },
      },
      include: {
        category: true,
        subcategory: true,
      },
    });
  }

  async findAll() {
    return this.prisma.ad.findMany({
      where: { status: 'ACTIVE' },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.ad.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
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
