import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('ad')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET COMMENTS BY AD ID
  @ApiOperation({ summary: 'Get all comments for an ad' })
  @ApiResponse({ status: 200, description: 'Returns a list of comments' })
  @Get(':adId/comments')
  async getComments(@Param('adId') adId: string) {
    return this.commentsService.findAll(adId);
  }

  // CREATE COMMENT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on an ad' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @UseGuards(JwtAuthGuard)
  @Post(':adId/comments')
  async createComment(
    @Request() req: any,
    @Param('adId') adId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = req.user.id;
    return this.commentsService.create(adId, userId, createCommentDto.text);
  }

  // UPDATE COMMENT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @UseGuards(JwtAuthGuard)
  @Patch('comments/:commentId')
  async updateComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: any,
  ) {
    const userId = req.user.id;
    return this.commentsService.update(
      commentId,
      userId,
      updateCommentDto.text,
    );
  }

  // DELETE COMMENT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @UseGuards(JwtAuthGuard)
  @Delete('comments/:commentId')
  async deleteComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
  ) {
    const userId = req.user.id;
    return this.commentsService.delete(commentId, userId);
  }
}
