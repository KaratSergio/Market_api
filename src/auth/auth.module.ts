import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './jwt/local.strategy';
import { UsersModule } from '@users/users.module';
import { PrismaService } from '@prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    LocalStrategy,
    PrismaService,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
