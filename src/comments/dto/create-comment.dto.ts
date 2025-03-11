import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment.',
  })
  @IsString()
  text: string;

  @IsUUID()
  adId: string;

  @IsUUID()
  userId: string;
}
