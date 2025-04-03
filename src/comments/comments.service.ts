import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // FIND ALL COMMENTS BY AD
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

  // CREATE COMMENT
  async create(adId: string, userId: string, text: string) {
    return this.prisma.comment.create({
      data: {
        adId,
        userId,
        text,
      },
    });
  }

  // UPDATE COMMENT
  async update(commentId: string, userId: string, text: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { text },
    });
  }

  // DELETE COMMENT
  async delete(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
