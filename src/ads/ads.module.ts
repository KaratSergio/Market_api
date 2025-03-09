import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { PrismaModule } from '@prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule, CloudinaryModule],
  providers: [AdsService],
  controllers: [AdsController],
})
export class AdsModule {}
