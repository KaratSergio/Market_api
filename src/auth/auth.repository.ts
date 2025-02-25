import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }

  async saveRefreshToken(
    userId: string,
    email: string,
    hashedToken: string,
  ): Promise<void> {
    await this.prisma.token.create({
      data: {
        userId,
        email,
        token: hashedToken,
        type: 'REFRESH',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
    });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.prisma.token.deleteMany({
      where: { userId },
    });
  }

  async findTokenByUserId(userId: string) {
    return this.prisma.token.findFirst({
      where: {
        userId,
      },
    });
  }
}
