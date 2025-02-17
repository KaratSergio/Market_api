import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtUserPayload } from '@common/interfaces/jwt-payload.interface';
import { PrismaService } from '@prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await argon2.verify(user.password, pass))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async register(email: string, password: string) {
    if (await this.isUserExists(email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return this.login(newUser);
  }

  private async isUserExists(email: string): Promise<boolean> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!existingUser;
  }
}
