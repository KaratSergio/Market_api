import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(adId: string) {
    return this.prisma.comment.findMany({
      where: { adId },
      select: {
        id: true,
        text: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async create(adId: string, userId: string, text: string) {
    return this.prisma.comment.create({
      data: {
        adId,
        userId,
        text,
      },
    });
  }
}
