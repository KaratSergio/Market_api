import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AdsModule } from './ads/ads.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AdsModule,
    AuthModule,
    CloudinaryModule,
    CommentsModule,
  ],
})
export class AppModule {}
