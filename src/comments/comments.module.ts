import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaService } from '@prisma/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
})
export class CommentsModule {}
